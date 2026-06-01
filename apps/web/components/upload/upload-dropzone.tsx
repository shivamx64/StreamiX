'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, X, CheckCircle2, AlertCircle, Film, Loader2 } from 'lucide-react'
import { cn, formatBytes, isValidVideoFile, ACCEPTED_VIDEO_TYPES } from '@/lib/utils'
import { UploadProgress } from '@/types'

interface UploadDropzoneProps { onFilesAccepted: (files: File[]) => void }

export function UploadDropzone({ onFilesAccepted }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const inputRef                    = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    const accepted: File[] = []
    const errors: string[] = []
    Array.from(files).forEach(file => {
      const { ok, error } = isValidVideoFile(file)
      if (ok) accepted.push(file)
      else errors.push(`${file.name}: ${error}`)
    })
    if (errors.length > 0) { setError(errors[0]); return }
    if (accepted.length > 0) onFilesAccepted(accepted)
  }, [onFilesAccepted])

  const onDrop      = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }, [handleFiles])
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = (e: React.DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false) }

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
        className={cn('relative flex flex-col items-center justify-center gap-4 py-14 px-8 rounded-xl border-2 border-dashed cursor-pointer transition-all')}
        style={{
          borderColor: isDragging ? 'hsl(var(--accent))' : 'hsl(var(--border))',
          backgroundColor: isDragging ? 'hsl(var(--accent-muted))' : 'hsl(var(--surface))',
          boxShadow: isDragging ? 'var(--shadow-accent)' : 'none',
        }}
      >
        {isDragging && (
          <div className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, hsl(24 95% 53% / 0.08) 0%, transparent 70%)' }} />
        )}
        <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform"
          style={{
            backgroundColor: isDragging ? 'hsl(var(--accent))' : 'hsl(var(--accent-muted))',
            transform: isDragging ? 'scale(1.05)' : 'scale(1)',
            boxShadow: isDragging ? 'var(--shadow-accent)' : 'none',
          }}>
          <Upload className="w-6 h-6 transition-colors" style={{ color: isDragging ? 'white' : 'hsl(var(--accent))' }} />
        </div>
        <div className="text-center">
          <p className="text-[15px] font-display font-700 tracking-tight text-foreground">
            {isDragging ? 'Drop to upload' : 'Drag & drop your video'}
          </p>
          <p className="mt-1 text-[13px]" style={{ color: 'hsl(var(--foreground-muted))' }}>
            or <span className="font-medium" style={{ color: 'hsl(var(--accent))' }}>browse files</span> from your computer
          </p>
        </div>
        <p className="text-[11px]" style={{ color: 'hsl(var(--foreground-subtle))' }}>
          MP4, MOV, AVI, WebM, MKV — up to 5 GB
        </p>
        <input ref={inputRef} type="file" accept={ACCEPTED_VIDEO_TYPES.join(',')} multiple className="hidden"
          onChange={e => handleFiles(e.target.files)} />
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-md text-[12px]"
          style={{ backgroundColor: 'hsl(var(--error-bg))', color: 'hsl(var(--error))' }}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
        </div>
      )}
    </div>
  )
}

interface UploadQueueItemProps { item: UploadProgress; onRemove: (videoId: string) => void }

export function UploadQueueItem({ item, onRemove }: UploadQueueItemProps) {
  const isActive  = item.status === 'uploading' || item.status === 'processing'
  const isDone    = item.status === 'ready'
  const isFailed  = item.status === 'failed'
  const progressPercent =
    item.status === 'uploading'   ? item.uploadProgress :
    item.status === 'processing'  ? item.jobProgress :
    isDone ? 100 : 0

  const statusLabel =
    item.status === 'pending'     ? 'Waiting…' :
    item.status === 'uploading'   ? `Uploading — ${item.uploadProgress}%` :
    item.status === 'processing'  ? `Transcoding — ${item.jobProgress}%` :
    item.status === 'ready'       ? 'Complete' :
    item.errorMessage ?? 'Failed'

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg"
      style={{ backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}>
      <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: isDone ? 'hsl(var(--success-bg))' : isFailed ? 'hsl(var(--error-bg))' : 'hsl(var(--accent-muted))' }}>
        {isDone   ? <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(var(--success))' }} /> :
         isFailed ? <AlertCircle  className="w-4 h-4" style={{ color: 'hsl(var(--error))' }} /> :
         isActive  ? <Loader2    className="w-4 h-4 animate-spin" style={{ color: 'hsl(var(--accent))' }} /> :
                    <Film        className="w-4 h-4" style={{ color: 'hsl(var(--accent))' }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-[12px] font-medium truncate text-foreground">{item.filename}</p>
          <p className="text-[11px] shrink-0"
            style={{ color: isDone ? 'hsl(var(--success))' : isFailed ? 'hsl(var(--error))' : 'hsl(var(--foreground-muted))' }}>
            {statusLabel}
          </p>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'hsl(var(--background-subtle))' }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: isFailed ? 'hsl(var(--error))' : isDone ? 'hsl(var(--success))' : 'hsl(var(--accent))',
            }} />
        </div>
      </div>
      {!isActive && (
        <button onClick={() => onRemove(item.videoId)}
          className="w-6 h-6 flex items-center justify-center rounded shrink-0 transition-colors"
          style={{ color: 'hsl(var(--foreground-subtle))' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'hsl(var(--surface-hover))')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}