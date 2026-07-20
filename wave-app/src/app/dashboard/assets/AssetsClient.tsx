'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from "next/link"
import { Search, Filter, FileText, ExternalLink, X, Tag, Plus } from 'lucide-react'

interface Asset {
  id: string
  name: string
  type: string
  status: string
  assigned_to: string | null
  file_url: string | null
  asset_priority: number | null
  created_at: string
}

function getStatusBadge(status: string): { className: string; label: string } {
  const statusMap: Record<string, { className: string; label: string }> = {
    'active': { className: 'badge-success', label: 'Active' },
    'completed': { className: 'badge-success', label: 'Completed' },
    'in_progress': { className: 'badge-info', label: 'In Progress' },
    'draft': { className: 'badge-warning', label: 'Draft' },
    'review': { className: 'badge-info', label: 'Review' },
    'archived': { className: 'badge-neutral', label: 'Archived' },
  }
  return statusMap[status?.toLowerCase()] || { className: 'badge-neutral', label: status || 'Unknown' }
}

function getTypeIcon(type: string) {
  return type?.toLowerCase().includes('image') ? '🖼️' :
         type?.toLowerCase().includes('video') ? '🎬' :
         type?.toLowerCase().includes('pdf') ? '📄' :
         type?.toLowerCase().includes('doc') ? '📝' :
         type?.toLowerCase().includes('slide') ? '📊' :
         type?.toLowerCase().includes('web') ? '🌐' :
         type?.toLowerCase().includes('email') ? '📧' :
         type?.toLowerCase().includes('social') ? '💬' : '📎'
}

const SUGGESTED_TAGS = [
  'LEAP', 'PRISM', 'Council', 'Assessment', 'Marketing', 'Sales', 'Training',
  'Webinar', 'Newsletter', 'Podcast', 'Social', 'Email', 'LinkedIn', 'Video'
]

