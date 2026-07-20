'use client'

import { useState, useMemo } from 'react'
import Link from "next/link"
import { Package, CheckSquare, Folder, Mail, BarChart3, Download, Calendar, TrendingUp, FileText } from 'lucide-react'
import type { AnalyticsData } from './page'

type Tab = 'overview' | 'content' | 'email' | 'product'

function StatCard({ title, value, icon: Icon, children, color }: {
  title: string; value: string | number; icon: any; children?: React.ReactNode; color?: string
}) {
  return (
    <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: color || '#C108AB' }} />
          <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">{title}</span>
        </div>
        <span className="text-[20px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">{value}</span>
      </div>
      {children}
    </div>
  )
}

function DistributionBar({ items, max, colorFn }: {
  items: { label: string; count: number; color?: string }[]
  max: number
  colorFn?: (label: string) => string
}) {
  return (
    <div className="space-y-2 mt-3">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[var(--color-foreground-secondary)] truncate max-w-[60%]">{item.label}</span>
            <span className="text-[11px] font-semibold text-[var(--color-foreground)]">{item.count}</span>
          </div>
          <div className="h-2 bg-[var(--color-background-alt)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${max > 0 ? (item.count / max) * 100 : 0}%`,
                backgroundColor: item.color || colorFn?.(item.label) || '#C108AB',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function exportCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const COLORS = ['#C108AB', '#0EA5E9', '#8B5CF6', '#10B981', '#F97316', '#EF4444', '#6366F1', '#14B8A6']
const PHASE_COLORS: Record<string, string> = {
  'Phase 1 — Foundation': '#0EA5E9',
  'Phase 2 — Build Layer': '#8B5CF6',
  'Phase 3 — Commercial Layer': '#C108AB',
  'Phase 4': '#F97316',
}

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const [tab, setTab] = useState<Tab>('overview')
  const [dateRange, setDateRange] = useState('all')

  // Date filtering
  const filteredBuilds = useMemo(() => {
    if (dateRange === 'all') return data.builds
    const now = new Date()
    const cutoff = new Date()
    if (dateRange === '7d') cutoff.setDate(now.getDate() - 7)
    else if (dateRange === '30d') cutoff.setDate(now.getDate() - 30)
    else if (dateRange === '90d') cutoff.setDate(now.getDate() - 90)
    return data.builds.filter(b => new Date(b.created_at) >= cutoff)
  }, [data.builds, dateRange])

  const filteredSequences = useMemo(() => {
    if (dateRange === 'all') return data.sequences
    const now = new Date()
    const cutoff = new Date()
    if (dateRange === '7d') cutoff.setDate(now.getDate() - 7)
    else if (dateRange === '30d') cutoff.setDate(now.getDate() - 30)
    else if (dateRange === '90d') cutoff.setDate(now.getDate() - 90)
    return data.sequences.filter(s => new Date(s.created_at) >= cutoff)
  }, [data.sequences, dateRange])

  // Computed stats from filtered data
  const filteredBuildStats = useMemo(() => {
    const total = filteredBuilds.length
    const completed = filteredBuilds.filter(b => b.status?.toLowerCase() === 'completed' || b.status?.toLowerCase() === 'complete').length
    return {
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byPhase: filteredBuilds.reduce((acc, b) => { acc[b.build_phase || 'unknown'] = (acc[b.build_phase || 'unknown'] || 0) + 1; return acc }, {} as Record<string, number>),
      byStatus: filteredBuilds.reduce((acc, b) => { acc[b.status || 'unknown'] = (acc[b.status || 'unknown'] || 0) + 1; return acc }, {} as Record<string, number>),
    }
  }, [filteredBuilds])

  const filteredSequenceStats = useMemo(() => {
    return {
      total: filteredSequences.length,
      totalEmails: filteredSequences.reduce((acc, s) => acc + s.email_count, 0),
      byType: filteredSequences.reduce((acc, s) => { acc[s.type || 'unknown'] = (acc[s.type || 'unknown'] || 0) + 1; return acc }, {} as Record<string, number>),
      byStatus: filteredSequences.reduce((acc, s) => { acc[s.status || 'unknown'] = (acc[s.status || 'unknown'] || 0) + 1; return acc }, {} as Record<string, number>),
    }
  }, [filteredSequences])

  // Chart data
  const assetStatusItems = Object.entries(data.assetStats.byStatus).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count)
  const assetTypeItems = Object.entries(data.assetStats.byType).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count)
  const buildPhaseItems = Object.entries(filteredBuildStats.byPhase).map(([label, count]) => ({ label, count, color: PHASE_COLORS[label] || '#C108AB' })).sort((a, b) => b.count - a.count)
  const buildStatusItems = Object.entries(filteredBuildStats.byStatus).map(([label, count], i) => ({ label, count, color: COLORS[i % COLORS.length] })).sort((a, b) => b.count - a.count)
  const productTierItems = Object.entries(data.productStats.byTier).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count)
  const productCategoryItems = Object.entries(data.productStats.byCategory).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count)
  const productStatusItems = Object.entries(data.productStats.byStatus).map(([label, count], i) => ({ label, count, color: COLORS[i % COLORS.length] })).sort((a, b) => b.count - a.count)
  const seqTypeItems = Object.entries(filteredSequenceStats.byType).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count)
  const seqStatusItems = Object.entries(filteredSequenceStats.byStatus).map(([label, count], i) => ({ label, count, color: COLORS[i % COLORS.length] })).sort((a, b) => b.count - a.count)

  function handleExportOverview() {
    const rows = [
      ['Asset Status', ...assetStatusItems.map(a => `${a.label}: ${a.count}`)],
      ['Build Phase', ...buildPhaseItems.map(b => `${b.label}: ${b.count}`)],
      ['Product Tier', ...productTierItems.map(p => `${p.label}: ${p.count}`)],
      ['Sequence Type', ...seqTypeItems.map(s => `${s.label}: ${s.count}`)],
    ]
    exportCSV(
      `analytics-overview-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Category', 'Breakdown'],
      rows.map(r => [r[0], r.slice(1).join('; ')])
    )
  }

  function handleExportContent() {
    exportCSV(
      `content-analytics-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Deliverable', 'Status', 'Phase', 'Assigned To', 'Created'],
      filteredBuilds.map(b => [b.deliverable_name, b.status, b.build_phase, b.assigned_to || '', new Date(b.created_at).toLocaleDateString()])
    )
  }

  function handleExportEmail() {
    exportCSV(
      `email-analytics-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Sequence', 'Type', 'Status', 'Emails', 'Created'],
      filteredSequences.map(s => [s.name, s.type, s.status, String(s.email_count), new Date(s.created_at).toLocaleDateString()])
    )
  }

  function handleExportProduct() {
    exportCSV(
      `product-analytics-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Name', 'Tier', 'Category', 'Status', 'Price (CNY)', 'Pricing Model'],
      data.products.map(p => [p.name, p.tier, p.category, p.status, p.base_price_cny ? String(p.base_price_cny) : 'TBD', p.pricing_model])
    )
  }

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'content', label: 'Content', icon: FileText },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'product', label: 'Product', icon: Package },
  ]

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Analytics</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
              Analytics & Intelligence
            </h1>
            <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
              Cross-table aggregations · {data.assetStats.total + data.buildStats.total + data.productStats.total + data.sequenceStats.total} total records
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Date range filter (TICKET-053) */}
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[var(--color-foreground-muted)]" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-2 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-foreground)] outline-none"
              >
                <option value="all">All time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <button
              onClick={handleExportOverview}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)] transition-colors"
            >
              <Download size={13} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)] mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-semibold transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? 'border-[#C108AB] text-[#C108AB]'
                : 'border-transparent text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]'
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Assets" value={data.assetStats.total} icon={Folder} color="#0EA5E9">
              <span className="text-[11px] text-[var(--color-foreground-muted)]">{Object.keys(data.assetStats.byStatus).length} statuses</span>
            </StatCard>
            <StatCard title="Build Tasks" value={filteredBuildStats.total} icon={CheckSquare} color="#8B5CF6">
              <span className="text-[11px] text-[var(--color-success)]">{filteredBuildStats.completionRate}% completed</span>
            </StatCard>
            <StatCard title="Products" value={data.productStats.total} icon={Package} color="#F97316">
              <span className="text-[11px] text-[var(--color-foreground-muted)]">{Object.keys(data.productStats.byTier).length} tiers</span>
            </StatCard>
            <StatCard title="Sequences" value={filteredSequenceStats.total} icon={Mail} color="#10B981">
              <span className="text-[11px] text-[var(--color-foreground-muted)]">{filteredSequenceStats.totalEmails} emails</span>
            </StatCard>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard title="Assets by Status" value="" icon={BarChart3}>
              <DistributionBar items={assetStatusItems} max={Math.max(...assetStatusItems.map(i => i.count), 1)} />
            </StatCard>
            <StatCard title="Build Tasks by Phase" value="" icon={BarChart3}>
              <DistributionBar items={buildPhaseItems} max={Math.max(...buildPhaseItems.map(i => i.count), 1)} />
            </StatCard>
            <StatCard title="Products by Tier" value="" icon={BarChart3}>
              <DistributionBar items={productTierItems} max={Math.max(...productTierItems.map(i => i.count), 1)} />
            </StatCard>
            <StatCard title="Sequences by Type" value="" icon={BarChart3}>
              <DistributionBar items={seqTypeItems} max={Math.max(...seqTypeItems.map(i => i.count), 1)} />
            </StatCard>
          </div>
        </>
      )}

      {/* Content Performance Tab (TICKET-046) */}
      {tab === 'content' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold text-[var(--color-foreground)]">Content Performance</h2>
            <button onClick={handleExportContent} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)]">
              <Download size={13} /> Export CSV
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StatCard title="Build Tasks by Status" value="" icon={BarChart3}>
              <DistributionBar items={buildStatusItems} max={Math.max(...buildStatusItems.map(i => i.count), 1)} />
            </StatCard>
            <StatCard title="Build Tasks by Phase" value="" icon={BarChart3}>
              <DistributionBar items={buildPhaseItems} max={Math.max(...buildPhaseItems.map(i => i.count), 1)} />
            </StatCard>
          </div>
          <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Deliverable</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Phase</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Assigned</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {filteredBuilds.slice(0, 50).map((b, i) => (
                    <tr key={i} className="hover:bg-[var(--color-background-alt)] transition-colors">
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground)] font-medium max-w-[200px] truncate">{b.deliverable_name}</td>
                      <td className="px-4 py-2"><span className={`badge ${b.status?.toLowerCase() === 'completed' ? 'badge-success' : b.status?.toLowerCase() === 'in progress' ? 'badge-info' : 'badge-neutral'} text-[10px]`}>{b.status}</span></td>
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground-secondary)] max-w-[150px] truncate">{b.build_phase}</td>
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground-secondary)]">{b.assigned_to || '—'}</td>
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground-muted)]">{new Date(b.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Email Analytics Tab (TICKET-048) */}
      {tab === 'email' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold text-[var(--color-foreground)]">Email Sequence Analytics</h2>
            <button onClick={handleExportEmail} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)]">
              <Download size={13} /> Export CSV
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Sequences" value={filteredSequenceStats.total} icon={Mail} color="#0EA5E9" />
            <StatCard title="Total Emails" value={filteredSequenceStats.totalEmails} icon={FileText} color="#8B5CF6" />
            <StatCard title="Active" value={filteredSequences.filter(s => s.status === 'active').length} icon={TrendingUp} color="#10B981" />
            <StatCard title="Avg Emails/Seq" value={filteredSequenceStats.total > 0 ? Math.round(filteredSequenceStats.totalEmails / filteredSequenceStats.total * 10) / 10 : 0} icon={BarChart3} color="#F97316" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StatCard title="Sequences by Type" value="" icon={BarChart3}>
              <DistributionBar items={seqTypeItems} max={Math.max(...seqTypeItems.map(i => i.count), 1)} />
            </StatCard>
            <StatCard title="Sequences by Status" value="" icon={BarChart3}>
              <DistributionBar items={seqStatusItems} max={Math.max(...seqStatusItems.map(i => i.count), 1)} />
            </StatCard>
          </div>
          <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Sequence</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Type</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Emails</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {filteredSequences.map((s, i) => (
                    <tr key={i} className="hover:bg-[var(--color-background-alt)] transition-colors">
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground)] font-medium max-w-[200px] truncate">{s.name}</td>
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground-secondary)]">{s.type}</td>
                      <td className="px-4 py-2"><span className={`badge ${s.status === 'active' ? 'badge-success' : s.status === 'draft' ? 'badge-warning' : 'badge-neutral'} text-[10px]`}>{s.status}</span></td>
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground)] font-semibold">{s.email_count}</td>
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground-muted)]">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Product Analytics Tab (TICKET-050) */}
      {tab === 'product' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-bold text-[var(--color-foreground)]">Product Analytics</h2>
            <button onClick={handleExportProduct} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)]">
              <Download size={13} /> Export CSV
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Products" value={data.productStats.total} icon={Package} color="#F97316" />
            <StatCard title="Active" value={data.productStats.byStatus['active'] || 0} icon={TrendingUp} color="#10B981" />
            <StatCard title="Tiers" value={Object.keys(data.productStats.byTier).length} icon={BarChart3} color="#8B5CF6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="By Tier" value="" icon={BarChart3}>
              <DistributionBar items={productTierItems} max={Math.max(...productTierItems.map(i => i.count), 1)} />
            </StatCard>
            <StatCard title="By Category" value="" icon={BarChart3}>
              <DistributionBar items={productCategoryItems} max={Math.max(...productCategoryItems.map(i => i.count), 1)} />
            </StatCard>
            <StatCard title="By Status" value="" icon={BarChart3}>
              <DistributionBar items={productStatusItems} max={Math.max(...productStatusItems.map(i => i.count), 1)} />
            </StatCard>
          </div>
          <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Tier</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Category</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {data.products.map((p, i) => (
                    <tr key={i} className="hover:bg-[var(--color-background-alt)] transition-colors">
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground)] font-medium max-w-[200px] truncate">{p.name}</td>
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground-secondary)]">{p.tier}</td>
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground-secondary)]">{p.category}</td>
                      <td className="px-4 py-2"><span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-neutral'} text-[10px]`}>{p.status}</span></td>
                      <td className="px-4 py-2 text-[12px] text-[var(--color-foreground)] font-semibold">{p.base_price_cny ? `¥${p.base_price_cny.toLocaleString()}` : 'TBD'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
