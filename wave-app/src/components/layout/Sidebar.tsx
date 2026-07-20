'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, FolderOpen, Folder, Send,
  Route, RefreshCw, CalendarPlus, BarChart3, Megaphone,
  Bot, ChevronDown, ChevronRight, Settings
} from 'lucide-react'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/dashboard/content', label: 'Content Calendar', icon: Calendar, badge: '12' },
      { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },
      { href: '/dashboard/templates', label: 'Template Library', icon: FolderOpen },
      { href: '/dashboard/assets', label: 'Assets', icon: Folder },
    ],
  },
  {
    label: 'Distribution',
    items: [
      { href: '/dashboard/distribution', label: 'Distribution Engine', icon: Send },
      { href: '/dashboard/journeys', label: 'B2C Journeys', icon: Route, badge: '3' },
    ],
  },
  {
    label: 'Repurposing',
    items: [
      { href: '/dashboard/repurposing', label: 'Repurposing Maps', icon: RefreshCw },
    ],
  },
  {
    label: 'Events',
    items: [
      { href: '/dashboard/events', label: 'Events & Registration', icon: CalendarPlus },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { href: '/dashboard/analytics', label: 'Analytics & Reports', icon: BarChart3 },
      { href: '/dashboard/agents', label: 'Agent Bridge', icon: Bot, badge: '5' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(navGroups.map(g => [g.label, true]))
  )

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="w-60 bg-[#0F1115] text-white fixed top-0 bottom-0 left-0 flex flex-col z-50 overflow-y-auto">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-white/5">
        <h1 className="text-2xl font-bold tracking-[6px] font-[var(--font-serif)] text-white">WAVE</h1>
        <p className="text-[10px] text-[#C108AB] tracking-[1.5px] uppercase mt-0.5 opacity-80 font-semibold">
          Marketing Operations
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3">
        {navGroups.map(group => (
          <div key={group.label} className="mb-5">
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex items-center justify-between w-full px-2.5 mb-1.5 cursor-pointer"
            >
              <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-white/30">
                {group.label}
              </span>
              {expandedGroups[group.label] ? (
                <ChevronDown size={12} className="text-white/20" />
              ) : (
                <ChevronRight size={12} className="text-white/20" />
              )}
            </button>
            {expandedGroups[group.label] && group.items.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-medium transition-all duration-150
                    ${isActive
                      ? 'bg-[rgba(193,8,171,0.15)] text-white font-semibold border-l-2 border-[#C108AB]'
                      : 'text-white/60 hover:bg-white/5 hover:text-white/90 border-l-2 border-transparent'
                    }`}
                >
                  <Icon size={16} className="w-[18px] text-center" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-white/15 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-3.5 border-t border-white/5 flex items-center gap-2.5">
        <div className="w-[30px] h-[30px] rounded-full bg-[#C108AB] flex items-center justify-center font-bold text-[11px] text-white">
          KH
        </div>
        <div>
          <div className="text-[12px] font-semibold">Kevin Hong</div>
          <div className="text-[10px] text-white/40">Admin</div>
        </div>
        <Settings size={14} className="ml-auto text-white/30 cursor-pointer hover:text-white/60 transition-colors" />
      </div>
    </aside>
  )
}
