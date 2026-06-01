'use client'

import { useState } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { VideoCard } from '@/components/video/video-card'
import { VideoStatusBadge } from '@/components/video/video-status-badge'
import { Video, VideoStatus } from '@/types'
import { formatDuration, formatRelativeTime } from '@/lib/utils'
import { Upload, Search, LayoutGrid, List, Play, Trash2 } from 'lucide-react'
import Link from 'next/link'

const MOCK_VIDEOS: Video[] = [
  { id: '1', userId: 'u1', title: 'Product Demo — Q4 Launch',        status: 'ready',      storageKey: 'raw/v1.mp4', duration: 284,  createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),   updatedAt: new Date().toISOString() },
  { id: '2', userId: 'u1', title: 'Onboarding Flow Walkthrough',      status: 'processing', storageKey: 'raw/v2.mp4', duration: 512,  createdAt: new Date(Date.now() - 30 * 60000).toISOString(),    updatedAt: new Date().toISOString() },
  { id: '3', userId: 'u1', title: 'Backend Architecture Deep Dive',   status: 'queued',     storageKey: 'raw/v3.mp4',                 createdAt: new Date(Date.now() - 10 * 60000).toISOString(),    updatedAt: new Date().toISOString() },
  { id: '4', userId: 'u1', title: 'Go + Redis Streams Tutorial',      status: 'ready',      storageKey: 'raw/v4.mp4', duration: 1845, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),  updatedAt: new Date().toISOString() },
  { id: '5', userId: 'u1', title: 'Kubernetes Deployment Guide',      status: 'failed',     storageKey: 'raw/v5.mp4',                 createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),  updatedAt: new Date().toISOString() },
  { id: '6', userId: 'u1', title: 'FFmpeg Transcoding Pipeline',      status: 'ready',      storageKey: 'raw/v6.mp4', duration: 923,  createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),  updatedAt: new Date().toISOString() },
  { id: '7', userId: 'u1', title: 'HLS Adaptive Streaming Explained', status: 'ready',      storageKey: 'raw/v7.mp4', duration: 634,  createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),  updatedAt: new Date().toISOString() },
  { id: '8', userId: 'u1', title: 'S3 Presigned Upload Architecture', status: 'ready',      storageKey: 'raw/v8.mp4', duration: 421,  createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),  updatedAt: new Date().toISOString() },
  { id: '9', userId: 'u1', title: 'Auth with JWT + Refresh Tokens',   status: 'uploading',  storageKey: 'raw/v9.mp4',                 createdAt: new Date(Date.now() - 5 * 60000).toISOString(),     updatedAt: new Date().toISOString() },
]

const FILTER_OPTIONS: { label: string; value: VideoStatus | 'all' }[] = [
  { label: 'All',        value: 'all' },
  { label: 'Ready',      value: 'ready' },
  { label: 'Processing', value: 'processing' },
  { label: 'Queued',     value: 'queued' },
  { label: 'Failed',     value: 'failed' },
]

export default function VideosPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<VideoStatus | 'all'>('all')
  const [view, setView]     = useState<'grid' | 'list'>('grid')
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS)

  const filtered = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || v.status === filter
    return matchesSearch && matchesFilter
  })

  const handleDelete = (id: string) => setVideos(prev => prev.filter(v => v.id !== id))

  return (
    <DashboardShell navTitle="Videos">
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[22px] font-display font-800 tracking-tight text-foreground">Videos</h1>
            <p className="mt-0.5 text-[13px]" style={{ color: 'hsl(var(--foreground-muted))' }}>
              {videos.length} video{videos.length !== 1 ? 's' : ''} in your library
            </p>
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium text-white transition-all"
            style={{ backgroundColor: 'hsl(var(--accent))', boxShadow: 'var(--shadow-accent)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'hsl(var(--accent-hover))')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'hsl(var(--accent))')}
          >
            <Upload className="w-3.5 h-3.5" /> Upload Video
          </Link>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md flex-1 min-w-[200px]"
            style={{ backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}
          >
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(var(--foreground-muted))' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search videos…"
              className="flex-1 bg-transparent text-[13px] outline-none"
              style={{ color: 'hsl(var(--foreground))' }}
            />
          </div>

          <div
            className="flex items-center gap-1 p-1 rounded-md"
            style={{ backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}
          >
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className="px-2.5 py-1 rounded text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: filter === opt.value ? 'hsl(var(--accent))' : 'transparent',
                  color: filter === opt.value ? 'white' : 'hsl(var(--foreground-muted))',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div
            className="flex items-center gap-1 p-1 rounded-md"
            style={{ backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}
          >
            {([['grid', LayoutGrid], ['list', List]] as const).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="w-7 h-7 flex items-center justify-center rounded transition-all"
                style={{
                  backgroundColor: view === v ? 'hsl(var(--accent))' : 'transparent',
                  color: view === v ? 'white' : 'hsl(var(--foreground-muted))',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState hasSearch={!!search} />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((video, i) => (
              <div key={video.id} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                <VideoCard video={video} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((video, i) => (
              <VideoListRow
                key={video.id}
                video={video}
                onDelete={handleDelete}
                style={{ animationDelay: `${i * 30}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

function VideoListRow({ video, onDelete, style }: { video: Video; onDelete: (id: string) => void; style?: React.CSSProperties }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg group animate-slide-up transition-shadow hover:shadow-sm"
      style={{ ...style, backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}
    >
      <div
        className="w-16 aspect-video rounded flex items-center justify-center shrink-0 overflow-hidden"
        style={{ backgroundColor: 'hsl(20 12% 10%)' }}
      >
        <Play className="w-4 h-4 opacity-30 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate text-foreground">{video.title}</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'hsl(var(--foreground-subtle))' }}>
          {formatRelativeTime(video.createdAt)}
          {video.duration ? ` · ${formatDuration(video.duration)}` : ''}
        </p>
      </div>
      <VideoStatusBadge status={video.status} />
      <button
        onClick={() => onDelete(video.id)}
        className="w-7 h-7 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-all"
        style={{ color: 'hsl(var(--foreground-muted))' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(var(--error-bg))'; e.currentTarget.style.color = 'hsl(var(--error))' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'hsl(var(--foreground-muted))' }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--accent-muted))' }}>
        <Upload className="w-5 h-5" style={{ color: 'hsl(var(--accent))' }} />
      </div>
      <p className="text-[14px] font-display font-700 text-foreground">
        {hasSearch ? 'No videos found' : 'No videos yet'}
      </p>
      <p className="text-[13px]" style={{ color: 'hsl(var(--foreground-muted))' }}>
        {hasSearch ? 'Try a different search term or clear your filter' : 'Upload your first video to get started'}
      </p>
      {!hasSearch && (
        <Link href="/upload" className="mt-2 px-4 py-2 rounded-md text-[13px] font-medium text-white" style={{ backgroundColor: 'hsl(var(--accent))', boxShadow: 'var(--shadow-accent)' }}>
          Upload Video
        </Link>
      )}
    </div>
  )
}