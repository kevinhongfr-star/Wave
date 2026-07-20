import { createAdminClient } from '@/lib/supabase/server'
import CampaignsClient from './CampaignsClient'

export const dynamic = 'force-dynamic'

interface CampaignRow {
  id: string
  name: string
  status: string
  content_count: number
  build_phase: string
  start_date: string
  owner: string | null
}

export default async function CampaignsPage() {
  const supabase = await createAdminClient()

  let campaigns: CampaignRow[] = []

  if (supabase) {
    // Derive campaigns from build_tracker — group by build_phase
    const { data } = await supabase
      .from('build_tracker')
      .select('id, deliverable_name, status, build_phase, created_at, assigned_to')

    if (data) {
      const groups: Record<string, CampaignRow> = {}
      for (const row of data) {
        const phase = row.build_phase || 'Unassigned'
        if (!groups[phase]) {
          groups[phase] = {
            id: phase.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: phase,
            status: 'planning',
            content_count: 0,
            build_phase: phase,
            start_date: row.created_at,
            owner: row.assigned_to,
          }
        }
        groups[phase].content_count += 1
        // Track earliest start date
        if (new Date(row.created_at) < new Date(groups[phase].start_date)) {
          groups[phase].start_date = row.created_at
        }
      }
      campaigns = Object.values(groups).sort(
        (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      )
    }
  }

  return <CampaignsClient campaigns={campaigns} />
}
