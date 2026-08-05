import Link from "next/link";
import { Video as VideoIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatBytes, formatRelativeTime } from "@/lib/format";
import { statusIconClasses } from "@/lib/video-status";
import type { Video } from "@/types/video-types";

import { VideoStatusBadge } from "./video-status-badge";

type VideoCardProps = {
  video: Video;
};

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/dashboard/videos/${video.id}`}>
      <Card className="group p-4 transition hover:border-primary/40 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${statusIconClasses[video.status]}`}
            >
              <VideoIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {video.original_filename}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {video.mime_type} · {formatBytes(video.size)} ·{" "}
                {formatRelativeTime(video.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <VideoStatusBadge status={video.status} />
        </div>
      </Card>
    </Link>
  );
}