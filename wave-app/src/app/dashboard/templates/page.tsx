import Link from "next/link"
import { createAdminClient } from '@/lib/supabase/server'
import TemplatesClient from './TemplatesClient'

export const dynamic = 'force-dynamic'

export default async function TemplatesPage() {
  const supabase = await createAdminClient()
  
  let products: any[] = []
  
  if (supabase) {
    const { data } = await supabase
      .from('products')
      .select('name, tier, category, base_price_cny, status, pricing_model')
      .order('created_at', { ascending: false })
    
    products = data || []
  }

  return <TemplatesClient products={products} />
}
