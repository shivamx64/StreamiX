import { VideoStatus } from '@/types'
import { cn } from '@/lib/utils'

interface VideoStatusBadgeProps { status: VideoStatus; className?: string }

const STATUS_CONFIG: Record<VideoStatus, { label: string; bg: string; color: string; dot?: string }> = {
  pending:    { label: 'Pending',    bg: 'hsl(var(--background-subtle))', color: 'hsl(var(--foreground-muted))' },
  uploading:  { label: 'Uploading',  bg: 'hsl(var(--processing-bg))',     color: 'hsl(var(--processing))',      dot: 'animate-pulse' },
  queued:     { label: 'Queued',     bg: 'hsl(var(--warning-bg))',         color: 'hsl(var(--warning))' },
  processing: { label: 'Processing', bg: 'hsl(var(--processing-bg))',     color: 'hsl(var(--processing))',      dot: 'animate-pulse' },
  ready:      { label: 'Ready',      bg: 'hsl(var(--success-bg))',         color: 'hsl(var(--success))' },
  failed:     { label: 'Failed',     bg: 'hsl(var(--error-bg))',           color: 'hsl(var(--error))' },
}

export function VideoStatusBadge({ status, className }: VideoStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium', className)}
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  )
}