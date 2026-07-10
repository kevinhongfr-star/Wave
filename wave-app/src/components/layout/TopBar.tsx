'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, Moon, Sun } from 'lucide-react'

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('lyc-theme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.dataset.theme = 'dark'
    }
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    localStorage.setItem('lyc-theme', next ? 'dark' : 'light')
  }

  return (
    <header className={`h-[var(--nav-height)] sticky top-0 z-40 flex items-center px-5 gap-6 border-b border-[var(--color-border)] transition-shadow duration-200
      ${scrolled ? 'shadow-[var(--shadow-nav)]' : ''}
      bg-[rgba(255,255,255,0.92)] dark:bg-[rgba(13,10,20,0.92)] backdrop-blur-xl`}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-foreground-muted)]">
        <span>WAVE</span>
        <span>/</span>
        <span className="text-[var(--color-foreground)]">Dashboard</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md ml-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-background-alt)] border border-[var(--color-border)]">
          <Search size={14} className="text-[var(--color-foreground-muted)]" />
          <input
            type="text"
            placeholder="Search content, campaigns, journeys..."
            className="bg-transparent border-none outline-none text-[13px] flex-1 p-0 text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)]"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={toggleTheme}
          className="p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className="relative p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#C108AB] rounded-full" />
        </button>
      </div>
    </header>
  )
}
