import Link from "next/link"
import { createAdminClient } from '@/lib/supabase/server'
import ContentClient from './ContentClient'

export const dynamic = 'force-dynamic'

export interface ContentItem {
  id: string
  title: string
  status: string
  channel: string
  date: string
  author: string
  build_phase: string | null
  raw_date: string
}

export default async function ContentCalendarPage() {
  const supabase = await createAdminClient()

  let items: ContentItem[] = []

  if (supabase) {
    const { data } = await supabase
      .from('build_tracker')
      .select('id, deliverable_name, status, build_phase, assigned_to, created_at')
      .order('created_at', { ascending: false })
      .limit(200)

    items = (data || []).map((item: any) => {
      const d = new Date(item.created_at)
      return {
        id: item.id,
        title: item.deliverable_name,
        status: item.status,
        channel: item.build_phase?.replace('Phase 3 — Commercial Layer', 'Commercial') || 'Phase 1',
        build_phase: item.build_phase,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        raw_date: item.created_at,
        author: item.assigned_to || 'Unassigned',
      }
    })
  }

  return <ContentClient items={items} />
}