export default function AssetsClient({ assets }: { assets: Asset[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [assignedFilter, setAssignedFilter] = useState('All')
  const [selectedTag, setSelectedTag] = useState('')
  const [selected, setSelected] = useState<Asset | null>(null)
  const [assetTags, setAssetTags] = useState<Record<string, string[]>>({})
  const [tagInput, setTagInput] = useState('')

  const types = useMemo(() => ['All', ...Array.from(new Set(assets.map(a => a.type).filter(Boolean)))], [assets])
  const statuses = useMemo(() => ['All', ...Array.from(new Set(assets.map(a => a.status).filter(Boolean)))], [assets])
  const assignees = useMemo(() => ['All', ...Array.from(new Set(assets.map(a => a.assigned_to).filter((x): x is string => !!x)))], [assets])

  const getAssetTags = useCallback((asset: Asset): string[] => {
    if (assetTags[asset.id]) return assetTags[asset.id]
    const tags: string[] = []
    if (asset.type.toLowerCase().includes('image')) tags.push('Image')
    if (asset.type.toLowerCase().includes('pdf')) tags.push('Document')
    if (asset.type.toLowerCase().includes('email')) tags.push('Email')
    if (asset.status === 'active') tags.push('Active')
    if (asset.asset_priority && asset.asset_priority >= 4) tags.push('High Priority')
    return tags
  }, [assetTags])

  // Aggregate all tags for cloud
  const allTags = useMemo(() => {
    const counts: Record<string, number> = {}
    assets.forEach(a => {
      getAssetTags(a).forEach(t => {
        counts[t] = (counts[t] || 0) + 1
      })
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10)
  }, [assets, getAssetTags])

  const filtered = useMemo(() => {
    return assets.filter(a => {
      const matchesSearch = !search || a.name?.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === 'All' || a.type === typeFilter
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter
      const matchesAssigned = assignedFilter === 'All' || a.assigned_to === assignedFilter
      const matchesTag = !selectedTag || getAssetTags(a).includes(selectedTag)
      return matchesSearch && matchesType && matchesStatus && matchesAssigned && matchesTag
    })
  }, [assets, search, typeFilter, statusFilter, assignedFilter, selectedTag, getAssetTags])

  function addTag(asset: Asset, tag: string) {
    const existing = assetTags[asset.id] || getAssetTags(asset)
    if (!existing.includes(tag)) {
      setAssetTags(prev => ({ ...prev, [asset.id]: [...existing, tag] }))
    }
    setTagInput('')
  }

  function removeTag(asset: Asset, tag: string) {
    const existing = assetTags[asset.id] || getAssetTags(asset)
    setAssetTags(prev => ({ ...prev, [asset.id]: existing.filter(t => t !== tag) }))
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Assets</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Assets Library
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Digital assets from Supabase — {assets.length} total, {filtered.length} filtered
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
            placeholder="Search assets..."
            className="bg-transparent border-none outline-none text-[13px] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] w-40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--color-foreground-muted)]" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-foreground)] outline-none"
          >
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-foreground)] outline-none"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="px-2 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-foreground)] outline-none"
          >
            {assignees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Tag cloud (TICKET-026) */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Tag size={14} className="text-[var(--color-foreground-muted)]" />
        <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Tags:</span>
        <button
          onClick={() => setSelectedTag('')}
          className={`px-2 py-1 text-[11px] font-semibold rounded-[var(--radius-md)] transition-colors ${
            !selectedTag ? 'bg-[#C108AB] text-white' : 'bg-[var(--color-card)] text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-alt)]'
          }`}
        >
          All
        </button>
        {allTags.map(([tag, count]) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
            className={`px-2 py-1 text-[11px] font-semibold rounded-[var(--radius-md)] transition-colors ${
              selectedTag === tag ? 'bg-[#C108AB] text-white' : 'bg-[var(--color-card)] text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-alt)]'
            }`}
          >
            {tag} <span className="opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Name</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Tags</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Priority</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-[var(--color-foreground-muted)]">
                    No assets match the current filters.
                  </td>
                </tr>
              ) : filtered.map((asset, i) => {
                const badge = getStatusBadge(asset.status)
                const tags = getAssetTags(asset)
                return (
                  <tr key={i} className="hover:bg-[var(--color-background-alt)] transition-colors cursor-pointer" onClick={() => setSelected(asset)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{getTypeIcon(asset.type)}</span>
                        <span className="text-[13px] text-[var(--color-foreground)] font-medium">{asset.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--color-foreground-secondary)]">{asset.type}</td>
                    <td className="px-4 py-3"><span className={`badge ${badge.className}`}>{badge.label}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 3).map(t => (
                          <span key={t} className="px-1.5 py-0.5 bg-[var(--color-background-alt)] text-[10px] text-[var(--color-foreground-secondary)] rounded-[var(--radius-sm)]">
                            {t}
                          </span>
                        ))}
                        {tags.length > 3 && <span className="text-[10px] text-[var(--color-foreground-muted)]">+{tags.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: asset.asset_priority || 0 }).map((_, j) => (
                          <div key={j} className="w-1.5 h-4 bg-[#C108AB] rounded-sm" />
                        ))}
                        {Array.from({ length: 5 - (asset.asset_priority || 0) }).map((_, j) => (
                          <div key={j} className="w-1.5 h-4 bg-[var(--color-muted)] rounded-sm" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {asset.file_url ? (
                        <a href={asset.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[13px] text-[#C108AB] hover:underline">
                          <ExternalLink size={12} /> View
                        </a>
                      ) : (
                        <span className="text-[13px] text-[var(--color-foreground-muted)]">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal with tagging */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => { setSelected(null); setTagInput('') }}
        >
          <div
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] w-full max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">Asset Details</h2>
              <button onClick={() => { setSelected(null); setTagInput('') }} className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(selected.type)}</span>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--color-foreground)]">{selected.name}</h3>
                  <p className="text-[11px] text-[var(--color-foreground-muted)]">{selected.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Status</label>
                  <span className={`badge ${getStatusBadge(selected.status).className} mt-1 inline-block`}>{getStatusBadge(selected.status).label}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Assigned</label>
                  <p className="text-[13px] text-[var(--color-foreground)] mt-1">{selected.assigned_to || '—'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Priority</label>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: selected.asset_priority || 0 }).map((_, j) => (
                      <div key={j} className="w-1.5 h-4 bg-[#C108AB] rounded-sm" />
                    ))}
                    {Array.from({ length: 5 - (selected.asset_priority || 0) }).map((_, j) => (
                      <div key={j} className="w-1.5 h-4 bg-[var(--color-muted)] rounded-sm" />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Created</label>
                  <p className="text-[13px] text-[var(--color-foreground)] mt-1">{new Date(selected.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Tagging section (TICKET-026) */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag size={12} className="text-[var(--color-foreground-muted)]" />
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Tags</label>
                </div>

                {/* Existing tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {getAssetTags(selected).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-background-alt)] text-[11px] text-[var(--color-foreground)] rounded-[var(--radius-sm)]"
                    >
                      {tag}
                      <button onClick={() => removeTag(selected, tag)} className="hover:text-red-500">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {getAssetTags(selected).length === 0 && (
                    <span className="text-[11px] text-[var(--color-foreground-muted)]">No tags yet</span>
                  )}
                </div>

                {/* Add tag input */}
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        e.preventDefault()
                        addTag(selected, tagInput.trim())
                      }
                    }}
                    placeholder="Add tag..."
                    className="w-full px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-foreground)] outline-none focus:border-[#C108AB]"
                  />
                  {tagInput.trim() && (
                    <button
                      onClick={() => addTag(selected, tagInput.trim())}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#C108AB]"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>

                {/* Suggested tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {SUGGESTED_TAGS.filter(t => !getAssetTags(selected).includes(t)).slice(0, 6).map(tag => (
                    <button
                      key={tag}
                      onClick={() => addTag(selected, tag)}
                      className="px-2 py-0.5 text-[10px] text-[var(--color-foreground-muted)] hover:text-[#C108AB] hover:bg-[var(--color-background-alt)] rounded-[var(--radius-sm)] transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* File link */}
              {selected.file_url && (
                <div className="border-t border-[var(--color-border)] pt-4">
                  <a
                    href={selected.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[13px] text-[#C108AB] hover:underline"
                  >
                    <ExternalLink size={14} />
                    View File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
