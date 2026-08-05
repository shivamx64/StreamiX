"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { VideoLibrary } from "@/components/dashboard/video-library";
import { Button } from "@/components/ui/button";
import { useVideos } from "@/hooks/use-video-processing";

export default function VideoLibraryPage() {
  const videosQuery = useVideos();
  const videos = videosQuery.data ?? [];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
            Video library
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All videos you&apos;ve uploaded, with their processing status.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload video
          </Link>
        </Button>
      </section>

      <VideoLibrary
        videos={videos}
        isLoading={videosQuery.isLoading}
        isError={videosQuery.isError}
      />
    </div>
  );
}