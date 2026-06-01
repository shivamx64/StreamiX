'use client'

import { useState, useCallback } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { UploadDropzone, UploadQueueItem } from '@/components/upload/upload-dropzone'
import { UploadProgress } from '@/types'
import { Info } from 'lucide-react'

export default function UploadPage() {
  const [queue, setQueue]     = useState<UploadProgress[]>([])
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [titleError, setTitleError] = useState('')

  const handleFilesAccepted = useCallback((files: File[]) => {
    setQueue(prev => [
      ...prev,
      ...files.map(file => ({
        videoId: `tmp-${Math.random().toString(36).slice(2)}`,
        filename: file.name,
        file,
        status: 'pending' as const,
        uploadProgress: 0,
        jobProgress: 0,
      })),
    ])
  }, [])

  const handleRemove = (videoId: string) => {
    setQueue(prev => prev.filter(item => item.videoId !== videoId))
  }

  const handleSubmit = () => {
    if (!formData.title.trim()) { setTitleError('Title is required'); return }
    if (queue.length === 0) return
    setTitleError('')
    // TODO: call upload service
    console.log('Submit upload', formData, queue)
  }

  const canSubmit =
    queue.length > 0 &&
    queue.every(item => item.status === 'pending') &&
    formData.title.trim().length > 0

  return (
    <DashboardShell navTitle="Upload">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-[22px] font-display font-800 tracking-tight text-foreground">
            Upload Video
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: 'hsl(var(--foreground-muted))' }}>
            Upload your video and it will be transcoded to HLS for adaptive streaming.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <UploadDropzone onFilesAccepted={handleFilesAccepted} />

          {queue.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-medium" style={{ color: 'hsl(var(--foreground-muted))' }}>
                {queue.length} file{queue.length > 1 ? 's' : ''} selected
              </p>
              {queue.map(item => (
                <UploadQueueItem key={item.videoId} item={item} onRemove={handleRemove} />
              ))}
            </div>
          )}

          {queue.length > 0 && (
            <div
              className="flex flex-col gap-4 p-5 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}
            >
              <h2 className="text-[14px] font-display font-700 tracking-tight text-foreground">
                Video Details
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-foreground">
                  Title <span style={{ color: 'hsl(var(--accent))' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => { setFormData(p => ({ ...p, title: e.target.value })); if (titleError) setTitleError('') }}
                  placeholder="Enter a title for your video"
                  className="w-full px-3 py-2 rounded-md text-[13px] outline-none transition-all"
                  style={{
                    backgroundColor: 'hsl(var(--background))',
                    border: `1px solid ${titleError ? 'hsl(var(--error))' : 'hsl(var(--border))'}`,
                    color: 'hsl(var(--foreground))',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = titleError ? 'hsl(var(--error))' : 'hsl(var(--accent))')}
                  onBlur={e => (e.currentTarget.style.borderColor = titleError ? 'hsl(var(--error))' : 'hsl(var(--border))')}
                />
                {titleError && <p className="text-[11px]" style={{ color: 'hsl(var(--error))' }}>{titleError}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-foreground">
                  Description{' '}
                  <span className="font-normal" style={{ color: 'hsl(var(--foreground-subtle))' }}>(optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Add a description…"
                  rows={3}
                  className="w-full px-3 py-2 rounded-md text-[13px] outline-none transition-all resize-none"
                  style={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'hsl(var(--accent))')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'hsl(var(--border))')}
                />
              </div>
            </div>
          )}

          <div
            className="flex gap-3 p-4 rounded-lg"
            style={{ backgroundColor: 'hsl(var(--accent-muted))', border: '1px solid hsl(var(--accent-border))' }}
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'hsl(var(--accent))' }} />
            <div>
              <p className="text-[12px] font-medium" style={{ color: 'hsl(var(--accent))' }}>How it works</p>
              <p className="mt-0.5 text-[12px]" style={{ color: 'hsl(var(--foreground-muted))' }}>
                Your file uploads directly to S3 via a presigned URL. Once uploaded, a worker picks up
                the job from Redis Streams, transcodes it with FFmpeg into HLS segments at multiple
                resolutions, and stores the output back to S3.
              </p>
            </div>
          </div>

          {queue.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-2.5 rounded-md text-[14px] font-display font-700 tracking-tight text-white transition-all"
              style={{
                backgroundColor: canSubmit ? 'hsl(var(--accent))' : 'hsl(var(--border))',
                color: canSubmit ? 'white' : 'hsl(var(--foreground-subtle))',
                boxShadow: canSubmit ? 'var(--shadow-accent)' : 'none',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => { if (canSubmit) e.currentTarget.style.backgroundColor = 'hsl(var(--accent-hover))' }}
              onMouseLeave={e => { if (canSubmit) e.currentTarget.style.backgroundColor = 'hsl(var(--accent))' }}
            >
              Start Upload
            </button>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}