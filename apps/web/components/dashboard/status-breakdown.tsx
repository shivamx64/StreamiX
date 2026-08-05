import { Card } from "@/components/ui/card";
import { cn } from "@/lib/class-name";
import {
  statusBarClasses,
  statusLabels,
} from "@/lib/video-status";
import type { Video, VideoStatus } from "@/types/video-types";

const statuses: VideoStatus[] = [
  "completed",
  "processing",
  "queued",
  "uploaded",
  "failed",
];

type StatusBreakdownProps = {
  videos: Video[];
};

export function StatusBreakdown({
  videos,
}: StatusBreakdownProps) {
  const counts = Object.fromEntries(
    statuses.map((status) => [
      status,
      videos.filter((video) => video.status === status).length,
    ]),
  ) as Record<VideoStatus, number>;

  const total = videos.length;
  if (total === 0) return null;

  const visible = statuses.filter((status) => counts[status] > 0);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Processing status
        </h3>
        <span className="font-mono text-xs text-muted-foreground">
          {total} total
        </span>
      </div>

      <div
        className="mt-5 flex h-2 w-full gap-px"
        role="img"
        aria-label={`Status distribution: ${visible
          .map((s) => `${counts[s]} ${statusLabels[s].toLowerCase()}`)
          .join(", ")}`}
      >
        {visible.map((status) => (
          <div
            key={status}
            className={cn(
              "h-full",
              statusBarClasses[status],
            )}
            style={{ width: `${(counts[status] / total) * 100}%` }}
          />
        ))}
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {visible.map((status) => (
          <li
            key={status}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className={cn(
                  "h-2 w-2 shrink-0",
                  statusBarClasses[status],
                )}
              />
              {statusLabels[status]}
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {counts[status]}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}