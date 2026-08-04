"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { VideoLibrary } from "@/components/dashboard/video-library";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useVideos } from "@/hooks/use-video-processing";

export default function DashboardHomePage() {
  const { data: user } = useUserProfile();
  const videosQuery = useVideos();

  const videos = videosQuery.data ?? [];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your videos and monitor processing jobs
            {user?.email ? `, ${user.email}` : ""}.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload video
          </Link>
        </Button>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Video library
          </h2>
        </div>

        <VideoLibrary
          videos={videos}
          isLoading={videosQuery.isLoading}
          isError={videosQuery.isError}
        />
      </section>
    </div>
  );
}