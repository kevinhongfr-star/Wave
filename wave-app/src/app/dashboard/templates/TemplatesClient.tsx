'use client'

import Link from "next/link"
import { Package } from 'lucide-react'

interface Product {
  name: string
  tier: string
  category: string
  base_price_cny: number | null
  status: string
  pricing_model: string
}

function getStatusBadge(status: string): { className: string; label: string } {
  const statusMap: Record<string, { className: string; label: string }> = {
    'active': { className: 'badge-success', label: 'Active' },
    'draft': { className: 'badge-warning', label: 'Draft' },
    'paused': { className: 'badge-neutral', label: 'Paused' },
  }
  return statusMap[status.toLowerCase()] || { className: 'badge-neutral', label: status }
}

function formatPrice(price: number | null): string {
  if (!price) return 'TBD'
  return `¥${price.toLocaleString()}`
}

export default function TemplatesClient({ products }: { products: Product[] }) {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Products & Pricing</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Products & Pricing
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Product catalog from Supabase — {products.length} products
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, i) => {
          const badge = getStatusBadge(product.status)
          return (
            <div key={i} className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
              <div className="flex items-start gap-3 mb-3">
                <Package size={16} className="text-[#C108AB] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-bold text-[var(--color-foreground)] leading-snug">
                    {product.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${badge.className}`}>{badge.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">
                  {product.category}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[var(--color-foreground-muted)]">Tier:</span>
                  <span className="text-[var(--color-foreground)]">{product.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-foreground-muted)]">Price:</span>
                  <span className="text-[var(--color-foreground)] font-semibold">{formatPrice(product.base_price_cny)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-foreground-muted)]">Model:</span>
                  <span className="text-[var(--color-foreground)]">{product.pricing_model}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
