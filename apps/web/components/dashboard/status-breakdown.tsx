"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/class-name";
import {
  statusBarClasses,
  statusLabels,
} from "@/lib/video-status";
import type { Video, VideoStatus } from "@/types/video-types";

const statuses: VideoStatus[] = [
  "completed",
  "processing",
  "queued",
  "uploaded",
  "failed",
];

type StatusBreakdownProps = {
  videos: Video[];
};

export function StatusBreakdown({
  videos,
}: StatusBreakdownProps) {
  const reduceMotion = useReducedMotion();

  const counts = Object.fromEntries(
    statuses.map((status) => [
      status,
      videos.filter((video) => video.status === status).length,
    ]),
  ) as Record<VideoStatus, number>;

  const total = videos.length;
  if (total === 0) return null;

  const visible = statuses.filter((status) => counts[status] > 0);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Processing status
        </h3>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {total} total
        </span>
      </div>

      <div
        className="mt-5 flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`Status distribution: ${visible
          .map((s) => `${counts[s]} ${statusLabels[s].toLowerCase()}`)
          .join(", ")}`}
      >
        {visible.map((status, index) => {
          const width = `${(counts[status] / total) * 100}%`;

          if (reduceMotion) {
            return (
              <div
                key={status}
                className={cn("h-full", statusBarClasses[status])}
                style={{ width }}
              />
            );
          }

          return (
            <motion.div
              key={status}
              className={cn("h-full", statusBarClasses[status])}
              initial={{ width: 0 }}
              whileInView={{ width }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </div>

      <ul className="mt-5 space-y-2.5">
        {visible.map((status) => {
          const percent = Math.round((counts[status] / total) * 100);

          return (
            <li
              key={status}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    statusBarClasses[status],
                  )}
                />
                {statusLabels[status]}
              </span>

              <span className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                  {counts[status]}
                </span>
                <span className="w-9 text-right font-mono text-xs tabular-nums text-muted-foreground">
                  {percent}%
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
