"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileVideo, UploadCloud, CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/class-name";
import { formatBytes } from "@/lib/format";
import { useVideoUpload } from "@/hooks/use-video-upload";

const ACCEPTED_VIDEO_TYPES = {
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
};

export default function VideoUploadPage() {
  const router = useRouter();
  const upload = useVideoUpload();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setProgress(0);
      setError(null);

      upload.mutate(
        {
          file,
          callbacks: {
            onProgress: (percent) => setProgress(percent),
          },
        },
        {
          onSuccess: (result) => {
            router.push(`/dashboard/videos/${result.id}`);
          },
          onError: () => {
            setError("Upload failed. Please try again.");
          },
        },
      );
    },
    [upload, router],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_VIDEO_TYPES,
    maxFiles: 1,
    disabled: upload.isPending,
  });

  const selectedFile = upload.variables?.file ?? null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
          Upload a video
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll process your video into adaptive streaming formats
          automatically.
        </p>
      </div>

      <div>
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-muted/30 px-6 py-16 text-center transition",
            isDragActive &&
              "border-primary bg-accent",
            upload.isPending && "pointer-events-none opacity-60",
          )}
        >
          <input {...getInputProps()} />

          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-accent text-accent-foreground">
            {upload.isPending ? (
              <FileVideo className="h-6 w-6" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
          </div>

          <p className="mt-5 text-base font-semibold text-foreground">
            {upload.isPending
              ? `Uploading ${selectedFile?.name}...`
              : "Drag and drop your video here"}
          </p>

          <p className="mt-1.5 text-sm text-muted-foreground">
            {upload.isPending
              ? formatBytes(selectedFile?.size ?? 0)
              : "or click to browse files"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            MP4, WebM, or MOV · up to 2 GB
          </p>
        </div>

        {upload.isPending && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="truncate">{selectedFile?.name}</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-md bg-muted">
              <motion.div
                className="h-full rounded-md bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.25 }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger-soft-foreground">
            <XCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {upload.isSuccess && !error && (
          <div className="mt-6 flex items-center gap-2 rounded-md border border-success/30 bg-success-soft px-4 py-3 text-sm font-medium text-success-soft-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Upload complete. Redirecting to processing status...
          </div>
        )}
      </div>
    </div>
  );
}