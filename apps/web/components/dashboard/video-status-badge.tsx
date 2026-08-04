import { cn } from "@/lib/class-name";
import type { VideoStatus } from "@/types/video-types";

const statusStyles: Record<VideoStatus, string> = {
  uploaded: "bg-blue-100 text-blue-700",
  queued: "bg-amber-100 text-amber-700",
  processing: "bg-violet-100 text-violet-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

const statusLabels: Record<VideoStatus, string> = {
  uploaded: "Uploaded",
  queued: "Queued",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

type VideoStatusBadgeProps = {
  status: VideoStatus;
};

export function VideoStatusBadge({
  status,
}: VideoStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}