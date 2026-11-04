import type { VideoStatus } from "@/types/video-types";

export const statusLabels: Record<VideoStatus, string> = {
  uploaded: "Uploaded",
  queued: "Queued",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

export const statusDescriptions: Record<VideoStatus, string> = {
  uploaded: "Stored, waiting to be queued",
  queued: "Waiting for a worker",
  processing: "Transcoding in progress",
  completed: "All renditions ready",
  failed: "Processing failed",
};

export const statusBadgeClasses: Record<VideoStatus, string> = {
  uploaded: "bg-info-soft text-info-soft-foreground",
  queued: "bg-warning-soft text-warning-soft-foreground",
  processing: "bg-processing-soft text-processing-soft-foreground",
  completed: "bg-success-soft text-success-soft-foreground",
  failed: "bg-danger-soft text-danger-soft-foreground",
};

export const statusBarClasses: Record<VideoStatus, string> = {
  uploaded: "bg-info",
  queued: "bg-warning",
  processing: "bg-processing",
  completed: "bg-success",
  failed: "bg-danger",
};

export const statusIconClasses: Record<VideoStatus, string> = {
  uploaded: "bg-info-soft text-info-soft-foreground",
  queued: "bg-warning-soft text-warning-soft-foreground",
  processing: "bg-processing-soft text-processing-soft-foreground",
  completed: "bg-success-soft text-success-soft-foreground",
  failed: "bg-danger-soft text-danger-soft-foreground",
};

export const statusDotClasses: Record<VideoStatus, string> = {
  uploaded: "bg-info",
  queued: "bg-warning",
  processing: "bg-processing",
  completed: "bg-success",
  failed: "bg-danger",
};

// Statuses that represent an active, in-flight pipeline stage.
export const activeStatuses: VideoStatus[] = ["queued", "processing"];
