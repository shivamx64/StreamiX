"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { VideoLibrary } from "@/components/dashboard/video-library";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { useVideos } from "@/hooks/use-video-processing";

export default function VideoLibraryPage() {
  const videosQuery = useVideos();
  const videos = videosQuery.data ?? [];

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Video library"
        description="All videos you've uploaded, with their processing status."
      >
        <Button asChild>
          <Link href="/dashboard/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload video
          </Link>
        </Button>
      </DashboardPageHeader>

      <VideoLibrary
        videos={videos}
        isLoading={videosQuery.isLoading}
        isError={videosQuery.isError}
      />
    </div>
  );
}