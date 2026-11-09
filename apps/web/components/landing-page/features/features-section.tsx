import {
  Activity,
  ImageIcon,
  Layers,
  Radio,
  ShieldCheck,
} from "lucide-react";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionBadge } from "@/components/shared-ui/marketing/marketing-section-badge";
import { Stagger, StaggerItem } from "@/components/shared-ui/stagger";

const ladder = [
  { label: "1080p", width: "100%", detail: "1920 × 1080" },
  { label: "720p", width: "76%", detail: "1280 × 720" },
  { label: "480p", width: "52%", detail: "854 × 480" },
  { label: "240p", width: "34%", detail: "low-res fallback" },
];

const queueEvents = [
  { time: "09:41:02", event: "XADD", detail: "video.queued" },
  { time: "09:41:03", event: "CLAIM", detail: "worker-a" },
  { time: "09:41:19", event: "XACK", detail: "video.completed" },
  { time: "09:44:07", event: "RECLAIM", detail: "idle > threshold" },
];

export function FeaturesSection() {
  return (
    <MarketingSection id="features" className="border-b border-border/70">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <MarketingSectionBadge>Capabilities</MarketingSectionBadge>
          <h2 className="font-display mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground md:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
            The parts that make video work.
          </h2>
        </div>

        <p className="max-w-sm text-pretty text-sm leading-7 text-muted-foreground md:text-base">
          Renditions, queue recovery, ownership, and job state are all part of
          the same pipeline, not features hidden behind a control plane.
        </p>
      </div>

      <Stagger className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:mt-16 lg:grid-cols-6">
        <StaggerItem className="group bg-background p-5 transition-colors hover:bg-muted/20 md:p-6 lg:col-span-3">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Adaptive output
            </p>
            <Layers className="h-4 w-4 text-primary" />
          </div>

          <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-foreground">
            An HLS ladder that respects the source.
          </h3>
          <p className="mt-2 max-w-md text-[13px] leading-6 text-muted-foreground">
            Transcode to 1080p, 720p, and 480p. The worker skips upscaling and
            renders smaller fallback variants when the source calls for it.
          </p>

          <div className="mt-7 space-y-2.5">
            {ladder.map((rendition) => (
              <div
                key={rendition.label}
                className="flex items-center gap-3"
              >
                <span className="w-9 shrink-0 font-mono text-[9px] text-foreground">
                  {rendition.label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary/70 transition-all duration-500 group-hover:bg-primary"
                    style={{ width: rendition.width }}
                  />
                </span>
                <span className="hidden w-24 shrink-0 text-right font-mono text-[8px] text-muted-foreground sm:block">
                  {rendition.detail}
                </span>
              </div>
            ))}
          </div>
        </StaggerItem>

        <StaggerItem className="group bg-background p-5 transition-colors hover:bg-muted/20 md:p-6 lg:col-span-3">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Queue reliability
            </p>
            <Radio className="h-4 w-4 text-primary" />
          </div>

          <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-foreground">
            Work survives a worker restart.
          </h3>
          <p className="mt-2 max-w-md text-[13px] leading-6 text-muted-foreground">
            Consumer groups acknowledge completed messages. Pending work left
            by a failed consumer is reclaimed after a configured idle
            threshold.
          </p>

          <div className="mt-7 overflow-hidden rounded-md border border-border bg-muted/20">
            {queueEvents.map((event) => (
              <div
                key={`${event.time}-${event.event}`}
                className="flex items-center gap-3 border-b border-border/70 px-3 py-2 font-mono text-[9px] last:border-b-0"
              >
                <span className="text-muted-foreground">{event.time}</span>
                <span className="w-14 shrink-0 text-primary">
                  {event.event}
                </span>
                <span className="truncate text-foreground">
                  {event.detail}
                </span>
              </div>
            ))}
          </div>
        </StaggerItem>

        <StaggerItem className="group bg-background p-5 transition-colors hover:bg-muted/20 md:p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Ownership
            </p>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>

          <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-foreground">
            Media belongs to its owner.
          </h3>
          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
            Thumbnail and HLS routes resolve the video against the
            authenticated user before streaming a byte from disk.
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <code className="truncate font-mono text-[8px] text-muted-foreground">
              GET /videos/:id/hls/master.m3u8
            </code>
          </div>
        </StaggerItem>

        <StaggerItem className="group bg-background p-5 transition-colors hover:bg-muted/20 md:p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Job state
            </p>
            <Activity className="h-4 w-4 text-primary" />
          </div>

          <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-foreground">
            No silent background magic.
          </h3>
          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
            Follow each video from upload through processing to completion, or
            inspect the failure that stopped it.
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {["uploaded", "queued", "processing", "completed"].map(
              (state) => (
                <span
                  key={state}
                  className="rounded-sm border border-border bg-muted/20 px-2 py-1 font-mono text-[8px] text-muted-foreground last:border-primary/30 last:bg-primary/10 last:text-primary"
                >
                  {state}
                </span>
              ),
            )}
          </div>
        </StaggerItem>

        <StaggerItem className="group bg-background p-5 transition-colors hover:bg-muted/20 md:p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Poster frame
            </p>
            <ImageIcon className="h-4 w-4 text-primary" />
          </div>

          <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-foreground">
            A thumbnail from the same job.
          </h3>
          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
            The worker captures a poster frame alongside HLS output, served
            through the same authenticated media path.
          </p>

          <div className="relative mt-6 aspect-[16/7] overflow-hidden rounded-md border border-border bg-[#171512]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(249,115,22,0.28),transparent_50%),linear-gradient(135deg,#24201a,#0e0d0b)]" />
            <span className="absolute bottom-2 left-2 rounded-sm bg-black/40 px-1.5 py-0.5 font-mono text-[8px] text-white/70">
              thumbnail.jpg
            </span>
          </div>
        </StaggerItem>
      </Stagger>
    </MarketingSection>
  );
}
