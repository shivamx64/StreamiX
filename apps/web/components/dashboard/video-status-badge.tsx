import { cn } from "@/lib/class-name";
import { statusBadgeClasses, statusLabels } from "@/lib/video-status";
import type { VideoStatus } from "@/types/video-types";

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
        statusBadgeClasses[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
