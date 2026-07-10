import {
  FileText, Send, Users, Calendar,
  TrendingUp, TrendingDown, ArrowRight,
  Clock, CheckCircle2, AlertCircle, Bot
} from 'lucide-react'

const kpis = [
  { label: 'Content Pieces', value: '147', delta: '+12%', up: true, detail: '23 in pipeline', icon: FileText },
  { label: 'Email Sequences', value: '18', delta: '+3', up: true, detail: '4 active now', icon: Send },
  { label: 'Active Journeys', value: '7', delta: '-1', up: false, detail: '2,340 contacts enrolled', icon: Users },
  { label: 'Upcoming Events', value: '5', delta: '+2', up: true, detail: '847 registered', icon: Calendar },
]

const recentActivity = [
  { type: 'success', text: 'Email sequence "Q3 Newsletter" sent to 1,240 contacts', time: '2 min ago' },
  { type: 'info', text: 'Content "AI in Leadership" moved to Review stage', time: '15 min ago' },
  { type: 'success', text: 'Journey "Webinar Follow-up" enrolled 56 new contacts', time: '1 hour ago' },
  { type: 'warning', text: 'Content calendar conflict: Jul 15 has 3 overlapping posts', time: '2 hours ago' },
  { type: 'info', text: 'Template "Case Study v2" published to library', time: '3 hours ago' },
  { type: 'success', text: 'Event "Leadership Summit" reached 200 registrations', time: '5 hours ago' },
]

const agentStatus = [
  { name: 'Echo', role: 'Content & Distribution', status: 'active', lastAction: 'Published LinkedIn post' },
  { name: 'Maria', role: 'Email & Leads', status: 'active', lastAction: 'Sent Q3 Newsletter sequence' },
  { name: 'Emily', role: 'Registration & Payment', status: 'idle', lastAction: 'Processed 12 registrations' },
  { name: 'Carl', role: 'Events & Webinars', status: 'active', lastAction: 'Created webinar reminder' },
  { name: 'Valentina', role: 'Website', status: 'idle', lastAction: 'Deployed landing page v3' },
]

export default function DashboardPage() {
  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
          Marketing Dashboard
        </h1>
        <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
          Overview of content operations, distribution, and campaign performance
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">
                  {kpi.label}
                </span>
                <Icon size={16} className="text-[var(--color-foreground-muted)]" />
              </div>
              <div className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.up ? (
                  <TrendingUp size={12} className="text-[var(--color-success)]" />
                ) : (
                  <TrendingDown size={12} className="text-[var(--color-error)]" />
                )}
                <span className={`text-[11px] font-semibold ${kpi.up ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                  {kpi.delta}
                </span>
                <span className="text-[11px] text-[var(--color-foreground-muted)] ml-1">{kpi.detail}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-[14px] font-bold">Recent Activity</h3>
            <button className="text-[11px] font-semibold text-[#C108AB] hover:text-[#A00790] flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {recentActivity.map((item, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                {item.type === 'success' && <CheckCircle2 size={14} className="text-[var(--color-success)] mt-0.5 shrink-0" />}
                {item.type === 'info' && <Clock size={14} className="text-[var(--color-info)] mt-0.5 shrink-0" />}
                {item.type === 'warning' && <AlertCircle size={14} className="text-[var(--color-warning)] mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[var(--color-foreground)] leading-snug">{item.text}</p>
                  <p className="text-[11px] text-[var(--color-foreground-muted)] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status */}
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-[14px] font-bold flex items-center gap-2">
              <Bot size={14} className="text-[#C108AB]" />
              Agent Status
            </h3>
            <span className="badge badge-accent">Live</span>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {agentStatus.map(agent => (
              <div key={agent.name} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-foreground-muted)]'}`} />
                    <span className="text-[13px] font-semibold text-[var(--color-foreground)]">{agent.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${agent.status === 'active' ? 'text-[var(--color-success)]' : 'text-[var(--color-foreground-muted)]'}`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-foreground-muted)] mt-1 ml-4">{agent.role}</p>
                <p className="text-[11px] text-[var(--color-foreground-secondary)] mt-0.5 ml-4">{agent.lastAction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'New Content', href: '/dashboard/content', color: 'bg-[#C108AB] text-white' },
          { label: 'Create Journey', href: '/dashboard/journeys', color: 'bg-[var(--color-teal)] text-white' },
          { label: 'Schedule Email', href: '/dashboard/distribution', color: 'bg-[var(--color-ocean-deep)] text-white' },
          { label: 'New Event', href: '/dashboard/events', color: 'bg-[var(--color-foreground)] text-white' },
        ].map(action => (
          <a
            key={action.label}
            href={action.href}
            className={`btn ${action.color} justify-center py-3 text-[13px] font-semibold hover:opacity-90 transition-opacity`}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  )
}
