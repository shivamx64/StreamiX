"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Clock,
  Loader2,
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
  stepKey: PipelineStepKey,
): "done" | "active" | "pending" | "failed" {
  if (status === "failed") {
    return stepKey === "uploaded" ? "done" : "failed";
  }

  const order: PipelineStepKey[] = [
    "uploaded",
    "queued",
    "processing",
    "completed",
  ];
  const statusIndex = order.indexOf(status as PipelineStepKey);
  const stepIndex = order.indexOf(stepKey);

  if (stepIndex < statusIndex) return "done";
  if (stepIndex === statusIndex) return "active";
  return "pending";
}

type ProcessingStatusTrackerProps = {
  status: VideoStatus;
};

export function ProcessingStatusTracker({
  status,
}: ProcessingStatusTrackerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        {status === "failed" ? (
          <XCircle className="h-5 w-5 text-danger" />
        ) : status === "completed" ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin text-processing" />
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
        {pipelineSteps.map((step, index) => {
          const state = stepState(status, step.key);
          const isLast = index === pipelineSteps.length - 1;

          return (
            <li key={step.key} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <StepIcon state={state} />

                {!isLast && (
                  <div className="relative my-1 h-6 w-px overflow-hidden bg-border">
                    {state === "done" && (
                      <motion.div
                        className="absolute inset-x-0 top-0 bg-success/60"
                        initial={reduceMotion ? { height: "100%" } : { height: 0 }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.08 }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className={cn("pb-5", isLast && "pb-0")}>
                <p
                  className={cn(
                    "pt-1.5 text-sm font-medium",
                    state === "pending"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stepDescription(step.key, state)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

type StepIconState = "done" | "active" | "pending" | "failed";

function StepIcon({ state }: { state: StepIconState }) {
  const base =
    "flex h-8 w-8 items-center justify-center rounded-full border transition-colors";

  if (state === "done") {
    return (
      <div className={cn(base, "border-success/30 bg-success-soft text-success-soft-foreground")}>
        <Check className="h-4 w-4" strokeWidth={3} />
      </div>
    );
  }

  if (state === "active") {
    return (
      <div className={cn(base, "border-processing/30 bg-processing-soft text-processing-soft-foreground")}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div className={cn(base, "border-danger/30 bg-danger-soft text-danger-soft-foreground")}>
        <XCircle className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className={cn(base, "border-border bg-muted/60 text-muted-foreground")}>
      <Clock className="h-4 w-4" />
    </div>
  );
}

function stepDescription(
  stepKey: PipelineStepKey,
  state: StepIconState,
): string {
  if (state === "done") return "Complete";
  if (state === "pending") return "Waiting";
  if (state === "failed") return "Failed before completion";

  const activeDescriptions: Record<PipelineStepKey, string> = {
    uploaded: "Source video stored",
    queued: "Waiting for a worker",
    processing: "Transcoding in progress",
    completed: "All renditions ready",
  };

  return activeDescriptions[stepKey];
}
