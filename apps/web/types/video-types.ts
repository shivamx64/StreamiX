export type VideoStatus =
  | "uploaded"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type VideoRendition = {
  name: string;
  height: number;
  video_bitrate_kb: number;
  audio_bitrate_kb: number;
};

export type Video = {
  id: string;
  user_id: string;
  original_filename: string;
  storage_key: string;
  mime_type: string;
  size: number;
  status: VideoStatus;
  duration_seconds: number;
  width: number;
  height: number;
  hls_master_key: string;
  thumbnail_key: string;
  renditions: VideoRendition[];
  processing_error: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type VideoStatusResponse = {
  id: string;
  status: VideoStatus;
};

export type VideoUploadResponse = {
  id: string;
  status: VideoStatus;
};

export type VideoPlaybackSession = {
  token: string;
  expires_at: string;
  hls_url: string;
  thumbnail_url: string;
};
