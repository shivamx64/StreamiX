'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, Video, Settings, Activity, Cpu, ChevronRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem { label: string; href: string; icon: React.ElementType; badge?: string }

const primaryNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload',    href: '/upload',    icon: Upload },
  { label: 'Videos',    href: '/videos',    icon: Video },
]

const systemNav: NavItem[] = [
  { label: 'Jobs',     href: '/jobs',     icon: Activity },
  { label: 'Workers',  href: '/workers',  icon: Cpu },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-30"
      style={{ width: 'var(--sidebar-width)', backgroundColor: 'hsl(var(--sidebar-bg))' }}
    >
      <div className="flex items-center gap-2.5 px-5 h-[var(--navbar-height)] shrink-0"
        style={{ borderBottom: '1px solid hsl(var(--sidebar-border))' }}>
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-accent shadow-accent">
          <Zap className="w-3.5 h-3.5 text-white fill-white" />
        </div>
        <span className="text-[15px] font-display font-700 tracking-tight" style={{ color: 'hsl(var(--sidebar-fg))' }}>
          Streamix
        </span>
      </div>

      <nav className="flex flex-col flex-1 px-3 py-4 gap-0.5 overflow-y-auto scrollbar-thin">
        <NavSection label="Platform" items={primaryNav} pathname={pathname} />
        <div className="my-3" style={{ height: '1px', backgroundColor: 'hsl(var(--sidebar-border))' }} />
        <NavSection label="System"   items={systemNav}  pathname={pathname} />
      </nav>

      <div className="px-3 py-3 shrink-0" style={{ borderTop: '1px solid hsl(var(--sidebar-border))' }}>
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors"
          style={{ color: 'hsl(var(--sidebar-fg-muted))' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'hsl(var(--sidebar-item-hover))')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display font-700 shrink-0"
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'white' }}>
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium truncate" style={{ color: 'hsl(var(--sidebar-fg))' }}>user@streamix.dev</p>
            <p className="text-[10px] truncate" style={{ color: 'hsl(var(--sidebar-fg-muted))' }}>Free plan</p>
          </div>
          <ChevronRight className="w-3 h-3 shrink-0" />
        </div>
      </div>
    </aside>
  )
}

function NavSection({ label, items, pathname }: { label: string; items: NavItem[]; pathname: string }) {
  return (
    <div>
      <p className="px-2.5 mb-1.5 text-[10px] font-display font-700 tracking-widest uppercase"
        style={{ color: 'hsl(var(--sidebar-fg-muted))' }}>
        {label}
      </p>
      {items.map(item => <NavItemRow key={item.href} item={item} active={pathname === item.href} />)}
    </div>
  )
}

function NavItemRow({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn('flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors relative')}
      style={{
        color: active ? 'hsl(var(--sidebar-accent))' : 'hsl(var(--sidebar-fg))',
        backgroundColor: active ? 'hsl(var(--sidebar-item-active))' : 'transparent',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'hsl(var(--sidebar-item-hover))' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
          style={{ backgroundColor: 'hsl(var(--sidebar-accent))' }} />
      )}
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-[10px] font-700 px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: 'hsl(var(--accent-muted))', color: 'hsl(var(--accent))' }}>
          {item.badge}
        </span>
      )}
    </Link>
  )
}