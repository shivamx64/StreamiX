import Link from "next/link";
import {
  ArrowRight,
  Video as VideoIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatBytes, formatRelativeTime } from "@/lib/format";
import { statusIconClasses } from "@/lib/video-status";
import type { Video } from "@/types/video-types";

import { VideoStatusBadge } from "./video-status-badge";

type RecentUploadsProps = {
  videos: Video[];
};

export function RecentUploads({ videos }: RecentUploadsProps) {
  const recent = [...videos]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Recent uploads
        </h3>

        <Link
          href="/dashboard/videos"
          className="flex items-center gap-1 text-xs font-medium text-primary transition hover:text-primary/80"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ul className="mt-3 divide-y divide-border/60">
        {recent.map((video) => (
          <li key={video.id}>
            <Link
              href={`/dashboard/videos/${video.id}`}
              className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-accent/60"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${statusIconClasses[video.status]}`}
              >
                <VideoIcon className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {video.original_filename}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatBytes(video.size)} ·{" "}
                  {formatRelativeTime(video.created_at)}
                </p>
              </div>

              <VideoStatusBadge status={video.status} />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}