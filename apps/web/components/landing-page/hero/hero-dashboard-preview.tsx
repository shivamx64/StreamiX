"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Activity, CheckCircle2, Video } from "lucide-react";

import { cn } from "@/lib/class-name";

const queue = [
  { name: "launch-video.mp4", meta: "1080p · H.264", progress: 72 },
  { name: "tutorial.mov", meta: "HLS · 720p", progress: 100 },
  { name: "podcast.mp4", meta: "480p · next", progress: 0 },
];

const outputs = ["Master playlist", "1080p · H.264", "720p · H.264", "480p · H.264"];

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

export function HeroDashboardPreview() {
  const reduceMotion = useReducedMotion();

  const queueRows = queue.map((entry) => (
    <div key={entry.name} className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex min-w-0 items-center gap-2.5 text-sm text-foreground">
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
              entry.progress === 100
                ? "bg-success-soft text-success-soft-foreground"
                : "bg-accent text-accent-foreground",
            )}
          >
            <Video className="h-3.5 w-3.5" />
          </span>
          <span className="truncate font-medium">{entry.name}</span>
        </span>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {entry.progress === 100 ? "Ready" : `${entry.progress}%`}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-sm bg-muted">
        {reduceMotion ? (
          <div
            className={cn(
              "h-full rounded-sm",
              entry.progress === 100
                ? "bg-success"
                : entry.progress === 0
                  ? "bg-border"
                  : "bg-primary",
            )}
            style={{ width: `${entry.progress}%` }}
          />
        ) : (
          <motion.div
            className={cn(
              "h-full rounded-sm",
              entry.progress === 100
                ? "bg-success"
                : entry.progress === 0
                  ? "bg-border"
                  : "bg-primary",
            )}
            initial={{ width: 0 }}
            animate={{ width: `${entry.progress}%` }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </div>
    </div>
  ));

  const outputRows = outputs.map((output) =>
    reduceMotion ? (
      <li
        key={output}
        className="flex items-center justify-between gap-3 text-sm"
      >
        <span className="font-medium text-foreground">{output}</span>
        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
      </li>
    ) : (
      <motion.li
        key={output}
        variants={item}
        className="flex items-center justify-between gap-3 text-sm"
      >
        <span className="font-medium text-foreground">{output}</span>
        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
      </motion.li>
    ),
  );

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div
        aria-hidden="true"
        className="absolute -inset-x-10 -top-12 -z-10 h-72 rounded-[50%] bg-primary/10 blur-3xl"
      />

      <div className="overflow-hidden rounded-md border border-border bg-card shadow-2xl shadow-foreground/10">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-foreground" />
            Upload queue
          </div>

          <div className="inline-flex items-center gap-2 rounded-md border border-success/30 bg-success-soft px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-success-soft-foreground">
            <span className="relative flex h-1.5 w-1.5">
              {!reduceMotion && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Live
          </div>
        </div>

        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-[2fr_1fr]"
        >
          <div className="space-y-5 p-6 md:p-8">{queueRows}</div>

          <div className="border-t border-border/70 p-6 md:border-l md:border-t-0 md:p-8">
            <h4 className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Generated outputs
            </h4>
            <ul className="mt-5 space-y-3">{outputRows}</ul>

            <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4 text-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Thumbnail · HLS
              </span>
              <span className="font-semibold text-primary">Stream now</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}