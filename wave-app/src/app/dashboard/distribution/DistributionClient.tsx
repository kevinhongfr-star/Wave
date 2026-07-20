'use client'

import { useState, useMemo } from 'react'
import Link from "next/link"
import { Mail, Send, Plus, X, Clock, Calendar, MessageSquare, ChevronRight, TrendingUp, Eye, Edit3, Trash2 } from 'lucide-react'
import type { EmailSequence, SequenceEmail } from './page'

function getStatusBadge(status: string): { className: string; label: string } {
  const statusMap: Record<string, { className: string; label: string }> = {
    'active': { className: 'badge-success', label: 'Active' },
    'draft': { className: 'badge-warning', label: 'Draft' },
    'paused': { className: 'badge-neutral', label: 'Paused' },
    'complete': { className: 'badge-success', label: 'Complete' },
  }
  return statusMap[status.toLowerCase()] || { className: 'badge-neutral', label: status }
}

const TRIGGER_TYPES = ['manual', 'on_campaign_start', 'on_assessment_completion', 'on_form_submit']

export default function DistributionClient({ sequences }: { sequences: EmailSequence[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const statuses = useMemo(() => ['All', ...Array.from(new Set(sequences.map(s => s.status).filter(Boolean)))], [sequences])
  const types = useMemo(() => ['All', ...Array.from(new Set(sequences.map(s => s.type).filter(Boolean)))], [sequences])

  const filtered = useMemo(() => {
    return sequences.filter(s => {
      const matchesSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter
      const matchesType = typeFilter === 'All' || s.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [sequences, search, statusFilter, typeFilter])

  async function handleSend(sequence: EmailSequence) {
    setIsSending(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsSending(false)
    alert(`Sequence "${sequence.name}" sent! This triggers Maria agent to send emails.`)
  }

  const totals = useMemo(() => ({
    total: sequences.length,
    active: sequences.filter(s => s.status === 'active').length,
    emails: sequences.reduce((acc, s) => acc + s.email_count, 0),
  }), [sequences])

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Distribution</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
              Email Sequences
            </h1>
            <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
              {totals.total} sequences · {totals.emails} emails · {totals.active} active
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#C108AB] text-white text-[12px] font-semibold rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            New Sequence
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={14} className="text-[#C108AB]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Total Sequences</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{totals.total}</div>
        </div>
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={14} className="text-[#0EA5E9]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Total Emails</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{totals.emails}</div>
        </div>
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-[var(--color-success)]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Active</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{totals.active}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
          <Mail size={14} className="text-[var(--color-foreground-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sequences..."
            className="bg-transparent border-none outline-none text-[13px] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] w-40"
          />
        </div>
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
      </div>

      {/* Sequence cards */}
      {filtered.length === 0 ? (
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-8 text-center text-[13px] text-[var(--color-foreground-muted)]">
          No sequences match the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((seq, i) => {
            const badge = getStatusBadge(seq.status)
            return (
              <div key={i} className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[#C108AB]20 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#C108AB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold text-[var(--color-foreground)] leading-snug line-clamp-2">
                      {seq.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${badge.className} text-[10px]`}>{badge.label}</span>
                      <span className="text-[10px] text-[var(--color-foreground-muted)]">{seq.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSelectedSequence(seq)} className="p-1.5 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-alt)] rounded-[var(--radius-sm)]">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => confirm(`Delete ${seq.name}?`) && alert('Deleted')} className="p-1.5 text-[var(--color-foreground-muted)] hover:text-red-500 hover:bg-red-50 rounded-[var(--radius-sm)]">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] mb-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-foreground-muted)] flex items-center gap-1">
                      <MessageSquare size={10} /> Emails
                    </span>
                    <span className="font-semibold text-[var(--color-foreground)]">{seq.email_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-foreground-muted)] flex items-center gap-1">
                      <Calendar size={10} /> Trigger
                    </span>
                    <span className="font-semibold text-[var(--color-foreground)]">{seq.trigger_type?.replace('_', ' ') || 'Manual'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-foreground-muted)] flex items-center gap-1">
                      <Clock size={10} /> Created
                    </span>
                    <span className="font-semibold text-[var(--color-foreground)]">
                      {new Date(seq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSequence(seq)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)] transition-colors"
                  >
                    <Eye size={12} /> Preview
                  </button>
                  {seq.status === 'active' && (
                    <button
                      onClick={() => handleSend(seq)}
                      disabled={isSending}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-[12px] font-semibold rounded-[var(--radius-md)] transition-colors ${
                        isSending ? 'bg-gray-100 text-gray-500' : 'bg-[#C108AB] text-white hover:opacity-90'
                      }`}
                    >
                      <Send size={12} className={isSending ? 'animate-pulse' : ''} />
                      {isSending ? 'Sending...' : 'Send'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal (TICKET-032, 033) */}
      {selectedSequence && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSequence(null)}>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">{selectedSequence.name}</h2>
                <p className="text-[11px] text-[var(--color-foreground-muted)] mt-0.5">{selectedSequence.type} · {getStatusBadge(selectedSequence.status).label}</p>
              </div>
              <button onClick={() => setSelectedSequence(null)} className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {/* Timeline preview (TICKET-033) */}
              <div className="mb-6">
                <h3 className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] mb-3 flex items-center gap-2">
                  <Clock size={12} /> Sequence Timeline
                </h3>
                {selectedSequence.emails.length === 0 ? (
                  <div className="text-center py-8 text-[13px] text-[var(--color-foreground-muted)]">
                    No emails in this sequence yet. Add emails below.
                  </div>
                ) : (
                  <div className="relative pl-4">
                    {selectedSequence.emails.map((email, idx) => (
                      <div key={email.id} className="relative mb-6 last:mb-0">
                        <div className="absolute left-[-12px] top-1 w-3 h-3 rounded-full bg-[#C108AB] border-2 border-[var(--color-card)]" />
                        {idx < selectedSequence.emails.length - 1 && (
                          <div className="absolute left-[-10px] top-4 bottom-0 w-0.5 bg-[var(--color-border)]" />
                        )}
                        <div className="bg-[var(--color-background-alt)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-[#C108AB] uppercase">Email {email.order_num}</span>
                            {email.delay_days !== null && email.delay_days > 0 && (
                              <span className="text-[10px] text-[var(--color-foreground-muted)] flex items-center gap-1">
                                <Clock size={10} /> +{email.delay_days} day{email.delay_days > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <h4 className="text-[13px] font-semibold text-[var(--color-foreground)] mb-1">{email.subject}</h4>
                          {email.preview_text && <p className="text-[11px] text-[var(--color-foreground-muted)] mb-2">&quot;{email.preview_text}&quot;</p>}
                          {email.body && (
                            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-sm)] p-2 text-[11px] text-[var(--color-foreground-secondary)] line-clamp-3">
                              {email.body}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Performance metrics (TICKET-040) */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <h3 className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] mb-3 flex items-center gap-2">
                  <TrendingUp size={12} /> Performance Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Sent', value: '-', color: '#0EA5E9' },
                    { label: 'Opened', value: '-', color: '#8B5CF6' },
                    { label: 'Clicked', value: '-', color: '#10B981' },
                    { label: 'Unsubscribed', value: '-', color: '#F97316' },
                  ].map(metric => (
                    <div key={metric.label} className="bg-[var(--color-background-alt)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-3">
                      <div className="text-[20px] font-bold" style={{ color: metric.color }}>{metric.value}</div>
                      <div className="text-[10px] text-[var(--color-foreground-muted)]">{metric.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[var(--color-foreground-muted)] mt-2 italic">
                  Metrics will populate once email sequences are sent via Maria agent.
                </p>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <button onClick={() => setSelectedSequence(null)} className="px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)]">
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSend(selectedSequence)}
                  disabled={isSending || selectedSequence.status !== 'active'}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold rounded-[var(--radius-md)] transition-colors ${
                    isSending || selectedSequence.status !== 'active'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-[#C108AB] text-white hover:opacity-90'
                  }`}
                >
                  <Send size={14} className={isSending ? 'animate-pulse' : ''} />
                  {isSending ? 'Sending...' : 'Send Sequence'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create sequence modal (TICKET-032) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">New Email Sequence</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] block mb-1">Name</label>
                <input type="text" placeholder="Enter sequence name" className="w-full px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] outline-none focus:border-[#C108AB]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] block mb-1">Type</label>
                  <input type="text" placeholder="e.g., Newsletter" className="w-full px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] outline-none focus:border-[#C108AB]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] block mb-1">Trigger</label>
                  <select className="w-full px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] outline-none focus:border-[#C108AB]">
                    {TRIGGER_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] block mb-1">Status</label>
                <div className="flex gap-2">
                  {(['draft', 'active'] as const).map(status => (
                    <button key={status} className={`flex-1 py-2 text-[11px] font-semibold rounded-[var(--radius-md)] border transition-colors ${status === 'draft' ? 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-foreground)]' : 'bg-[#C108AB] border-[#C108AB] text-white'}`}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-[var(--color-border)] pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Emails</label>
                  <button className="text-[11px] text-[#C108AB] font-semibold flex items-center gap-1">
                    <Plus size={12} /> Add Email
                  </button>
                </div>
                <div className="text-center py-6 text-[13px] text-[var(--color-foreground-muted)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]">
                  No emails added yet. Click &quot;Add Email&quot; to create your first email.
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)]">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  alert('Sequence saved! This requires a write-back API to persist to Supabase.')
                }}
                className="px-4 py-2 bg-[#C108AB] text-white text-[12px] font-semibold rounded-[var(--radius-md)] hover:opacity-90"
              >
                Save Sequence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
