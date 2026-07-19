'use client'

import {
  Package, Mail, Folder, CheckSquare,
  TrendingUp, Clock, CheckCircle2, AlertCircle
} from 'lucide-react'

interface KPI {
  label: string
  value: string
  icon: string
}

interface Asset {
  name: string
  status: string | null
  assigned_to: string | null
  created_at: string
}

interface Sequence {
  name: string
  status: string
  type: string
}

interface DashboardClientProps {
  kpis: KPI[]
  recentAssets: Asset[]
  sequences: Sequence[]
}

const iconMap: Record<string, any> = {
  package: Package,
  mail: Mail,
  folder: Folder,
  'check-square': CheckSquare,
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

function getStatusBadge(status: string | null): { className: string; label: string } {
  if (!status) return { className: 'badge-neutral', label: 'Unknown' }
  
  const statusMap: Record<string, { className: string; label: string }> = {
    'active': { className: 'badge-success', label: 'Active' },
    'review': { className: 'badge-info', label: 'In Review' },
    'draft': { className: 'badge-warning', label: 'Draft' },
    'complete': { className: 'badge-success', label: 'Complete' },
    'paused': { className: 'badge-neutral', label: 'Paused' },
  }
  
  return statusMap[status.toLowerCase()] || { className: 'badge-neutral', label: status }
}

export default function DashboardClient({ kpis, recentAssets, sequences }: DashboardClientProps) {
  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Marketing Dashboard
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Live data from Supabase — Products, Sequences, Assets & Build Tasks
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => {
          const Icon = iconMap[kpi.icon] || Package
          return (
            <div key={kpi.label} className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">
                  {kpi.label}
                </span>
                <Icon size={16} className="text-[var(--color-foreground-muted)]" />
              </div>
              <div className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-[var(--color-success)]" />
                <span className="text-[11px] font-semibold text-[var(--color-success)]">Live</span>
                <span className="text-[11px] text-[var(--color-foreground-muted)] ml-1">from Supabase</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Assets */}
        <div className="lg:col-span-2 card bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <h3 className="text-[14px] font-bold">Recent Assets</h3>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {recentAssets.map((asset, i) => {
              const badge = getStatusBadge(asset.status)
              return (
                <div key={i} className="px-4 py-3 flex items-start gap-3">
                  <CheckCircle2 size={14} className="text-[var(--color-success)] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[var(--color-foreground)] leading-snug">{asset.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${badge.className}`}>{badge.label}</span>
                      {asset.assigned_to && (
                        <span className="text-[11px] text-[var(--color-foreground-muted)]">
                          Assigned to {asset.assigned_to}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--color-foreground-muted)] mt-0.5">
                      {formatTime(asset.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Email Sequences */}
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <h3 className="text-[14px] font-bold flex items-center gap-2">
              <Mail size={14} className="text-[#C108AB]" />
              Email Sequences
            </h3>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {sequences.map((seq, i) => {
              const badge = getStatusBadge(seq.status)
              return (
                <div key={i} className="px-4 py-3">
                  <p className="text-[13px] font-semibold text-[var(--color-foreground)] leading-snug">
                    {seq.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${badge.className}`}>{badge.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">
                      {seq.type}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'View Products', href: '/dashboard/templates', color: 'bg-[#C108AB] text-white' },
          { label: 'View Sequences', href: '/dashboard/distribution', color: 'bg-[var(--color-teal)] text-white' },
          { label: 'View Assets', href: '/dashboard/content', color: 'bg-[var(--color-ocean-deep)] text-white' },
          { label: 'View Build Tasks', href: '/dashboard/agents', color: 'bg-[var(--color-foreground)] text-white' },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={`btn ${action.color} justify-center py-3 text-[13px] font-semibold hover:opacity-90 transition-opacity`}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  )
}
