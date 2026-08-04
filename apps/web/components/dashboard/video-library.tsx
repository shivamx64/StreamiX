import Link from "next/link";
import { Plus, Video as VideoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Video } from "@/types/video-types";

import { VideoCard } from "./video-card";

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-3xl border border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Could not load your videos"
        description="We hit an error fetching your library. Please try again."
      />
    );
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        title="No videos yet"
        description="Upload your first video to start processing and streaming."
        action={
          <Button asChild>
            <Link href="/dashboard/upload">
              <Plus className="mr-2 h-4 w-4" />
              Upload a video
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <VideoIcon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}