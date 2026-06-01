'use client'

import { Bell, Search, Plus } from 'lucide-react'
import Link from 'next/link'

interface NavbarProps { title?: string }

export function Navbar({ title }: NavbarProps) {
  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center justify-between px-6 bg-surface"
      style={{ left: 'var(--sidebar-width)', height: 'var(--navbar-height)', borderBottom: '1px solid hsl(var(--border))' }}
    >
      <div className="flex items-center gap-4">
        {title ? (
          <h1 className="text-[15px] font-display font-700 text-foreground tracking-tight">{title}</h1>
        ) : (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-colors cursor-text"
            style={{ backgroundColor: 'hsl(var(--background-subtle))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground-subtle))', minWidth: '220px' }}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span>Search videos…</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'hsl(var(--border))', color: 'hsl(var(--foreground-muted))', fontFamily: 'monospace' }}>
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/upload"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-white transition-all"
          style={{ backgroundColor: 'hsl(var(--accent))', boxShadow: 'var(--shadow-accent)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'hsl(var(--accent-hover))')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'hsl(var(--accent))')}
        >
          <Plus className="w-3.5 h-3.5" /> Upload
        </Link>
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-md transition-colors"
          style={{ color: 'hsl(var(--foreground-muted))' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'hsl(var(--surface-hover))')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'hsl(var(--accent))' }} />
        </button>
      </div>
    </header>
  )
}