'use client'

import Link from "next/link"
import { Mail, Send } from 'lucide-react'

interface Sequence {
  name: string
  status: string
  type: string
  trigger_type: string | null
  created_at: string
}

function getStatusBadge(status: string): { className: string; label: string } {
  const statusMap: Record<string, { className: string; label: string }> = {
    'active': { className: 'badge-success', label: 'Active' },
    'draft': { className: 'badge-warning', label: 'Draft' },
    'paused': { className: 'badge-neutral', label: 'Paused' },
    'complete': { className: 'badge-success', label: 'Complete' },
  }
  return statusMap[status.toLowerCase()] || { className: 'badge-neutral', label: status }
}

export default function DistributionClient({ sequences }: { sequences: Sequence[] }) {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Campaigns</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Email Campaigns
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Email sequences from Supabase — {sequences.length} campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sequences.map((seq, i) => {
          const badge = getStatusBadge(seq.status)
          return (
            <div key={i} className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
              <div className="flex items-start gap-3 mb-3">
                <Mail size={16} className="text-[#C108AB] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-bold text-[var(--color-foreground)] leading-snug">
                    {seq.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${badge.className}`}>{badge.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">
                  {seq.type}
                </span>
              </div>
              <div className="text-[11px] text-[var(--color-foreground-muted)]">
                Trigger: {seq.trigger_type || 'Manual'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
