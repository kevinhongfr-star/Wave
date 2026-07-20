'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import {
  Bot, Zap, Activity, Clock, Settings, Play, Pause, RefreshCw,
  Mail, Megaphone, Calendar, CreditCard, Globe, ArrowRight, TrendingUp,
  AlertCircle, CheckCircle, FileText, Terminal, Edit3, X, Plus
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  role: string
  status: 'active' | 'idle' | 'error'
  lastAction: string
  lastActionTime: string
  color: string
  icon: typeof Mail
  tasksCompleted: number
  tasksInQueue: number
  avgResponseTime: number
  uptime: number
  errorCount: number
}

interface ActivityLog {
  id: string
  agentId: string
  agentName: string
  type: 'publish' | 'send' | 'create' | 'deploy' | 'process' | 'error'
  message: string
  timestamp: string
}

interface Task {
  id: string
  agentId: string
  agentName: string
  title: string
  status: 'pending' | 'processing' | 'completed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

interface AgentConfig {
  maxTasks: number
  timeout: number
  retryCount: number
  enabledChannels: string[]
}

const agentData: Agent[] = [
  {
    id: 'echo',
    name: 'Echo',
    role: 'Content & Distribution',
    status: 'active',
    lastAction: 'Published LinkedIn post',
    lastActionTime: '2 minutes ago',
    color: '#EC4899',
    icon: Megaphone,
    tasksCompleted: 156,
    tasksInQueue: 3,
    avgResponseTime: 2.3,
    uptime: 99.7,
    errorCount: 2,
  },
  {
    id: 'maria',
    name: 'Maria',
    role: 'Email & Leads',
    status: 'active',
    lastAction: 'Sent Q3 Newsletter sequence',
    lastActionTime: '5 minutes ago',
    color: '#0EA5E9',
    icon: Mail,
    tasksCompleted: 284,
    tasksInQueue: 7,
    avgResponseTime: 4.1,
    uptime: 99.9,
    errorCount: 1,
  },
  {
    id: 'carl',
    name: 'Carl',
    role: 'Events & Webinars',
    status: 'active',
    lastAction: 'Created webinar reminder',
    lastActionTime: '12 minutes ago',
    color: '#8B5CF6',
    icon: Calendar,
    tasksCompleted: 89,
    tasksInQueue: 2,
    avgResponseTime: 3.2,
    uptime: 99.5,
    errorCount: 4,
  },
  {
    id: 'emily',
    name: 'Emily',
    role: 'Registration & Payment',
    status: 'idle',
    lastAction: 'Processed 12 registrations',
    lastActionTime: '1 hour ago',
    color: '#10B981',
    icon: CreditCard,
    tasksCompleted: 442,
    tasksInQueue: 0,
    avgResponseTime: 1.8,
    uptime: 100,
    errorCount: 0,
  },
  {
    id: 'valentina',
    name: 'Valentina',
    role: 'Website',
    status: 'idle',
    lastAction: 'Deployed landing page v3',
    lastActionTime: '3 hours ago',
    color: '#F97316',
    icon: Globe,
    tasksCompleted: 67,
    tasksInQueue: 1,
    avgResponseTime: 8.5,
    uptime: 98.2,
    errorCount: 3,
  },
]

const activityLogs: ActivityLog[] = [
  { id: '1', agentId: 'maria', agentName: 'Maria', type: 'send', message: 'Sent 500 emails in Q3 Newsletter sequence', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: '2', agentId: 'echo', agentName: 'Echo', type: 'publish', message: 'Published "AI Marketing Trends" to LinkedIn', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
  { id: '3', agentId: 'carl', agentName: 'Carl', type: 'create', message: 'Created reminder for "Webinar: Digital Transformation"', timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString() },
  { id: '4', agentId: 'emily', agentName: 'Emily', type: 'process', message: 'Processed 12 new event registrations', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  { id: '5', agentId: 'valentina', agentName: 'Valentina', type: 'deploy', message: 'Deployed landing page v3 to production', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: '6', agentId: 'echo', agentName: 'Echo', type: 'publish', message: 'Published blog post to company website', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: '7', agentId: 'maria', agentName: 'Maria', type: 'send', message: 'Triggered welcome email sequence to 23 new leads', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
]

const tasks: Task[] = [
  { id: 't1', agentId: 'maria', agentName: 'Maria', title: 'Send weekly digest', status: 'processing', priority: 'high', createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  { id: 't2', agentId: 'echo', agentName: 'Echo', title: 'Publish LinkedIn article', status: 'pending', priority: 'medium', createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: 't3', agentId: 'carl', agentName: 'Carl', title: 'Sync webinar registrations', status: 'pending', priority: 'low', createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: 't4', agentId: 'valentina', agentName: 'Valentina', title: 'Update pricing page', status: 'pending', priority: 'medium', createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
]

function formatTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function AgentBridgePage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [agentStatus, setAgentStatus] = useState<Record<string, 'active' | 'idle' | 'error'>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus: Record<string, 'active' | 'idle' | 'error'> = {}
      agentData.forEach(a => {
        if (Math.random() > 0.95) {
          newStatus[a.id] = a.status === 'active' ? 'idle' : 'active'
        }
      })
      if (Object.keys(newStatus).length > 0) {
        setAgentStatus(prev => ({ ...prev, ...newStatus }))
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const activeAgents = agentData.filter(a => (agentStatus[a.id] || a.status) === 'active').length
  const totalTasks = agentData.reduce((acc, a) => acc + a.tasksCompleted, 0)
  const avgUptime = Math.round(agentData.reduce((acc, a) => acc + a.uptime, 0) / agentData.length * 10) / 10
  const queueCount = agentData.reduce((acc, a) => acc + a.tasksInQueue, 0)

  function handleRefresh() {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  function getActivityIcon(type: ActivityLog['type']) {
    switch (type) {
      case 'publish': return Megaphone
      case 'send': return Mail
      case 'create': return Plus
      case 'deploy': return Zap
      case 'process': return CheckCircle
      case 'error': return AlertCircle
      default: return Activity
    }
  }

  function getActivityColor(type: ActivityLog['type']) {
    switch (type) {
      case 'publish': return '#EC4899'
      case 'send': return '#0EA5E9'
      case 'create': return '#10B981'
      case 'deploy': return '#F97316'
      case 'process': return '#8B5CF6'
      case 'error': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const config: AgentConfig = {
    maxTasks: 10,
    timeout: 300,
    retryCount: 3,
    enabledChannels: ['email', 'linkedin', 'web'],
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)] mb-2">
          <Link href="/dashboard" className="hover:text-[#C108AB] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">Agent Bridge</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--color-foreground)] font-[var(--font-serif)]">
              Agent Bridge
            </h1>
            <p className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
              {activeAgents} of {agentData.length} agents active — {queueCount} tasks in queue
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)] transition-colors ${isRefreshing ? 'opacity-50' : ''}`}
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setShowConfig(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)] transition-colors"
            >
              <Settings size={13} />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* KPI cards (TICKET-060) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={14} className="text-[#C108AB]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Active Agents</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{activeAgents}/{agentData.length}</div>
        </div>
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-[var(--color-success)]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Tasks Completed</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{totalTasks}</div>
        </div>
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-[#8B5CF6]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Avg Uptime</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{avgUptime}%</div>
        </div>
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={14} className="text-[#0EA5E9]" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Queue</span>
          </div>
          <div className="text-[24px] font-bold text-[var(--color-foreground)]">{queueCount}</div>
        </div>
      </div>

      {/* Agent Cards (TICKET-056) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {agentData.map((agent) => {
          const status = agentStatus[agent.id] || agent.status
          const Icon = agent.icon
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="card bg-[var(--color-card)] border border-[var(--color-border)] p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center text-white" style={{ backgroundColor: agent.color }}>
                      <Icon size={22} />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[var(--color-card)] ${
                      status === 'active' ? 'bg-[var(--color-success)]' : status === 'error' ? 'bg-red-500 animate-pulse' : 'bg-[var(--color-foreground-muted)]'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[var(--color-foreground)]">{agent.name}</h3>
                    <p className="text-[11px] text-[var(--color-foreground-muted)]">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className={`p-1.5 rounded-[var(--radius-sm)] transition-colors ${
                    status === 'active' ? 'text-[var(--color-success)] hover:bg-[var(--color-success)]/10' : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-alt)]'
                  }`}>
                    {status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button className="p-1.5 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-alt)] rounded-[var(--radius-sm)]">
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[var(--color-background-alt)] rounded-[var(--radius-sm)] p-2">
                  <div className="text-[10px] text-[var(--color-foreground-muted)] mb-0.5">Completed</div>
                  <div className="text-[16px] font-bold text-[var(--color-foreground)]">{agent.tasksCompleted}</div>
                </div>
                <div className="bg-[var(--color-background-alt)] rounded-[var(--radius-sm)] p-2">
                  <div className="text-[10px] text-[var(--color-foreground-muted)] mb-0.5">Queue</div>
                  <div className="text-[16px] font-bold text-[var(--color-foreground)]">{agent.tasksInQueue}</div>
                </div>
                <div className="bg-[var(--color-background-alt)] rounded-[var(--radius-sm)] p-2">
                  <div className="text-[10px] text-[var(--color-foreground-muted)] mb-0.5">Response</div>
                  <div className="text-[16px] font-bold text-[var(--color-foreground)]">{agent.avgResponseTime}s</div>
                </div>
                <div className="bg-[var(--color-background-alt)] rounded-[var(--radius-sm)] p-2">
                  <div className="text-[10px] text-[var(--color-foreground-muted)] mb-0.5">Uptime</div>
                  <div className="text-[16px] font-bold text-[var(--color-foreground)]">{agent.uptime}%</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-foreground-muted)]">
                <Activity size={10} />
                <span className="text-[var(--color-foreground)]">{agent.lastAction}</span>
                <span>· {agent.lastActionTime}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity Timeline (TICKET-059) */}
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
            <h3 className="text-[13px] font-bold text-[var(--color-foreground)] flex items-center gap-2">
              <Activity size={14} /> Activity Timeline
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {activityLogs.map((log) => {
              const Icon = getActivityIcon(log.type)
              return (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0" style={{ backgroundColor: `${getActivityColor(log.type)}20` }}>
                    <Icon size={12} style={{ color: getActivityColor(log.type) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-[var(--color-foreground)]">{log.agentName}</span>
                      <ArrowRight size={10} className="text-[var(--color-foreground-muted)]" />
                      <span className="text-[12px] text-[var(--color-foreground)]">{log.message}</span>
                    </div>
                    <div className="text-[10px] text-[var(--color-foreground-muted)] mt-0.5">{formatTime(log.timestamp)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Task Queue (TICKET-064) */}
        <div className="card bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
            <h3 className="text-[13px] font-bold text-[var(--color-foreground)] flex items-center gap-2">
              <Clock size={14} /> Task Queue
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-[var(--color-background-alt)] rounded-[var(--radius-md)]">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-[var(--color-foreground-muted)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[var(--color-foreground)] truncate">{task.title}</div>
                  <div className="text-[10px] text-[var(--color-foreground-muted)]">by {task.agentName} · {formatTime(task.createdAt)}</div>
                </div>
                <span className={`badge text-[10px] ${
                  task.status === 'completed' ? 'badge-success' : task.status === 'processing' ? 'badge-info' : 'badge-neutral'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-[13px] text-[var(--color-foreground-muted)]">
                No tasks in queue
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Logs (TICKET-066) */}
      <div className="mt-4 card bg-[var(--color-card)] border border-[var(--color-border)]">
        <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
          <h3 className="text-[13px] font-bold text-[var(--color-foreground)] flex items-center gap-2">
            <AlertCircle size={14} /> Error Logs
          </h3>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Agent</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Error</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Count</th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)]">Last Occurrence</th>
                </tr>
              </thead>
              <tbody>
                {agentData.filter(a => a.errorCount > 0).map((agent) => (
                  <tr key={agent.id} className="hover:bg-[var(--color-background-alt)]">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                        <span className="text-[12px] font-semibold text-[var(--color-foreground)]">{agent.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[12px] text-[var(--color-foreground-secondary)]">
                      <span className="flex items-center gap-1">
                        <FileText size={11} />
                        {agent.id === 'carl' ? 'Calendar sync timeout' : 'API rate limit exceeded'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[12px] font-semibold text-red-500">{agent.errorCount}</td>
                    <td className="px-3 py-2 text-[12px] text-[var(--color-foreground-muted)]">{agent.lastActionTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAgent(null)}>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center text-white" style={{ backgroundColor: selectedAgent.color }}>
                  {(() => { const Icon = selectedAgent.icon; return <Icon size={24} /> })()}
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[var(--color-foreground)]">{selectedAgent.name}</h2>
                  <p className="text-[11px] text-[var(--color-foreground-muted)]">{selectedAgent.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAgent(null)} className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[var(--color-background-alt)] rounded-[var(--radius-md)] p-3 text-center">
                  <div className="text-[18px] font-bold text-[var(--color-foreground)]">{selectedAgent.tasksCompleted}</div>
                  <div className="text-[10px] text-[var(--color-foreground-muted)]">Completed</div>
                </div>
                <div className="bg-[var(--color-background-alt)] rounded-[var(--radius-md)] p-3 text-center">
                  <div className="text-[18px] font-bold text-[var(--color-foreground)]">{selectedAgent.avgResponseTime}s</div>
                  <div className="text-[10px] text-[var(--color-foreground-muted)]">Avg Response</div>
                </div>
                <div className="bg-[var(--color-background-alt)] rounded-[var(--radius-md)] p-3 text-center">
                  <div className="text-[18px] font-bold text-[var(--color-foreground)]">{selectedAgent.uptime}%</div>
                  <div className="text-[10px] text-[var(--color-foreground-muted)]">Uptime</div>
                </div>
              </div>
              <div className="border-t border-[var(--color-border)] pt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  {activityLogs.filter(l => l.agentId === selectedAgent.id).map(log => (
                    <div key={log.id} className="flex items-center justify-between text-[12px]">
                      <span className="text-[var(--color-foreground-secondary)]">{log.message}</span>
                      <span className="text-[var(--color-foreground-muted)]">{formatTime(log.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal (TICKET-057) */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConfig(false)}>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[var(--color-foreground)]">Agent Bridge Settings</h2>
              <button onClick={() => setShowConfig(false)} className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] block mb-1">Max Concurrent Tasks</label>
                <input type="number" defaultValue={config.maxTasks} className="w-full px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] outline-none focus:border-[#C108AB]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] block mb-1">Task Timeout (seconds)</label>
                <input type="number" defaultValue={config.timeout} className="w-full px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] outline-none focus:border-[#C108AB]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] block mb-1">Retry Count</label>
                <input type="number" defaultValue={config.retryCount} className="w-full px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] outline-none focus:border-[#C108AB]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted)] block mb-1">Enabled Channels</label>
                <div className="flex flex-wrap gap-2">
                  {['email', 'linkedin', 'web', 'calendly', 'hubspot'].map(channel => (
                    <button key={channel} className={`px-3 py-1.5 text-[11px] font-semibold rounded-[var(--radius-md)] transition-colors ${
                      config.enabledChannels.includes(channel)
                        ? 'bg-[#C108AB] text-white'
                        : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)]'
                    }`}>
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <button onClick={() => setShowConfig(false)} className="px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] text-[12px] font-semibold text-[var(--color-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--color-background-alt)]">
                Cancel
              </button>
              <button
                onClick={() => { setShowConfig(false); alert('Settings saved!') }}
                className="px-4 py-2 bg-[#C108AB] text-white text-[12px] font-semibold rounded-[var(--radius-md)] hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
