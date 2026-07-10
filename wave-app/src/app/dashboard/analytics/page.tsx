import Link from "next/link"

const items = [{'status': '↑', 'title': 'Email Open Rate', 'metric': '27.6%', 'delta': '+3.2% vs last month', 'detail': 'Industry avg: 21.5%'}, {'status': '↑', 'title': 'LinkedIn Engagement', 'metric': '4.8%', 'delta': '+1.1% vs last month', 'detail': '1,247 impressions avg'}, {'status': '→', 'title': 'Website Traffic', 'metric': '8,420/mo', 'delta': '+0.3% vs last month', 'detail': 'Bounce rate: 42%'}, {'status': '↑', 'title': 'Lead Conversion', 'metric': '12.3%', 'delta': '+2.1% vs last month', 'detail': '347 leads this month'}, {'status': '↓', 'title': 'Podcast Downloads', 'metric': '89/ep', 'delta': '-8% vs last month', 'detail': 'Avg completion: 72%'}]

export default function AnalyticsIntelligencePage() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Analytics & Intelligence</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Analytics & Intelligence
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Campaign performance, content ROI, and audience insights
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
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">delta</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">detail</th>
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
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.delta}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
