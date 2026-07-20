import Link from "next/link"
import { createAdminClient } from '@/lib/supabase/server'
import AssetsClient from './AssetsClient'

export const dynamic = 'force-dynamic'

export default async function AssetsPage() {
  const supabase = await createAdminClient()

  let assets: any[] = []

  if (supabase) {
    const { data } = await supabase
      .from('assets')
      .select('id, name, type, status, assigned_to, file_url, asset_priority, created_at')
      .order('created_at', { ascending: false })

    assets = data || []
  }

  return <AssetsClient assets={assets} />
}
