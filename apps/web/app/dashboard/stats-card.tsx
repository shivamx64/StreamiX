import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string; value: string | number; icon: LucideIcon
  trend?: { value: number; label?: string }
  accent?: boolean; className?: string
}

export function StatsCard({ label, value, icon: Icon, trend, accent = false, className }: StatsCardProps) {
  const trendDir = trend ? trend.value > 0 ? 'up' : trend.value < 0 ? 'down' : 'flat' : null
  const TrendIcon = trendDir === 'up' ? TrendingUp : trendDir === 'down' ? TrendingDown : Minus

  return (
    <div
      className={cn('relative flex flex-col gap-3 p-5 rounded-lg overflow-hidden transition-shadow hover:shadow-md', className)}
      style={{
        backgroundColor: accent ? 'hsl(var(--accent))' : 'hsl(var(--surface))',
        border: accent ? 'none' : '1px solid hsl(var(--border))',
        boxShadow: accent ? 'var(--shadow-accent)' : 'var(--shadow-sm)',
        color: accent ? 'white' : 'inherit',
      }}
    >
      {accent && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.15) 0%, transparent 65%)' }} />
      )}

      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-medium tracking-wide uppercase"
          style={{ color: accent ? 'rgba(255,255,255,0.75)' : 'hsl(var(--foreground-muted))' }}>
          {label}
        </p>
        <div className="w-8 h-8 flex items-center justify-center rounded-md shrink-0"
          style={{
            backgroundColor: accent ? 'rgba(255,255,255,0.15)' : 'hsl(var(--accent-muted))',
            color: accent ? 'white' : 'hsl(var(--accent))',
          }}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <p className="text-[28px] font-display font-800 leading-none tracking-tight"
        style={{ color: accent ? 'white' : 'hsl(var(--foreground))' }}>
        {value}
      </p>

      {trend && (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: accent ? 'rgba(255,255,255,0.15)'
                : trendDir === 'up' ? 'hsl(var(--success-bg))'
                : trendDir === 'down' ? 'hsl(var(--error-bg))'
                : 'hsl(var(--background-subtle))',
              color: accent ? 'rgba(255,255,255,0.9)'
                : trendDir === 'up' ? 'hsl(var(--success))'
                : trendDir === 'down' ? 'hsl(var(--error))'
                : 'hsl(var(--foreground-muted))',
            }}>
            <TrendIcon className="w-2.5 h-2.5" />
            {Math.abs(trend.value)}%
          </div>
          {trend.label && (
            <span className="text-[11px]"
              style={{ color: accent ? 'rgba(255,255,255,0.6)' : 'hsl(var(--foreground-subtle))' }}>
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}