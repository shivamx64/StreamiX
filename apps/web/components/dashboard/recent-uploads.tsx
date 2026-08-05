import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";
import { formatRelativeTime } from "@/lib/format";
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
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
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

      <Table>
        <THead>
          <TR className="border-0 hover:bg-transparent">
            <TH>File</TH>
            <TH>Status</TH>
            <TH className="hidden sm:table-cell">Uploaded</TH>
            <TH className="w-10" aria-label="Open" />
          </TR>
        </THead>

        <TBody>
          {recent.map((video) => (
            <TR key={video.id}>
              <TD className="max-w-0">
                <p className="truncate font-medium text-foreground">
                  {video.original_filename}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {video.mime_type}
                </p>
              </TD>

              <TD>
                <VideoStatusBadge status={video.status} />
              </TD>

              <TD className="hidden whitespace-nowrap text-sm text-muted-foreground sm:table-cell">
                <time
                  dateTime={video.created_at}
                  title={new Date(video.created_at).toLocaleString()}
                >
                  {formatRelativeTime(video.created_at)}
                </time>
              </TD>

              <TD>
                <Link
                  href={`/dashboard/videos/${video.id}`}
                  aria-label={`Open ${video.original_filename}`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  );
}
