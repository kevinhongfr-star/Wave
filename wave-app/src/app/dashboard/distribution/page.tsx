import Link from "next/link"

const items = [{'status': 'Sent', 'title': 'Q3 Newsletter → 1,240 contacts', 'channel': 'Email', 'date': 'Jul 10 14:00', 'metrics': '1,240 sent / 342 opened'}, {'status': 'Scheduled', 'title': 'LinkedIn Post — AI Leadership', 'channel': 'LinkedIn', 'date': 'Jul 11 09:00', 'metrics': '—'}, {'status': 'Draft', 'title': 'Webinar Invite → CHRO segment', 'channel': 'Email', 'date': 'Jul 15 10:00', 'metrics': '—'}, {'status': 'Sent', 'title': 'Podcast Ep.2 — Cross-posted', 'channel': 'Multi', 'date': 'Jul 8 08:00', 'metrics': '3 platforms / 89 downloads'}, {'status': 'Scheduled', 'title': 'Blog Post — Diagnostic Intelligence', 'channel': 'Website', 'date': 'Jul 15 06:00', 'metrics': '—'}]

export default function DistributionEnginePage() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Distribution Engine</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Distribution Engine
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Automated multi-channel content distribution and scheduling
        </p>
      </div>

      <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">title</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">channel</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">date</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">metrics</th>
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
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.metrics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
