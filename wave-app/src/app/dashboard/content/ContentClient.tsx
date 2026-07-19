'use client'

import Link from "next/link"

interface ContentItem {
  title: string
  status: string
  channel: string
  date: string
  author: string
}

export default function ContentClient({ items }: { items: ContentItem[] }) {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Content Calendar</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Content Calendar
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Build tracker data from Supabase — {items.length} deliverables
        </p>
      </div>

      <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Deliverable</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Phase</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Date</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {items.map((item, i) => (
                <tr key={i} className="hover:bg-[var(--color-background-alt)] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`badge ${
                      ['Active', 'Published', 'Sent', 'Complete', 'Open', 'active', '↑'].includes(item.status) ? 'badge-success' :
                      ['In Review', 'In Progress', 'Scheduled', 'Queued', 'Draft', 'Planning', 'Paused', 'idle', '→'].includes(item.status) ? 'badge-info' :
                      ['Closed', '↓'].includes(item.status) ? 'badge-neutral' : 'badge-warning'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.title}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.channel}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.date}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
