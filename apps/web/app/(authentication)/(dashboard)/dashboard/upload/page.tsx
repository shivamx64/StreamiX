"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileVideo,
  Info,
  RefreshCcw,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/class-name";
import { formatBytes } from "@/lib/format";
import { useVideoUpload } from "@/hooks/use-video-upload";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";

const ACCEPTED_VIDEO_TYPES = {
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
};

type UploadPhase = "idle" | "selected" | "uploading" | "finalizing";

export default function VideoUploadPage() {
  const router = useRouter();
  const upload = useVideoUpload();
  const abortRef = useRef<AbortController | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);

  const isBusy = phase === "uploading" || phase === "finalizing";

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const next = acceptedFiles[0];
      if (!next) return;

      setFile(next);
      setPhase("selected");
      setProgress(0);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_VIDEO_TYPES,
    maxFiles: 1,
    noClick: true,
    disabled: isBusy,
  });

  const startUpload = () => {
    if (!file) return;

    const controller = new AbortController();
    abortRef.current = controller;

    setPhase("uploading");
    setProgress(0);

    upload.mutate(
      {
        file,
        signal: controller.signal,
        callbacks: {
          onProgress: (percent) => {
            setProgress(percent);
            if (percent >= 100) setPhase("finalizing");
          },
        },
      },
      {
        onSuccess: (result) => {
          toast.success("Upload complete", {
            description: "Your video is queued for transcoding.",
          });
          router.push(`/dashboard/videos/${result.id}`);
        },
        onError: (error) => {
          if (controller.signal.aborted) {
            toast("Upload cancelled", {
              description: "The file was not uploaded.",
            });
            setPhase("selected");
            setProgress(0);
            return;
          }

          void error;
          toast.error("Upload failed", {
            description: "Something went wrong. Please try again.",
          });
          setPhase("selected");
          setProgress(0);
        },
      },
    );
  };

  const cancelUpload = () => {
    abortRef.current?.abort();
  };

  const resetSelection = () => {
    if (isBusy) return;
    setFile(null);
    setPhase("idle");
    setProgress(0);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <DashboardPageHeader
        title="Upload a video"
        description="We'll process your video into adaptive streaming formats automatically."
      />

      {phase === "idle" ? (
        <div
          {...getRootProps()}
          className={cn(
            "group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-16 text-center transition-all",
            isDragActive
              ? "border-primary bg-accent shadow-lg shadow-primary/10"
              : "hover:border-primary/40 hover:bg-muted/40",
          )}
        >
          <input {...getInputProps()} />

          <motion.div
            animate={isDragActive ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent text-accent-foreground"
          >
            <UploadCloud className="h-6 w-6" />
          </motion.div>

          <p className="mt-5 text-base font-semibold text-foreground">
            {isDragActive
              ? "Drop your video to select it"
              : "Drag and drop your video here"}
          </p>

          <p className="mt-1.5 text-sm text-muted-foreground">
            or{" "}
            <button
              type="button"
              onClick={open}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              browse your files
            </button>
          </p>

          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/80">
            MP4 · WebM · MOV — up to 2 GB
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <FileVideo className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {file?.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatBytes(file?.size ?? 0)}
                <span className="mx-1.5 text-border">·</span>
                {file?.type || "video"}
              </p>

              {phase === "uploading" && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>Uploading…</span>
                    <span className="font-mono tabular-nums">{progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut", duration: 0.25 }}
                    />
                  </div>
                </div>
              )}

              {phase === "finalizing" && (
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-processing">
                  <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                  Upload complete — registering your video…
                </div>
              )}

              {phase === "selected" && (
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Button size="sm" onClick={startUpload}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Start upload
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={resetSelection}
                    className="text-muted-foreground"
                  >
                    Choose another file
                  </Button>
                </div>
              )}
            </div>

            {isBusy ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelUpload}
                aria-label="Cancel upload"
                className="h-8 w-8 shrink-0 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={resetSelection}
                aria-label="Remove selected file"
                className="h-8 w-8 shrink-0 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {upload.isSuccess && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-success/30 bg-success-soft px-4 py-3 text-sm font-medium text-success-soft-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Upload complete. Redirecting to processing status…
            </div>
          )}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/30 px-4 py-3.5 text-xs leading-5 text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          After upload, a background worker transcodes your video into
          1080p, 720p, and 480p HLS renditions plus a thumbnail
          <span className="hidden sm:inline"> — you can watch progress live on the video page</span>.
        </p>
      </div>
    </div>
  );
}
