import Link from "next/link";
import { Video as VideoIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Video } from "@/types/video-types";

import { VideoStatusBadge } from "./video-status-badge";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, i);

  return `${value.toFixed(1)} ${units[i]}`;
}

function formatRelativeTime(value: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(value).getTime()) / 1000,
  );

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

type VideoCardProps = {
  video: Video;
};

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/dashboard/videos/${video.id}`}>
      <Card className="group p-4 transition hover:border-primary/40 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
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