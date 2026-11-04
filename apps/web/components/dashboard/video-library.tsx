"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  FileVideo,
  Plus,
  Search,
  SearchX,
  Video as VideoIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table";
import { cn } from "@/lib/class-name";
import { formatBytes, formatRelativeTime } from "@/lib/format";
import {
  statusIconClasses,
  statusLabels,
} from "@/lib/video-status";
import type { Video, VideoStatus } from "@/types/video-types";

import { VideoStatusBadge } from "./video-status-badge";

type VideoLibraryProps = {
  videos: Video[];
  isLoading?: boolean;
  isError?: boolean;
};

const filterOrder: VideoStatus[] = [
  "completed",
  "processing",
  "queued",
  "uploaded",
  "failed",
];

export function VideoLibrary({
  videos,
  isLoading,
  isError,
}: VideoLibraryProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VideoStatus | "all">("all");

  const counts = useMemo(() => {
    const result = Object.fromEntries(
      filterOrder.map((status) => [status, 0]),
    ) as Record<VideoStatus, number>;

    for (const video of videos) {
      result[video.status] += 1;
    }

    return result;
  }, [videos]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return videos.filter((video) => {
      const matchesStatus =
        statusFilter === "all" || video.status === statusFilter;

      if (!matchesStatus) return false;
      if (!normalizedQuery) return true;

      return (
        video.original_filename.toLowerCase().includes(normalizedQuery) ||
        video.mime_type.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [videos, query, statusFilter]);

  if (isLoading) {
    return (
      <Card className="divide-y divide-border/60">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="h-9 w-9 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="hidden h-4 w-16 sm:block" />
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
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by file name or type"
            aria-label="Search videos"
            className="h-9 pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip
            label="All"
            count={videos.length}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />

          {filterOrder
            .filter((status) => counts[status] > 0)
            .map((status) => (
              <FilterChip
                key={status}
                label={statusLabels[status]}
                count={counts[status]}
                active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              />
            ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center border-dashed px-6 py-14 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <SearchX className="h-5 w-5" />
          </div>

          <h3 className="mt-4 font-display text-base font-semibold text-foreground">
            No matching videos
          </h3>

          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Try a different search term or clear the active status filter.
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-5"
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
            }}
          >
            Clear filters
          </Button>
        </Card>
      ) : (
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
              {filtered.map((video) => (
                <TR key={video.id} className="group">
                  <TD className="max-w-0">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                          statusIconClasses[video.status],
                        )}
                      >
                        <FileVideo className="h-4 w-4" />
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

                  <TD className="hidden whitespace-nowrap font-mono text-sm tabular-nums text-muted-foreground sm:table-cell">
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
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

type FilterChipProps = {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
};

function FilterChip({ label, count, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
      )}
    >
      {label}
      <span className="font-mono text-[10px] tabular-nums opacity-70">
        {count}
      </span>
    </button>
  );
}


