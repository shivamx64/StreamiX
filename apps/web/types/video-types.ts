export type VideoStatus =
  | "uploaded"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type Video = {
  id: string;
  user_id: string;
  original_filename: string;
  storage_key: string;
  mime_type: string;
  size: number;
  status: VideoStatus;
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
