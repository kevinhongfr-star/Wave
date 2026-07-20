import { createAdminClient } from '@/lib/supabase/server'
import TemplatesClient from './TemplatesClient'

export const dynamic = 'force-dynamic'

export interface ProductTemplate {
  id: string
  name: string
  tier: string
  category: string
  base_price_cny: number | null
  status: string
  pricing_model: string
}

export default async function TemplatesPage() {
  const supabase = await createAdminClient()

  let products: ProductTemplate[] = []

  if (supabase) {
    const { data } = await supabase
      .from('products')
      .select('id, name, tier, category, base_price_cny, status, pricing_model')
      .order('created_at', { ascending: false })

    products = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      tier: p.tier,
      category: p.category,
      base_price_cny: p.base_price_cny,
      status: p.status,
      pricing_model: p.pricing_model,
    }))
  }

  return <TemplatesClient products={products} />
}
