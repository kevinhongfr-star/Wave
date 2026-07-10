import Link from "next/link"

const items = [{'status': 'Published', 'title': 'AI in Leadership: 5 Principles', 'channel': 'LinkedIn', 'date': 'Jul 10', 'author': 'Echo'}, {'status': 'In Review', 'title': 'Q3 Newsletter — July Edition', 'channel': 'Email', 'date': 'Jul 12', 'author': 'Maria'}, {'status': 'Draft', 'title': 'Diagnostic Intelligence: Why Surveys Fail', 'channel': 'Blog', 'date': 'Jul 15', 'author': 'Xuemei'}, {'status': 'Scheduled', 'title': 'Gravitas Shift Podcast Ep.3 Promo', 'channel': 'Social', 'date': 'Jul 14', 'author': 'Vanjulla'}, {'status': 'Idea', 'title': 'Cross-Cultural Teams Webinar Recap', 'channel': 'LinkedIn', 'date': 'Jul 18', 'author': 'Carl'}]

export default function ContentCalendarPage() {
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
          Plan, create, and manage all content pieces across channels
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
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">author</th>
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
