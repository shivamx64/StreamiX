import Link from "next/link";
import { ChevronRight, Plus, Video as VideoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";
import { formatBytes, formatRelativeTime } from "@/lib/format";
import type { Video } from "@/types/video-types";

import { VideoStatusBadge } from "./video-status-badge";

type VideoLibraryProps = {
  videos: Video[];
  isLoading?: boolean;
  isError?: boolean;
};

export function VideoLibrary({
  videos,
  isLoading,
  isError,
}: VideoLibraryProps) {
  if (isLoading) {
    return (
      <Card className="divide-y divide-border/60">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-4">
            <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-1/4 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="px-6 py-16 text-center">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Could not load your videos
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We hit an error fetching your library. Please try again.
        </p>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className="flex flex-col items-center border-dashed px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <VideoIcon className="h-6 w-6" />
        </div>

        <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
          No videos yet
        </h3>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Upload your first video to start processing and streaming.
        </p>

        <Button asChild className="mt-6">
          <Link href="/dashboard/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload a video
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <THead>
          <TR className="border-0 hover:bg-transparent">
            <TH>File</TH>
            <TH>Status</TH>
            <TH className="hidden sm:table-cell">Size</TH>
            <TH className="hidden md:table-cell">Uploaded</TH>
            <TH className="w-10" aria-label="Open" />
          </TR>
        </THead>

        <TBody>
          {videos.map((video) => (
            <TR key={video.id}>
              <TD className="max-w-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <VideoIcon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {video.original_filename}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {video.mime_type}
                    </p>
                  </div>
                </div>
              </TD>

              <TD>
                <VideoStatusBadge status={video.status} />
              </TD>

              <TD className="hidden whitespace-nowrap font-mono text-sm text-muted-foreground sm:table-cell">
                {formatBytes(video.size)}
              </TD>

              <TD className="hidden whitespace-nowrap text-sm text-muted-foreground md:table-cell">
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