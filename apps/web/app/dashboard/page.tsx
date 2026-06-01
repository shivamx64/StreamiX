import { DashboardShell } from '@/components/layout/dashboard-shell'
import { StatsCard } from '@/app/dashboard/stats-card'
import { VideoCard } from '@/components/video/video-card'
import { Video } from '@/types'
import {
  Video as VideoIcon,
  CheckCircle2,
  HardDrive,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

const MOCK_STATS = {
  totalVideos: 24,
  totalProcessed: 19,
  totalProcessing: 3,
  totalFailed: 2,
  storageUsedBytes: 18.4 * 1024 * 1024 * 1024,
  totalDurationSeconds: 14_820,
}

const MOCK_RECENT_VIDEOS: Video[] = [
  { id: '1', userId: 'u1', title: 'Product Demo — Q4 Launch',        status: 'ready',      storageKey: 'raw/v1.mp4', duration: 284,  createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),  updatedAt: new Date().toISOString() },
  { id: '2', userId: 'u1', title: 'Onboarding Flow Walkthrough',      status: 'processing', storageKey: 'raw/v2.mp4', duration: 512,  createdAt: new Date(Date.now() - 30 * 60000).toISOString(),   updatedAt: new Date().toISOString() },
  { id: '3', userId: 'u1', title: 'Backend Architecture Deep Dive',   status: 'queued',     storageKey: 'raw/v3.mp4',                 createdAt: new Date(Date.now() - 10 * 60000).toISOString(),   updatedAt: new Date().toISOString() },
  { id: '4', userId: 'u1', title: 'Go + Redis Streams Tutorial',      status: 'ready',      storageKey: 'raw/v4.mp4', duration: 1845, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', userId: 'u1', title: 'Kubernetes Deployment Guide',      status: 'failed',     storageKey: 'raw/v5.mp4',                 createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', userId: 'u1', title: 'FFmpeg Transcoding Pipeline',      status: 'ready',      storageKey: 'raw/v6.mp4', duration: 923,  createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
]

function formatBytes(bytes: number) {
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}
function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function DashboardPage() {
  const activeJobs = MOCK_RECENT_VIDEOS.filter(
    v => v.status === 'processing' || v.status === 'queued',
  )

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8 animate-fade-in">
        <div>
          <h1 className="text-[22px] font-display font-800 tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: 'hsl(var(--foreground-muted))' }}>
            Your media processing platform overview
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Videos"   value={MOCK_STATS.totalVideos}                          icon={VideoIcon}    trend={{ value: 12, label: 'vs last week' }} accent />
          <StatsCard label="Processed"      value={MOCK_STATS.totalProcessed}                       icon={CheckCircle2} trend={{ value: 8,  label: 'vs last week' }} />
          <StatsCard label="Storage Used"   value={formatBytes(MOCK_STATS.storageUsedBytes)}         icon={HardDrive}    trend={{ value: 5,  label: 'vs last week' }} />
          <StatsCard label="Total Duration" value={formatDuration(MOCK_STATS.totalDurationSeconds)}  icon={Clock}        trend={{ value: 22, label: 'vs last week' }} />
        </div>

        {activeJobs.length > 0 && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg"
            style={{ backgroundColor: 'hsl(var(--processing-bg))', border: '1px solid hsl(217 91% 85%)' }}
          >
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" style={{ color: 'hsl(var(--processing))' }} />
            <p className="text-[13px] font-medium" style={{ color: 'hsl(var(--processing))' }}>
              {activeJobs.length} video{activeJobs.length > 1 ? 's' : ''} currently processing
            </p>
            <Link href="/jobs" className="ml-auto text-[12px] font-medium flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: 'hsl(var(--processing))' }}>
              View jobs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-display font-700 tracking-tight text-foreground">
              Recent Videos
            </h2>
            <Link href="/videos" className="text-[12px] font-medium flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: 'hsl(var(--accent))' }}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_RECENT_VIDEOS.map((video, i) => (
              <div key={video.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  )
}