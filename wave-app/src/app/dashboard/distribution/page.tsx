import { createAdminClient } from '@/lib/supabase/server'
import DistributionClient from './DistributionClient'

export const dynamic = 'force-dynamic'

export interface SequenceEmail {
  id: string
  sequence_id: string
  order_num: number
  subject: string
  preview_text: string | null
  body: string | null
  delay_days: number | null
}

export interface EmailSequence {
  id: string
  name: string
  status: string
  type: string
  trigger_type: string | null
  campaign_id: string | null
  created_at: string
  email_count: number
  emails: SequenceEmail[]
}

export default async function DistributionPage() {
  const supabase = await createAdminClient()

  let sequences: EmailSequence[] = []

  if (supabase) {
    const [{ data: seqData }, { data: emailData }] = await Promise.all([
      supabase.from('email_sequences').select('id, name, status, type, trigger_type, campaign_id, created_at'),
      supabase.from('sequence_emails').select('id, sequence_id, order_num, subject, preview_text, body, delay_days')
    ])

    const emailsBySeqId: Record<string, SequenceEmail[]> = {}
    ;(emailData || []).forEach(email => {
      if (!emailsBySeqId[email.sequence_id]) emailsBySeqId[email.sequence_id] = []
      emailsBySeqId[email.sequence_id].push(email)
    })

    sequences = (seqData || []).map((seq: any) => ({
      id: seq.id,
      name: seq.name,
      status: seq.status,
      type: seq.type,
      trigger_type: seq.trigger_type,
      campaign_id: seq.campaign_id,
      created_at: seq.created_at,
      email_count: emailsBySeqId[seq.id]?.length || 0,
      emails: emailsBySeqId[seq.id]?.sort((a, b) => a.order_num - b.order_num) || [],
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return <DistributionClient sequences={sequences} />
}
