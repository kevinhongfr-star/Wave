import Link from "next/link"
import { createAdminClient } from '@/lib/supabase/server'
import DistributionClient from './DistributionClient'

export const dynamic = 'force-dynamic'

export default async function DistributionPage() {
  const supabase = await createAdminClient()
  
  let sequences: any[] = []
  
  if (supabase) {
    const { data } = await supabase
      .from('email_sequences')
      .select('name, status, type, trigger_type, created_at')
      .order('created_at', { ascending: false })
    
    sequences = data || []
  }

  return <DistributionClient sequences={sequences} />
}
