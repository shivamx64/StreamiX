import { Badge } from "@/components/ui/badge";
import { statusLabels } from "@/lib/video-status";
import type { VideoStatus } from "@/types/video-types";

import { cn } from "@/lib/class-name";

type VideoStatusBadgeProps = {
  status: VideoStatus;
  className?: string;
};

const toneByStatus = {
  uploaded: "info",
  queued: "warning",
  processing: "processing",
  completed: "success",
  failed: "danger",
} as const;

export function VideoStatusBadge({
  status,
  className,
}: VideoStatusBadgeProps) {
  return (
    <Badge
      tone={toneByStatus[status]}
      dot
      pulse={status === "processing"}
      className={cn(className)}
    >
      {statusLabels[status]}
    </Badge>
  );
}
