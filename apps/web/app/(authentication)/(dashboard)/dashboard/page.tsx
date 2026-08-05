"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clapperboard,
  HardDrive,
  Plus,
  UploadCloud,
} from "lucide-react";

import { MetricStrip } from "@/components/dashboard/metric-strip";
import { RecentUploads } from "@/components/dashboard/recent-uploads";
import { StatusBreakdown } from "@/components/dashboard/status-breakdown";
import { VideoLibrary } from "@/components/dashboard/video-library";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBytes } from "@/lib/format";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useVideos } from "@/hooks/use-video-processing";
import type { Video } from "@/types/video-types";

function greetingName(email?: string): string {
  if (!email) return "";
  const local = email.split("@")[0] ?? "";
  const first = local.replace(/[._-].*$/, "");
  if (!first) return "";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function buildStats(videos: Video[]) {
  const completed = videos.filter(
    (video) => video.status === "completed",
  ).length;
  const inProgress = videos.filter(
    (video) =>
      video.status === "processing" || video.status === "queued",
  ).length;
  const storage = videos.reduce((sum, video) => sum + video.size, 0);

  return { completed, inProgress, storage };
}

export default function DashboardHomePage() {
  const { data: user } = useUserProfile();
  const videosQuery = useVideos();

  const videos = videosQuery.data ?? [];
  const isLoading = videosQuery.isLoading;
  const isError = videosQuery.isError;
  const isEmpty = !isLoading && !isError && videos.length === 0;

  const name = greetingName(user?.email);
  const stats = buildStats(videos);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
            Welcome back{name ? `, ${name}` : ""}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your videos today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isEmpty && (
            <Button asChild variant="outline">
              <Link href="/dashboard/videos">
                Go to library
              </Link>
            </Button>
          )}

          <Button asChild>
            <Link href="/dashboard/upload">
              <Plus className="mr-2 h-4 w-4" />
              Upload video
            </Link>
          </Button>
        </div>
      </section>

      {isLoading && (
        <section>
          <Card className="grid grid-cols-1 divide-y divide-border/60 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3 p-5">
                <div className="h-3.5 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded-md bg-muted" />
              </div>
            ))}
          </Card>
        </section>
      )}

      {!isLoading && !isEmpty && !isError && (
        <MetricStrip
          metrics={[
            {
              label: "Total videos",
              value: String(videos.length),
              icon: Clapperboard,
            },
            {
              label: "Completed",
              value: String(stats.completed),
              sublabel:
                stats.completed > 0
                  ? `${Math.round((stats.completed / videos.length) * 100)}% of library`
                  : undefined,
              icon: CheckCircle2,
              tone: "success",
            },
            {
              label: "Processing now",
              value: String(stats.inProgress),
              sublabel:
                stats.inProgress > 0
                  ? "Transcoding in the background"
                  : "Queue is idle",
              icon: UploadCloud,
              tone: "info",
            },
            {
              label: "Storage used",
              value: formatBytes(stats.storage),
              sublabel: `Across ${videos.length} file${videos.length === 1 ? "" : "s"}`,
              icon: HardDrive,
              tone: "warning",
            },
          ]}
        />
      )}

      {!isLoading && !isEmpty && !isError && (
        <section className="grid gap-4 xl:grid-cols-3">
          <StatusBreakdown videos={videos} />
          <div className="xl:col-span-2">
            <RecentUploads videos={videos} />
          </div>
        </section>
      )}

      {isEmpty && <EmptyDashboardHero />}

      {!isLoading && !isEmpty && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
              Video library
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {videos.length} video{videos.length === 1 ? "" : "s"}
            </span>
          </div>

          <VideoLibrary
            videos={videos}
            isLoading={false}
            isError={isError}
          />
        </section>
      )}
    </div>
  );
}

function EmptyDashboardHero() {
  return (
    <Card className="flex flex-col items-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 via-accent to-transparent text-primary ring-1 ring-primary/20">
        <UploadCloud className="h-6 w-6" />
      </div>

      <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground">
        Upload your first video
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Drop in an MP4 and we&apos;ll transcode it into adaptive HLS
        renditions so it plays smoothly at any resolution and
        connection speed.
      </p>

      <ol className="mt-6 flex flex-col gap-2 text-left text-sm text-muted-foreground sm:flex-row sm:gap-6">
        <li className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-accent text-[11px] font-bold text-accent-foreground">
            1
          </span>
          Upload your video
        </li>
        <li className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-accent text-[11px] font-bold text-accent-foreground">
            2
          </span>
          We transcode it
        </li>
        <li className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-accent text-[11px] font-bold text-accent-foreground">
            3
          </span>
          Stream anywhere
        </li>
      </ol>

      <Button
        asChild
        size="lg"
        className="mt-8"
      >
        <Link href="/dashboard/upload">
          <Plus className="mr-2 h-4 w-4" />
          Upload a video
        </Link>
      </Button>
    </Card>
  );
}