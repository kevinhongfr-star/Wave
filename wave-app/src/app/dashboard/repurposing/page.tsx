import Link from "next/link"

const items = [{'status': 'Complete', 'title': 'Podcast Ep.2 → Blog + LinkedIn + Email', 'source': 'Riverside recording', 'outputs': '4 pieces', 'date': 'Jul 8'}, {'status': 'Complete', 'title': 'Webinar Recording → Clips + Slides', 'source': 'Zoom webinar', 'outputs': '6 pieces', 'date': 'Jul 5'}, {'status': 'In Progress', 'title': 'Case Study → Social Series + Infographic', 'source': 'Enterprise diagnostic', 'outputs': '5 pieces (3/5)', 'date': 'Jul 10'}, {'status': 'Queued', 'title': 'LEAP Assessment Results → Email Series', 'source': 'Assessment data', 'outputs': '3 planned', 'date': 'Jul 12'}, {'status': 'Draft', 'title': 'Board Report Template → LinkedIn Carousel', 'source': 'Q2 board deck', 'outputs': '8 slides', 'date': '—'}]

export default function ContentRepurposingEnginePage() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Content Repurposing Engine</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Content Repurposing Engine
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Transform one piece of content into multiple formats automatically
        </p>
      </div>

      <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">title</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">source</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">outputs</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">date</th>
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
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.source}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.outputs}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
