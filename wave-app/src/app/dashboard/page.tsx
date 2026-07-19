import { createAdminClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createAdminClient()
  
  if (!supabase) {
    return <div className="p-6">Supabase not configured</div>
  }

  // Fetch counts for KPIs
  const [
    { count: productsCount },
    { count: sequencesCount },
    { count: assetsCount },
    { count: buildCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('email_sequences').select('*', { count: 'exact', head: true }),
    supabase.from('assets').select('*', { count: 'exact', head: true }),
    supabase.from('build_tracker').select('*', { count: 'exact', head: true }),
  ])

  // Fetch recent assets for activity feed
  const { data: recentAssets } = await supabase
    .from('assets')
    .select('name, status, assigned_to, created_at')
    .order('created_at', { ascending: false })
    .limit(6)

  // Fetch email sequences for display
  const { data: sequences } = await supabase
    .from('email_sequences')
    .select('name, status, type')
    .order('created_at', { ascending: false })
    .limit(5)

  const kpis = [
    { label: 'Products', value: productsCount?.toString() || '0', icon: 'package' },
    { label: 'Email Sequences', value: sequencesCount?.toString() || '0', icon: 'mail' },
    { label: 'Assets', value: assetsCount?.toString() || '0', icon: 'folder' },
    { label: 'Build Tasks', value: buildCount?.toString() || '0', icon: 'check-square' },
  ]

  return (
    <DashboardClient 
      kpis={kpis} 
      recentAssets={recentAssets || []} 
      sequences={sequences || []} 
    />
  )
}
