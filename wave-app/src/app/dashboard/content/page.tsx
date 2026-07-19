import Link from "next/link"
import { createAdminClient } from '@/lib/supabase/server'
import ContentClient from './ContentClient'

export const dynamic = 'force-dynamic'

export default async function ContentCalendarPage() {
  const supabase = await createAdminClient()
  
  let items: any[] = []
  
  if (supabase) {
    const { data } = await supabase
      .from('build_tracker')
      .select('deliverable_name, status, build_phase, assigned_to, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
    
    items = (data || []).map((item: any) => ({
      title: item.deliverable_name,
      status: item.status,
      channel: item.build_phase?.replace('Phase 3 — Commercial Layer', 'Commercial') || 'Phase 1',
      date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      author: item.assigned_to || 'Unassigned',
    }))
  }

  return <ContentClient items={items} />
}
