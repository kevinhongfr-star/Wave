'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, Megaphone, Plus, Users, Calendar, TrendingUp } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  status: string
  content_count: number
  build_phase: string
  start_date: string
  owner: string | null
}

function getStatusBadge(status: string): { className: string; label: string } {
  const map: Record<string, { className: string; label: string }> = {
    active: { className: 'badge-success', label: 'Active' },
    planning: { className: 'badge-info', label: 'Planning' },
    completed: { className: 'badge-neutral', label: 'Completed' },
    paused: { className: 'badge-warning', label: 'Paused' },
  }
  return map[status] || { className: 'badge-neutral', label: status }
}

function getPhaseColor(phase: string): string {
  const p = phase.toLowerCase()
  if (p.includes('phase 1') || p.includes('foundation')) return '#0EA5E9'
  if (p.includes('phase 2') || p.includes('build')) return '#8B5CF6'
  if (p.includes('phase 3') || p.includes('commercial')) return '#C108AB'
  if (p.includes('phase 4')) return '#F97316'
  return '#10B981'
}

export default function CampaignsClient({ campaigns }: { campaigns: Campaign[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const statuses = ['All', 'planning', 'active', 'completed', 'paused']

  const filtered = useMemo(() => {
    return campaigns.filter(c => {
      const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [campaigns, search, statusFilter])

  const totals = useMemo(() => {
    return {
      total: campaigns.length,
      content: campaigns.reduce((acc, c) => acc + c.content_count, 0),
      active: campaigns.filter(c => c.status === 'active').length,
    }
  }, [campaigns])

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Campaigns</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
              Campaigns
            </h1>
            <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
              {totals.total} campaigns · {totals.content} linked deliverables
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#C108AB] text-white text-[13px] font-semibold rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
            disabled
            title="Campaign creation coming soon (requires campaigns table)"
          >
            <Plus size={14} />
            New Campaign
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone size={14} className="text-[#C108AB]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Total</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{totals.total}</div>
        </div>
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-[var(--color-success)]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Active</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{totals.active}</div>
        </div>
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-[#0EA5E9]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Deliverables</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{totals.content}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
          <Search size={14} className="text-[var(--color-foreground-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="bg-transparent border-none outline-none text-[13px] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] w-40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--color-foreground-muted)]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-foreground)] outline-none"
          >
            {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>)}
          </select>
        </div>
      </div>

      {/* Campaign cards */}
      {filtered.length === 0 ? (
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-8 text-center text-[13px] text-[var(--color-foreground-muted)]">
          No campaigns match the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((campaign, i) => {
            const badge = getStatusBadge(campaign.status)
            const phaseColor = getPhaseColor(campaign.build_phase)
            return (
              <div
                key={i}
                className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center"
                    style={{ backgroundColor: `${phaseColor}20` }}
                  >
                    <Megaphone size={18} style={{ color: phaseColor }} />
                  </div>
                  <span className={`badge ${badge.className}`}>{badge.label}</span>
                </div>
                <h3 className="text-[14px] font-bold text-[var(--color-foreground)] mb-1 line-clamp-2">{campaign.name}</h3>
                <p className="text-[11px] text-[var(--color-foreground-muted)] mb-3 line-clamp-1">{campaign.build_phase}</p>

                <div className="border-t border-[var(--color-border)] pt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[var(--color-foreground-muted)]">Deliverables</span>
                    <span className="font-semibold text-[var(--color-foreground)]">{campaign.content_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[var(--color-foreground-muted)]">Owner</span>
                    <span className="font-semibold text-[var(--color-foreground)]">{campaign.owner || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[var(--color-foreground-muted)]">Started</span>
                    <span className="font-semibold text-[var(--color-foreground)]">
                      {new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4 text-[11px] text-[var(--color-foreground-muted)] italic">
        Note: Campaigns are derived from <code>build_tracker.build_phase</code>. A dedicated <code>campaigns</code> table is planned.
      </div>
    </div>
  )
}
