'use client'

import { useState } from 'react'
import { Video } from '@/types'
import { VideoStatusBadge } from './video-status-badge'
import { formatDuration, formatRelativeTime } from '@/lib/utils'
import { Play, MoreHorizontal, Trash2, ExternalLink, Copy } from 'lucide-react'

interface VideoCardProps { video: Video; onDelete?: (id: string) => void }

export function VideoCard({ video, onDelete }: VideoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="group relative flex flex-col rounded-lg overflow-hidden transition-shadow hover:shadow-md"
      style={{ backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: 'hsl(20 12% 10%)' }}>
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-8 h-8 opacity-20 text-white" />
          </div>
        )}
        {video.duration && (
          <span className="absolute bottom-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: 'white' }}>
            {formatDuration(video.duration)}
          </span>
        )}
        {video.status === 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'hsl(var(--accent))', boxShadow: 'var(--shadow-accent)' }}>
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[13px] font-medium leading-snug line-clamp-2 flex-1 text-foreground">
            {video.title}
          </h3>
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-6 h-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'hsl(var(--foreground-muted))' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'hsl(var(--surface-hover))')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {menuOpen && <DropdownMenu onClose={() => setMenuOpen(false)} onDelete={() => { onDelete?.(video.id); setMenuOpen(false) }} />}
          </div>
        </div>
        <VideoStatusBadge status={video.status} />
        <p className="text-[11px] mt-0.5" style={{ color: 'hsl(var(--foreground-subtle))' }}>
          {formatRelativeTime(video.createdAt)}
        </p>
      </div>
    </div>
  )
}

function DropdownMenu({ onClose, onDelete }: { onClose: () => void; onDelete: () => void }) {
  const items = [
    { icon: ExternalLink, label: 'Open video', onClick: onClose },
    { icon: Copy,         label: 'Copy link',  onClick: onClose },
    { icon: Trash2,       label: 'Delete',     onClick: onDelete, danger: true },
  ]
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-7 z-20 w-36 rounded-md overflow-hidden py-1"
        style={{ backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-lg)' }}>
        {items.map(({ icon: Icon, label, onClick, danger }) => (
          <button key={label} onClick={onClick}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-left transition-colors"
            style={{ color: danger ? 'hsl(var(--error))' : 'hsl(var(--foreground))' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = danger ? 'hsl(var(--error-bg))' : 'hsl(var(--surface-hover))')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
            <Icon className="w-3.5 h-3.5 shrink-0" />{label}
          </button>
        ))}
      </div>
    </>
  )
}