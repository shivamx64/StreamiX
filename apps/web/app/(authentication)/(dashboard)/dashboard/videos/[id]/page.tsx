"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileVideo, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProcessingStatusTracker } from "@/components/dashboard/processing-status-tracker";
import { VideoStatusBadge } from "@/components/dashboard/video-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useDeleteVideo,
  useVideoDetails,
} from "@/hooks/use-video-processing";

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

export default function VideoDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const videoQuery = useVideoDetails(id);
  const deleteVideo = useDeleteVideo();

  const video = videoQuery.data;

  const onDelete = () => {
    deleteVideo.mutate(id, {
      onSuccess: () => router.replace("/dashboard/videos"),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/videos"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to library
      </Link>

      {videoQuery.isLoading && (
        <div className="h-64 animate-pulse rounded-3xl border border-border bg-muted" />
      )}

      {videoQuery.isError && (
        <Card className="p-10 text-center">
          <p className="text-sm font-medium text-foreground">
            Could not load this video.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            It may have been removed.
          </p>
        </Card>
      )}

      {video && (
        <>
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <FileVideo className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                    {video.original_filename}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {video.mime_type} · {formatBytes(video.size)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <VideoStatusBadge status={video.status} />
            </div>
          </div>

          <Card className="p-6">
            <h2 className="mb-5 text-lg font-semibold text-foreground">
              Processing status
            </h2>
            <ProcessingStatusTracker status={video.status} />
          </Card>

          <div className="flex justify-end">
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={onDelete}
              disabled={deleteVideo.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteVideo.isPending ? "Deleting..." : "Delete video"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}