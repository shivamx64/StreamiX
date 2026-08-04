import {
  CheckCircle2,
  Clock,
  Cpu,
  Loader2,
  UploadCloud,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/class-name";
import type { VideoStatus } from "@/types/video-types";

type PipelineStepKey = "uploaded" | "queued" | "processing" | "completed";

const pipelineSteps: Array<{
  key: PipelineStepKey;
  label: string;
}> = [
  { key: "uploaded", label: "Uploaded" },
  { key: "queued", label: "Queued" },
  { key: "processing", label: "Processing" },
  { key: "completed", label: "Completed" },
];

function stepState(
  status: VideoStatus,
  stepKey: VideoStatus,
): "done" | "active" | "pending" | "failed" {
  if (status === "failed") {
    return stepKey === "uploaded" ? "done" : "failed";
  }

  const order = ["uploaded", "queued", "processing", "completed"];
  const statusIndex = order.indexOf(status);
  const stepIndex = order.indexOf(stepKey);

  if (stepIndex < statusIndex) return "done";
  if (stepIndex === statusIndex) return "active";
  return "pending";
}

const stepIcon = {
  done: CheckCircle2,
  active: Loader2,
  pending: Clock,
  failed: XCircle,
};

type ProcessingStatusTrackerProps = {
  status: VideoStatus;
};

export function ProcessingStatusTracker({
  status,
}: ProcessingStatusTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {status === "failed" ? (
          <XCircle className="h-5 w-5 text-red-600" />
        ) : status === "completed" ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
        <span className="text-sm font-semibold text-foreground">
          {status === "failed"
            ? "Processing failed"
            : status === "completed"
              ? "Ready to stream"
              : "Processing your video"}
        </span>
      </div>

      <ol className="space-y-0">
        {pipelineSteps.map((step) => {
          const state = stepState(status, step.key);
          const Icon = stepIcon[state];

          return (
            <li key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border",
                    state === "done" &&
                      "border-green-200 bg-green-50 text-green-600",
                    state === "active" &&
                      "border-primary/30 bg-accent text-primary",
                    state === "pending" &&
                      "border-border bg-muted text-muted-foreground",
                    state === "failed" &&
                      "border-red-200 bg-red-50 text-red-600",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      state === "active" && "animate-spin",
                    )}
                  />
                </div>

                {step.key !== "completed" && (
                  <div
                    className={cn(
                      "h-8 w-px",
                      state === "done"
                        ? "bg-green-200"
                        : "bg-border",
                    )}
                  />
                )}
              </div>

              <div className="pb-4">
                <p className="pt-1.5 text-sm font-medium text-foreground">
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stepDescription(step.key, state)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
        <Cpu className="h-4 w-4 shrink-0" />
        <UploadCloud className="h-4 w-4 shrink-0" />
        Status refreshes automatically while processing.
      </div>
    </div>
  );
}

function stepDescription(
  stepKey: PipelineStepKey,
  state: "done" | "active" | "pending" | "failed",
): string {
  if (state === "done") return "Complete";
  if (state === "pending") return "Waiting";
  if (state === "failed") return "Failed";

  const activeDescriptions: Record<PipelineStepKey, string> = {
    uploaded: "Source video stored",
    queued: "Waiting for a worker",
    processing: "Transcoding in progress",
    completed: "All renditions ready",
  };

  return activeDescriptions[stepKey];
}