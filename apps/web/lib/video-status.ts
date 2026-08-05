import type { VideoStatus } from "@/types/video-types";

export const statusLabels: Record<VideoStatus, string> = {
  uploaded: "Uploaded",
  queued: "Queued",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

export const statusBadgeClasses: Record<VideoStatus, string> = {
  uploaded: "bg-info-soft text-info-soft-foreground",
  queued: "bg-warning-soft text-warning-soft-foreground",
  processing: "bg-violet-100 text-violet-700",
  completed: "bg-success-soft text-success-soft-foreground",
  failed: "bg-danger-soft text-danger-soft-foreground",
};

export const statusBarClasses: Record<VideoStatus, string> = {
  uploaded: "bg-info",
  queued: "bg-warning",
  processing: "bg-violet-500",
  completed: "bg-success",
  failed: "bg-danger",
};

export const statusIconClasses: Record<VideoStatus, string> = {
  uploaded: "bg-info-soft text-info-soft-foreground",
  queued: "bg-warning-soft text-warning-soft-foreground",
  processing: "bg-violet-100 text-violet-700",
  completed: "bg-success-soft text-success-soft-foreground",
  failed: "bg-danger-soft text-danger-soft-foreground",
};
