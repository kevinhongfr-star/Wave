'use client'

import { useState, useMemo } from 'react'
import Link from "next/link"
import { Calendar, Download, Search, Filter, X, Clock } from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  status: string
  channel: string
  date: string
  author: string
  build_phase: string | null
  raw_date: string
}

type ViewMode = 'day' | 'week' | 'month'

const STATUS_OPTIONS = [
  { value: 'Not Started', className: 'badge-neutral' },
  { value: 'Planning', className: 'badge-info' },
  { value: 'In Progress', className: 'badge-info' },
  { value: 'Draft', className: 'badge-warning' },
  { value: 'In Review', className: 'badge-info' },
  { value: 'Active', className: 'badge-success' },
  { value: 'Published', className: 'badge-success' },
  { value: 'Archived', className: 'badge-neutral' },
]

function getStatusBadgeClass(status: string): string {
  const found = STATUS_OPTIONS.find(s => s.value.toLowerCase() === status?.toLowerCase())
  if (found) return found.className
  const s = status?.toLowerCase()
  if (s?.includes('progress') || s?.includes('review')) return 'badge-info'
  if (s?.includes('active') || s?.includes('publish') || s?.includes('complete') || s?.includes('sent')) return 'badge-success'
  if (s?.includes('draft') || s?.includes('plan') || s?.includes('paused')) return 'badge-warning'
  return 'badge-neutral'
}

function getChannelColor(channel: string): string {
  const c = channel?.toLowerCase() || ''
  if (c.includes('phase 1') || c.includes('foundation')) return '#0EA5E9'
  if (c.includes('phase 2') || c.includes('build')) return '#8B5CF6'
  if (c.includes('phase 3') || c.includes('commercial')) return '#C108AB'
  if (c.includes('phase 4')) return '#F97316'
  return '#10B981'
}

function getChannelEmoji(channel: string): string {
  const c = channel?.toLowerCase() || ''
  if (c.includes('phase 1')) return '🌱'
  if (c.includes('phase 2')) return '🔨'
  if (c.includes('phase 3')) return '💼'
  if (c.includes('phase 4')) return '🚀'
  return '📦'
}

export default function ContentClient({ items }: { items: ContentItem[] }) {
  const [view, setView] = useState<ViewMode>('month')
  const [search, setSearch] = useState('')
  const [channelFilter, setChannelFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState<ContentItem | null>(null)

  const channels = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.channel).filter(Boolean)))], [items])
  const statuses = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.status).filter(Boolean)))], [items])

  const filtered = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = !search || i.title?.toLowerCase().includes(search.toLowerCase())
      const matchesChannel = channelFilter === 'All' || i.channel === channelFilter
      const matchesStatus = statusFilter === 'All' || i.status === statusFilter
      return matchesSearch && matchesChannel && matchesStatus
    })
  }, [items, search, channelFilter, statusFilter])

  // Group by date for day/week/month views
  const grouped = useMemo(() => {
    const buckets: Record<string, ContentItem[]> = {}
    for (const item of filtered) {
      const d = new Date(item.raw_date)
      let key: string
      if (view === 'day') {
        key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } else if (view === 'week') {
        // Get Monday of the week
        const day = d.getDay()
        const monday = new Date(d)
        monday.setDate(d.getDate() - ((day + 6) % 7))
        key = `Week of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      } else {
        key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
      if (!buckets[key]) buckets[key] = []
      buckets[key].push(item)
    }
    return buckets
  }, [filtered, view])

  function exportCSV() {
    const headers = ['Title', 'Status', 'Channel', 'Build Phase', 'Date', 'Author']
    const rows = filtered.map(i => [i.title, i.status, i.channel, i.build_phase || '', i.date, i.author])
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-calendar-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Content Calendar</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
              Content Calendar
            </h1>
            <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
              Build tracker data — {items.length} deliverables · {filtered.length} shown
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
              {(['day', 'week', 'month'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                    view === v
                      ? 'bg-[#C108AB] text-white'
                      : 'bg-[var(--color-card)] text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-alt)]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)] transition-colors"
            >
              <Download size={13} />
              Export CSV
            </button>
          </div>
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
            placeholder="Search deliverables..."
            className="bg-transparent border-none outline-none text-[13px] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] w-40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--color-foreground-muted)]" />
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-2 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-foreground)] outline-none"
          >
            {channels.map(c => <option key={c} value={c}>{c}</option>)}
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

      {/* Grouped view */}
      {filtered.length === 0 ? (
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-8 text-center text-[13px] text-[var(--color-foreground-muted)]">
          No deliverables match the current filters.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([bucket, bucketItems]) => (
            <div key={bucket}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-[#C108AB]" />
                <h3 className="text-[13px] font-bold text-[var(--color-foreground)] uppercase tracking-wide">{bucket}</h3>
                <span className="text-[11px] text-[var(--color-foreground-muted)]">({bucketItems.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {bucketItems.map((item, i) => {
                  const channelColor = getChannelColor(item.channel)
                  return (
                    <div
                      key={i}
                      onClick={() => setSelected(item)}
                      className="card bg-[var(--color-card)] border border-[var(--color-border)] p-3 cursor-pointer hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span
                          className="w-1 self-stretch rounded-full"
                          style={{ backgroundColor: channelColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm">{getChannelEmoji(item.channel)}</span>
                            <span className={`badge ${getStatusBadgeClass(item.status)} text-[10px]`}>{item.status}</span>
                          </div>
                          <p className="text-[12px] text-[var(--color-foreground)] font-medium line-clamp-2 leading-snug">{item.title}</p>
                          <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--color-foreground-muted)]">
                            <span className="truncate">{item.channel}</span>
                            <span>{item.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] w-full max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">Deliverable Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Title</label>
                <p className="text-[14px] text-[var(--color-foreground)] mt-1">{selected.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Status</label>
                  <div className="mt-1">
                    <span className={`badge ${getStatusBadgeClass(selected.status)}`}>{selected.status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Channel / Phase</label>
                  <p className="text-[13px] text-[var(--color-foreground)] mt-1">{selected.channel}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Owner</label>
                  <p className="text-[13px] text-[var(--color-foreground)] mt-1">{selected.author}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Created</label>
                  <p className="text-[13px] text-[var(--color-foreground)] mt-1 flex items-center gap-1">
                    <Clock size={11} className="text-[var(--color-foreground-muted)]" />
                    {selected.date}
                  </p>
                </div>
              </div>

              {/* Status workflow change (TICKET-011) */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] block mb-2">
                  Change Status
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      disabled
                      title="Status change requires a write-back mutation route"
                      className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wide border border-[var(--color-border)] rounded-[var(--radius-md)] transition-colors ${
                        s.value.toLowerCase() === selected.status?.toLowerCase()
                          ? 'bg-[#C108AB] text-white border-[#C108AB]'
                          : 'bg-[var(--color-card)] text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-alt)] opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {s.value}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[var(--color-foreground-muted)] mt-2 italic">
                  Status mutations will be enabled once a write-back API is added.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
