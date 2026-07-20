'use client'

import { useState, useMemo } from 'react'
import Link from "next/link"
import { Package, Search, Filter, Eye, Copy, Trash2, Sparkles, X, Check, ChevronRight } from 'lucide-react'

interface ProductTemplate {
  id: string
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

function generateSampleContent(product: ProductTemplate): string {
  return `# ${product.name} Overview

This template helps you create content for **${product.category}** products in the **${product.tier}** tier.

## Key Features

- {{product_name}} integration
- {{target_audience}} focus
- {{pricing_model}} pricing model
- {{category}} best practices

## Next Steps

1. Customize for {{product_name}}
2. Add {{target_cluster}} insights
3. Publish to {{channel}}`
}

export default function TemplatesClient({ products }: { products: ProductTemplate[] }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState<ProductTemplate | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))], [products])
  const statuses = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.status).filter(Boolean)))], [products])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, categoryFilter, statusFilter])

  async function generateWithAI(product: ProductTemplate) {
    setIsGenerating(true)
    setGeneratedContent('')
    await new Promise(r => setTimeout(r, 1500))
    const content = `# AI-Generated Content for ${product.name}

Based on your template and product specifications, here's a draft:

## Product Overview

${product.name} is a leading {{product_name}} solution designed for ${product.tier} organizations. With ${product.pricing_model} pricing and a focus on ${product.category}, it delivers exceptional value.

## Key Selling Points

1. **Enterprise-grade**: Built for organizations of all sizes
2. **Flexible pricing**: ${formatPrice(product.base_price_cny)} starting point
3. **${product.category} expertise**: Deep domain knowledge

## Next Steps

Would you like me to refine any section or generate additional content?`
    setGeneratedContent(content)
    setIsGenerating(false)
  }

  function handleDuplicate(product: ProductTemplate) {
    alert(`Duplicate template: ${product.name} — This will be implemented with a write-back API.`)
  }

  function handleDelete(product: ProductTemplate) {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      alert(`Deleted: ${product.name} — This will be implemented with a write-back API.`)
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Template Library</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Template Library
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Product templates from Supabase — {products.length} templates · {filtered.length} shown
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
          <Search size={14} className="text-[var(--color-foreground-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="bg-transparent border-none outline-none text-[13px] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] w-40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--color-foreground-muted)]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-foreground)] outline-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-foreground)] outline-none"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Template grid */}
      {filtered.length === 0 ? (
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-8 text-center text-[13px] text-[var(--color-foreground-muted)]">
          No templates match the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product, i) => {
            const badge = getStatusBadge(product.status)
            return (
              <div key={i} className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <Package size={16} className="text-[#C108AB] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold text-[var(--color-foreground)] leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(product)}
                      className="p-1.5 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-alt)] rounded-[var(--radius-sm)] transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-1.5 text-[var(--color-foreground-muted)] hover:text-red-500 hover:bg-red-50 rounded-[var(--radius-sm)] transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${badge.className}`}>{badge.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">
                    {product.category}
                  </span>
                </div>
                <div className="space-y-1 text-[11px] mb-3">
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
                <button
                  onClick={() => setSelected(product)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)] transition-colors"
                >
                  <Eye size={14} />
                  Preview Template
                  <ChevronRight size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Preview modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => { setSelected(null); setGeneratedContent('') }}
        >
          <div
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
                  Preview: {selected.name}
                </h2>
                <p className="text-[11px] text-[var(--color-foreground-muted)] mt-0.5">
                  {selected.category} · {selected.tier}
                </p>
              </div>
              <button
                onClick={() => { setSelected(null); setGeneratedContent('') }}
                className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {/* Variable highlights */}
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-[var(--radius-md)]">
                <p className="text-[11px] font-semibold text-yellow-700 mb-1">Highlighted Variables</p>
                <p className="text-[12px] text-yellow-600">
                  Variables like <code className="bg-yellow-200 px-1 py-0.5 rounded text-[11px]">{'{{variable_name}}'}</code> will be replaced with actual values when generating content.
                </p>
              </div>

              {/* Generated content area */}
              {generatedContent ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Check size={14} className="text-[var(--color-success)]" />
                    <span className="text-[12px] font-bold text-[var(--color-foreground)]">AI-Generated Content</span>
                  </div>
                  <div className="bg-[var(--color-background-alt)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 whitespace-pre-wrap text-[13px] text-[var(--color-foreground)] leading-relaxed font-sans">
                    {generatedContent}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye size={14} className="text-[#C108AB]" />
                    <span className="text-[12px] font-bold text-[var(--color-foreground)]">Template Preview</span>
                  </div>
                  <div className="bg-[var(--color-background-alt)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 whitespace-pre-wrap text-[13px] text-[var(--color-foreground)] leading-relaxed font-sans">
                    {generateSampleContent(selected).replace(/\{\{(\w+)\}\}/g, '<span class="bg-yellow-200 text-yellow-800 px-0.5 rounded">$&</span>')}
                  </div>
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <button
                onClick={() => { setSelected(null); setGeneratedContent('') }}
                className="px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)] transition-colors"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateWithAI(selected)}
                  disabled={isGenerating}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold rounded-[var(--radius-md)] transition-colors ${
                    isGenerating
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-[#C108AB] text-white hover:opacity-90'
                  }`}
                >
                  <Sparkles size={14} className={isGenerating ? 'animate-spin' : ''} />
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
                <button
                  disabled
                  title="Use Template requires content creation API"
                  className="px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] opacity-50 cursor-not-allowed"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
