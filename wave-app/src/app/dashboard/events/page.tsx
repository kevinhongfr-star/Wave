import Link from "next/link"

const items = [{'status': 'Open', 'title': 'Leadership Diagnostic Summit', 'date': 'Jul 22', 'registered': 247, 'capacity': 500, 'type': 'Webinar'}, {'status': 'Open', 'title': 'AI & Leadership Workshop — Paris', 'date': 'Aug 5', 'registered': 34, 'capacity': 80, 'type': 'In-person'}, {'status': 'Open', 'title': 'Cross-Cultural Team Building Masterclass', 'date': 'Aug 15', 'registered': 89, 'capacity': 200, 'type': 'Virtual'}, {'status': 'Closed', 'title': 'Q2 CHRO Roundtable', 'date': 'Jun 28', 'registered': 45, 'capacity': 45, 'type': 'Virtual'}, {'status': 'Planning', 'title': 'Gravitas Shift Live — London', 'date': 'Sep 10', 'registered': 0, 'capacity': 300, 'type': 'In-person'}]

export default function EventsRegistrationPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Events & Registration</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Events & Registration
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Webinars, workshops, and event management with registration tracking
        </p>
      </div>

      <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">title</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">date</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">registered</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">capacity</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">type</th>
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
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.date}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.registered}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.capacity}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
