import { createAdminClient } from '@/lib/supabase/server'
import AnalyticsClient from './AnalyticsClient'

export const dynamic = 'force-dynamic'

export interface BuildItem {
  id: string
  deliverable_name: string
  status: string
  build_phase: string
  assigned_to: string | null
  created_at: string
}

export interface SequenceWithCount {
  id: string
  name: string
  type: string
  status: string
  email_count: number
  created_at: string
}

export interface ProductDetail {
  id: string
  name: string
  tier: string
  category: string
  status: string
  base_price_cny: number | null
  pricing_model: string
}

export interface AnalyticsData {
  assetStats: {
    total: number
    byStatus: Record<string, number>
    byType: Record<string, number>
    byPriority: Record<string, number>
  }
  buildStats: {
    total: number
    completed: number
    completionRate: number
    byPhase: Record<string, number>
    byStatus: Record<string, number>
  }
  productStats: {
    total: number
    byTier: Record<string, number>
    byCategory: Record<string, number>
    byStatus: Record<string, number>
  }
  sequenceStats: {
    total: number
    byType: Record<string, number>
    byStatus: Record<string, number>
    totalEmails: number
  }
  builds: BuildItem[]
  sequences: SequenceWithCount[]
  products: ProductDetail[]
  createdDates: string[]
}

export default async function AnalyticsPage() {
  const supabase = await createAdminClient()

  const data: AnalyticsData = {
    assetStats: { total: 0, byStatus: {}, byType: {}, byPriority: {} },
    buildStats: { total: 0, completed: 0, completionRate: 0, byPhase: {}, byStatus: {} },
    productStats: { total: 0, byTier: {}, byCategory: {}, byStatus: {} },
    sequenceStats: { total: 0, byType: {}, byStatus: {}, totalEmails: 0 },
    builds: [],
    sequences: [],
    products: [],
    createdDates: [],
  }

  if (supabase) {
    const [
      { data: assets },
      { data: builds },
      { data: products },
      { data: sequences },
      { data: emails },
    ] = await Promise.all([
      supabase.from('assets').select('status, type, asset_priority'),
      supabase.from('build_tracker').select('id, deliverable_name, status, build_phase, assigned_to, created_at').order('created_at', { ascending: false }),
      supabase.from('products').select('id, name, tier, category, status, base_price_cny, pricing_model'),
      supabase.from('email_sequences').select('id, name, type, status, created_at'),
      supabase.from('sequence_emails').select('sequence_id'),
    ])

    // Asset stats
    if (assets) {
      data.assetStats.total = assets.length
      data.assetStats.byStatus = assets.reduce((acc: Record<string, number>, a: any) => {
        acc[a.status || 'unknown'] = (acc[a.status || 'unknown'] || 0) + 1
        return acc
      }, {})
      data.assetStats.byType = assets.reduce((acc: Record<string, number>, a: any) => {
        acc[a.type || 'unknown'] = (acc[a.type || 'unknown'] || 0) + 1
        return acc
      }, {})
      data.assetStats.byPriority = assets.reduce((acc: Record<string, number>, a: any) => {
        const p = a.asset_priority ? `P${a.asset_priority}` : 'Unset'
        acc[p] = (acc[p] || 0) + 1
        return acc
      }, {})
    }

    // Build stats
    if (builds) {
      data.builds = builds as BuildItem[]
      data.buildStats.total = builds.length
      data.buildStats.completed = builds.filter((b: any) => b.status?.toLowerCase() === 'completed' || b.status?.toLowerCase() === 'complete').length
      data.buildStats.completionRate = data.buildStats.total > 0
        ? Math.round((data.buildStats.completed / data.buildStats.total) * 100)
        : 0
      data.buildStats.byPhase = builds.reduce((acc: Record<string, number>, b: any) => {
        acc[b.build_phase || 'unknown'] = (acc[b.build_phase || 'unknown'] || 0) + 1
        return acc
      }, {})
      data.buildStats.byStatus = builds.reduce((acc: Record<string, number>, b: any) => {
        acc[b.status || 'unknown'] = (acc[b.status || 'unknown'] || 0) + 1
        return acc
      }, {})
      builds.forEach((b: any) => { if (b.created_at) data.createdDates.push(b.created_at) })
    }

    // Product stats
    if (products) {
      data.products = products as ProductDetail[]
      data.productStats.total = products.length
      data.productStats.byTier = products.reduce((acc: Record<string, number>, p: any) => {
        acc[p.tier || 'unknown'] = (acc[p.tier || 'unknown'] || 0) + 1
        return acc
      }, {})
      data.productStats.byCategory = products.reduce((acc: Record<string, number>, p: any) => {
        acc[p.category || 'unknown'] = (acc[p.category || 'unknown'] || 0) + 1
        return acc
      }, {})
      data.productStats.byStatus = products.reduce((acc: Record<string, number>, p: any) => {
        acc[p.status || 'unknown'] = (acc[p.status || 'unknown'] || 0) + 1
        return acc
      }, {})
    }

    // Sequence stats
    if (sequences) {
      const emailCounts: Record<string, number> = {}
      ;(emails || []).forEach((e: any) => {
        emailCounts[e.sequence_id] = (emailCounts[e.sequence_id] || 0) + 1
      })

      data.sequences = (sequences as SequenceWithCount[]).map((s: any) => ({
        ...s,
        email_count: emailCounts[s.id] || 0,
      }))

      data.sequenceStats.total = sequences.length
      data.sequenceStats.totalEmails = (emails || []).length
      data.sequenceStats.byType = sequences.reduce((acc: Record<string, number>, s: any) => {
        acc[s.type || 'unknown'] = (acc[s.type || 'unknown'] || 0) + 1
        return acc
      }, {})
      data.sequenceStats.byStatus = sequences.reduce((acc: Record<string, number>, s: any) => {
        acc[s.status || 'unknown'] = (acc[s.status || 'unknown'] || 0) + 1
        return acc
      }, {})
      sequences.forEach((s: any) => { if (s.created_at) data.createdDates.push(s.created_at) })
    }
  }

  return <AnalyticsClient data={data} />
}
