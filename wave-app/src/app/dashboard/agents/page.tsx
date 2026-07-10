import Link from "next/link"

const items = [{'status': 'active', 'title': 'Echo — Content & Distribution', 'metric': 'Last: Published LinkedIn post', 'detail': 'Tasks today: 4', 'detail2': 'Pending: 1'}, {'status': 'active', 'title': 'Maria — Email & Leads', 'metric': 'Last: Sent Q3 Newsletter', 'detail': 'Tasks today: 3', 'detail2': 'Pending: 2'}, {'status': 'active', 'title': 'Carl — Events & Webinars', 'metric': 'Last: Created webinar reminder', 'detail': 'Tasks today: 2', 'detail2': 'Pending: 0'}, {'status': 'idle', 'title': 'Emily — Registration & Payment', 'metric': 'Last: Processed 12 registrations', 'detail': 'Tasks today: 1', 'detail2': 'Pending: 0'}, {'status': 'idle', 'title': 'Valentina — Website', 'metric': 'Last: Deployed landing page v3', 'detail': 'Tasks today: 0', 'detail2': 'Pending: 1'}]

export default function AgentBridgePage() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Agent Bridge</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Agent Bridge
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Connected AI agents and their current operational status
        </p>
      </div>

      <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">title</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">metric</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">detail</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">detail2</th>
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
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.metric}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.detail}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.detail2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
