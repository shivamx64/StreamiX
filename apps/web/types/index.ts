// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

// ─── Video ────────────────────────────────────────────────────────────────────
export type VideoStatus =
  | 'pending'
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'ready'
  | 'failed'

export interface Video {
  id: string
  userId: string
  title: string
  description?: string
  status: VideoStatus
  storageKey: string
  duration?: number
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
  variants?: VideoVariant[]
}

export interface VideoVariant {
  id: string
  videoId: string
  resolution: string
  bitrate: number
  playlistUrl: string
  createdAt: string
}

// ─── Job ──────────────────────────────────────────────────────────────────────
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface Job {
  id: string
  videoId: string
  status: JobStatus
  progress: number
  workerId?: string
  startedAt?: string
  completedAt?: string
  errorMessage?: string
  createdAt: string
}

// ─── Upload ───────────────────────────────────────────────────────────────────
export interface UploadRequest {
  title: string
  description?: string
  filename: string
  contentType: string
  fileSize: number
}

export interface PresignedUploadResponse {
  uploadUrl: string
  videoId: string
  storageKey: string
  expiresIn: number
}

export interface UploadProgress {
  videoId: string
  filename: string
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'ready' | 'failed'
  uploadProgress: number
  jobProgress: number
  errorMessage?: string
}

// API
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
}

// Stats
export interface DashboardStats {
  totalVideos: number
  totalProcessed: number
  totalProcessing: number
  totalFailed: number
  storageUsedBytes: number
  totalDurationSeconds: number
}

// Auth 
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

// ─── Realtime ─────────────────────────────────────────────────────────────────
export interface JobProgressEvent {
  jobId: string
  videoId: string
  progress: number
  status: JobStatus
  message?: string
}

export interface TranscodeCompleteEvent {
  videoId: string
  variants: VideoVariant[]
}