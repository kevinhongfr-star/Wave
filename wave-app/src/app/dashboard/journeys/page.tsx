import Link from "next/link"

const items = [{'status': 'Active', 'title': 'Website Visitor → Lead Magnet', 'enrolled': 847, 'conversion': '12.3%', 'steps': '4 steps'}, {'status': 'Active', 'title': 'Webinar Registration → Follow-up', 'enrolled': 342, 'conversion': '28.1%', 'steps': '5 steps'}, {'status': 'Active', 'title': 'Assessment Buyer → Onboarding', 'enrolled': 156, 'conversion': '67.2%', 'steps': '6 steps'}, {'status': 'Paused', 'title': 'Newsletter → Product Interest', 'enrolled': 1240, 'conversion': '4.8%', 'steps': '3 steps'}, {'status': 'Draft', 'title': 'Council Member Invitation Flow', 'enrolled': 0, 'conversion': '—', 'steps': '4 steps'}]

export default function B2CJourneyEnginePage() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">B2C Journey Engine</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          B2C Journey Engine
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Automated nurture sequences and buyer journey flows
        </p>
      </div>

      <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">title</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">enrolled</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">conversion</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">steps</th>
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
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.enrolled}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.conversion}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.steps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
