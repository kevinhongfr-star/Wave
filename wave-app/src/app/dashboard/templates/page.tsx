import Link from "next/link"

const items = [{'status': 'Active', 'title': 'LinkedIn Post — Thought Leadership', 'type': 'Text', 'uses': 47, 'updated': 'Jul 8'}, {'status': 'Active', 'title': 'Email Sequence — Webinar Follow-up', 'type': 'Email', 'uses': 23, 'updated': 'Jul 5'}, {'status': 'Active', 'title': 'Case Study — Enterprise Diagnostic', 'type': 'Document', 'uses': 12, 'updated': 'Jul 1'}, {'status': 'Draft', 'title': 'Social Carousel — Product Spotlight', 'type': 'Visual', 'uses': 3, 'updated': 'Jul 9'}, {'status': 'Active', 'title': 'Landing Page — Assessment Purchase', 'type': 'Web', 'uses': 8, 'updated': 'Jun 28'}]

export default function TemplateAssetLibraryPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Template & Asset Library</span>
        </div>
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Template & Asset Library
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Reusable templates, brand assets, and content frameworks
        </p>
      </div>

      <div className="card bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">title</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">type</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">uses</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">updated</th>
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
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.type}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.uses}</td>
                  <td className="px-4 py-3 text-[13px] text-[var(--color-foreground)]">{item.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
