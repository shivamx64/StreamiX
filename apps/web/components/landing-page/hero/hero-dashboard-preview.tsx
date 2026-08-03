import {
  Activity,
  CheckCircle2,
  Clapperboard,
  Film,
  Video,
} from "lucide-react";

import { cn } from "@/lib/class-name";

const queue = [
  { name: "launch-video.mp4", meta: "1080p · H.264", progress: 72 },
  { name: "tutorial.mov", meta: "Completed", progress: 100 },
  { name: "podcast.mp4", meta: "720p · H.265", progress: 31 },
];

const outputs = [
  "HLS Playlist",
  "1080p",
  "720p",
  "480p",
];

export function HeroDashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-r from-primary/10 to-orange-400/10 blur-2xl"
      />

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-foreground/5">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clapperboard className="h-3.5 w-3.5 text-accent-foreground" />
            StreamiX · Upload Queue
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Live
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-5 md:p-8">
          {/* Upload queue */}
          <div className="space-y-5 md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Upload Queue
            </h3>

            <div className="space-y-5">
              {queue.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 font-medium text-foreground">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-accent-foreground">
                        <Video className="h-4 w-4" />
                      </span>
                      {item.name}
                    </span>
                    <span className="text-muted-foreground">
                      {item.progress === 100
                        ? "Completed"
                        : `${item.progress}%`}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        item.progress === 100
                          ? "bg-emerald-500"
                          : "bg-primary",
                      )}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated outputs */}
          <div className="rounded-2xl border border-border bg-muted/40 p-5 md:col-span-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Generated Outputs
              </h4>
              <Activity className="h-4 w-4 text-accent-foreground" />
            </div>

            <ul className="mt-5 space-y-3 text-sm">
              {outputs.map((output) => (
                <li
                  key={output}
                  className="flex items-center justify-between rounded-lg bg-card px-3 py-2.5"
                >
                  <span className="font-medium text-foreground">
                    {output}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground">
              <Film className="h-4 w-4" />
              Ready to stream
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
