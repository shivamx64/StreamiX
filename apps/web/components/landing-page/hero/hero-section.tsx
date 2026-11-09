import {
  ArrowRight,
  Check,
  Clapperboard,
  FileVideo,
  Film,
  Layers,
  Play,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";

import { MarketingBackgroundGrid } from "@/components/shared-ui/marketing/marketing-background-grid";
import { MarketingContainer } from "@/components/shared-ui/marketing/marketing-container";
import { MarketingSectionBadge } from "@/components/shared-ui/marketing/marketing-section-badge";
import { MarketingSectionDescription } from "@/components/shared-ui/marketing/marketing-section-description";
import { MarketingSectionHeading } from "@/components/shared-ui/marketing/marketing-section-heading";
import { Button } from "@/components/ui/button";

const pipelineStages = [
  {
    label: "Ingest",
    detail: "Upload received",
    icon: Upload,
    status: "complete",
  },
  {
    label: "Probe",
    detail: "ffprobe metadata",
    icon: FileVideo,
    status: "complete",
  },
  {
    label: "Transcode",
    detail: "FFmpeg renditions",
    icon: Film,
    status: "complete",
  },
  {
    label: "Package",
    detail: "HLS playlists",
    icon: Layers,
    status: "complete",
  },
] as const;

const renditions = [
  { quality: "1080p", detail: "1920 × 1080 · 5.0 Mbps" },
  { quality: "720p", detail: "1280 × 720 · 2.8 Mbps" },
  { quality: "480p", detail: "854 × 480 · 1.2 Mbps" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 pb-16 pt-14 md:pb-24 md:pt-20 lg:pb-28 lg:pt-24">
      <MarketingBackgroundGrid />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-3xl"
      />

      <MarketingContainer>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <MarketingSectionBadge>
            Video processing infrastructure
          </MarketingSectionBadge>

          <MarketingSectionHeading className="mt-6 max-w-4xl">
            Video processing,{" "}
            <br />
            <span className="text-muted-foreground">built as a pipeline.</span>
          </MarketingSectionHeading>

          <MarketingSectionDescription className="mt-6 max-w-2xl">
            Upload a source file, queue an FFmpeg job over Redis Streams, and
            deliver adaptive HLS with authenticated playback.
          </MarketingSectionDescription>

          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Button asChild className="h-11 w-full px-5 sm:w-auto">
              <Link href="/signup">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 w-full px-5 sm:w-auto"
            >
              <Link href="/docs">Read the docs</Link>
            </Button>
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Public repository · Self-hostable
          </p>
        </div>

        <HeroProcessingPreview />
      </MarketingContainer>
    </section>
  );
}

function HeroProcessingPreview() {
  return (
    <div className="relative mx-auto mt-14 max-w-5xl md:mt-20">
      <div
        aria-hidden="true"
        className="absolute inset-x-12 -bottom-6 -z-10 h-24 rounded-[50%] bg-foreground/10 blur-3xl"
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_24px_80px_-32px_rgba(28,25,23,0.28)]">
        <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/30 px-4 py-3 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
            </div>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <p className="truncate font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
              jobs / job_01HZX4K8Q2
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Ready
          </span>
        </div>

        <div className="grid divide-y divide-border lg:grid-cols-[1fr_1.15fr_1fr] lg:divide-x lg:divide-y-0">
          <div className="p-4 md:p-5">
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Source
            </p>

            <div className="mt-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                <FileVideo className="h-4 w-4 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">
                  demo-reel.mp4
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  428 MB · 00:42
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-2 border-t border-border pt-4 font-mono text-[10px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">MIME</dt>
                <dd className="text-foreground">video/mp4</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Dimensions</dt>
                <dd className="text-foreground">1920 × 1080</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="text-foreground">00:42</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Stored</dt>
                <dd className="text-foreground">Locally</dd>
              </div>
            </dl>
          </div>

          <div className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Pipeline
              </p>
              <span className="font-mono text-[9px] text-muted-foreground">
                worker-01
              </span>
            </div>

            <ol className="relative mt-5 space-y-4">
              <span
                aria-hidden="true"
                className="absolute bottom-5 left-[0.6875rem] top-5 w-px bg-border"
              />
              {pipelineStages.map((stage) => (
                <li key={stage.label} className="relative flex gap-3">
                  <span className="relative z-10 flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full border border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] font-medium text-foreground">
                        {stage.label}
                      </p>
                      <stage.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <p className="mt-0.5 font-mono text-[9px] text-muted-foreground">
                      {stage.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Output
              </p>
              <span className="inline-flex items-center gap-1 font-mono text-[9px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3" />
                Auth
              </span>
            </div>

            <div className="relative mt-4 aspect-video overflow-hidden rounded-md border border-border bg-[#171512]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(249,115,22,0.28),transparent_45%),linear-gradient(135deg,#221f1a,#0e0d0b)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2.5">
                <span className="font-mono text-[9px] text-white/70">
                  00:08 / 00:42
                </span>
                <span className="rounded-sm bg-black/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-white/70">
                  Thumbnail
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {renditions.map((rendition) => (
                <div
                  key={rendition.quality}
                  className="flex items-center gap-2.5 rounded-md border border-border bg-background px-2.5 py-2"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] font-medium text-foreground">
                      {rendition.quality}
                    </p>
                    <p className="truncate font-mono text-[8px] text-muted-foreground">
                      {rendition.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-2 font-mono text-[9px] text-muted-foreground">
              <Sparkles className="h-3 w-3 shrink-0 text-primary" />
              <span className="truncate">master.m3u8 · 3 variants</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border bg-muted/30 px-4 py-2.5 md:px-5">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <Clapperboard className="h-3 w-3" />
            <span>Adaptive HLS</span>
            <span className="h-3 w-px bg-border" />
            <span>Thumbnail included</span>
          </div>
          <p className="font-mono text-[9px] text-muted-foreground">
            status: <span className="text-foreground">completed</span>
          </p>
        </div>
      </div>
    </div>
  );
}
