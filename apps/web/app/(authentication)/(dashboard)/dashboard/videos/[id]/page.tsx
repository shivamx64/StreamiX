"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  FileVideo,
  Play,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { ProcessingStatusTracker } from "@/components/dashboard/processing-status-tracker";
import { VideoPlayer } from "@/components/dashboard/video-player";
import { VideoStatusBadge } from "@/components/dashboard/video-status-badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes, formatDateTime } from "@/lib/format";
import {
  useDeleteVideo,
  useVideoDetails,
  useVideoStatus,
} from "@/hooks/use-video-processing";

export default function VideoDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const videoQuery = useVideoDetails(id);
  const statusQuery = useVideoStatus(id);
  const deleteVideo = useDeleteVideo();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const video = videoQuery.data;
  const status = statusQuery.data?.status ?? video?.status;
  const refetchVideo = videoQuery.refetch;

  // Keep the detail view in sync while the pipeline runs.
  useEffect(() => {
    if (status === "completed" || status === "failed") {
      void refetchVideo();
    }
  }, [status, refetchVideo]);

  const onDelete = () => {
    deleteVideo.mutate(id, {
      onSuccess: () => {
        toast.success("Video deleted", {
          description: "The video and its stored file were removed.",
        });
        router.replace("/dashboard/videos");
      },
      onError: () => {
        toast.error("Could not delete video", {
          description: "Please try again in a moment.",
        });
        setConfirmOpen(false);
      },
    });
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      toast.success("Video ID copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — ignore.
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/dashboard/videos"
        className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to library
      </Link>

      {videoQuery.isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-16 w-2/3" />
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      )}

      {videoQuery.isError && (
        <Card className="p-10 text-center">
          <p className="text-sm font-medium text-foreground">
            Could not load this video.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            It may have been removed.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-5">
            <Link href="/dashboard/videos">Back to library</Link>
          </Button>
        </Card>
      )}

      {video && status && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FileVideo className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <h1 className="font-display truncate text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                  {video.original_filename}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span>{video.mime_type}</span>
                  <span className="text-border">·</span>
                  <span className="font-mono tabular-nums">
                    {formatBytes(video.size)}
                  </span>
                  <span className="text-border">·</span>
                  <VideoStatusBadge status={status} />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0 text-danger-soft-foreground hover:border-danger/40 hover:bg-danger-soft hover:text-danger"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6">
              <Card className="overflow-hidden">
                {status === "completed" ? (
                  <VideoPlayer key={video.id} video={video} />
                ) : (
                  <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-muted via-accent/60 to-muted">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"
                    />

                    <div className="relative flex flex-col items-center gap-3 text-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground shadow-sm backdrop-blur-sm">
                        <Play className="ml-0.5 h-6 w-6" />
                      </span>
                      <p className="px-6 text-xs font-medium text-muted-foreground">
                        {status === "failed"
                          ? "This video could not be processed."
                          : "Preview available once processing completes"}
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="mb-5 text-sm font-semibold text-foreground">
                  Processing pipeline
                </h2>
                <ProcessingStatusTracker status={status} />
              </Card>
            </div>

            <Card className="h-fit p-6">
              <h2 className="text-sm font-semibold text-foreground">
                Details
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <DetailRow label="Status">
                  <VideoStatusBadge status={status} />
                </DetailRow>

                <DetailRow label="Uploaded">
                  <span className="text-foreground">
                    {formatDateTime(video.created_at)}
                  </span>
                </DetailRow>

                <DetailRow label="Last update">
                  <span className="text-foreground">
                    {formatDateTime(video.updated_at)}
                  </span>
                </DetailRow>

                <DetailRow label="Size">
                  <span className="font-mono tabular-nums text-foreground">
                    {formatBytes(video.size)}
                  </span>
                </DetailRow>

                <DetailRow label="Type">
                  <span className="font-mono text-xs text-foreground">
                    {video.mime_type}
                  </span>
                </DetailRow>

                <DetailRow label="Video ID">
                  <button
                    type="button"
                    onClick={copyId}
                    className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition hover:text-foreground"
                    aria-label="Copy video ID"
                  >
                    <span className="max-w-[11rem] truncate">{video.id}</span>
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    )}
                  </button>
                </DetailRow>
              </dl>

              <div className="mt-6 border-t border-border/60 pt-5">
                <p className="text-xs leading-5 text-muted-foreground">
                  Adaptive HLS renditions and a thumbnail are written to
                  storage when processing finishes.
                </p>
              </div>
            </Card>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this video?"
        description={
          <>
            <span className="font-medium text-foreground">
              {video?.original_filename}
            </span>{" "}
            and its stored source file will be permanently removed. This
            action cannot be undone.
          </>
        }
        confirmLabel="Delete video"
        tone="danger"
        loading={deleteVideo.isPending}
        onConfirm={onDelete}
      />
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  );
}
