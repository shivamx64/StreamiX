import {
  Cpu,
  Inbox,
  ListOrdered,
  PackageCheck,
  ScanSearch,
} from "lucide-react";

import { MarketingSectionBadge } from "@/components/shared-ui/marketing/marketing-section-badge";
import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { Stagger, StaggerItem } from "@/components/shared-ui/stagger";

const stages = [
  {
    number: "01",
    title: "Receive",
    command: "POST /videos",
    description:
      "Validate the multipart upload, persist the source under a generated media ID, and create the job row in a queued state.",
    state: "source.stored",
    icon: Inbox,
  },
  {
    number: "02",
    title: "Queue",
    command: "XADD video-transcode *",
    description:
      "Publish the job to Redis Streams. A worker in the consumer group claims it and acknowledges the message when processing settles.",
    state: "job.claimed",
    icon: ListOrdered,
  },
  {
    number: "03",
    title: "Probe",
    command: "ffprobe -v error",
    description:
      "Read duration and source resolution, then choose a rendition ladder that never upscales.",
    state: "metadata.ready",
    icon: ScanSearch,
  },
  {
    number: "04",
    title: "Transcode",
    command: "ffmpeg -i source",
    description:
      "Render the adaptive ladder and a thumbnail. Low-resolution sources fall back to smaller renditions instead of upscaling.",
    state: "renditions.built",
    icon: Cpu,
  },
  {
    number: "05",
    title: "Package",
    command: "master.m3u8",
    description:
      "Write HLS playlists and segments, mark the job ready, and expose playback through short-lived signed URLs.",
    state: "playback.ready",
    icon: PackageCheck,
  },
];

export function WorkflowSection() {
  return (
    <MarketingSection
      id="pipeline"
      className="relative overflow-hidden border-b border-border/70 bg-[#171512] py-20 text-[#f5f1e8] md:py-28 lg:py-32 dark:bg-[#141210]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <MarketingSectionBadge className="text-stone-400">
            How it works
          </MarketingSectionBadge>
          <h2 className="font-display mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] text-[#f5f1e8] md:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
            One job. Five explicit stages.
          </h2>
        </div>

        <p className="max-w-sm text-pretty text-sm leading-7 text-stone-400 md:text-base">
          Every transition is persisted. If a transcode fails, you can see
          which stage stopped, which attempt failed, and what the worker
          retried.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-lg border border-white/10 bg-white/[0.025] md:mt-16">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span className="truncate font-mono text-[10px] tracking-[0.1em] text-stone-400">
              pipeline / job_01HZX4K8Q2
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.12em] text-stone-400">
            <span>attempt 1</span>
            <span className="h-3 w-px bg-white/10" />
            <span className="text-emerald-400">complete</span>
          </div>
        </div>

        <Stagger className="grid divide-y divide-white/10 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {stages.map((stage, index) => (
            <StaggerItem
              key={stage.number}
              className="group relative p-4 md:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] tracking-[0.16em] text-orange-400">
                  {stage.number}
                </span>
                <stage.icon className="h-4 w-4 text-stone-500 transition-colors group-hover:text-stone-300" />
              </div>

              <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.015em] text-[#f5f1e8]">
                {stage.title}
              </h3>

              <code className="mt-2 block truncate rounded-sm border border-white/10 bg-black/20 px-2 py-1.5 font-mono text-[9px] text-stone-400">
                {stage.command}
              </code>

              <p className="mt-4 text-[12px] leading-5 text-stone-400">
                {stage.description}
              </p>

              <p className="mt-5 border-t border-white/10 pt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-stone-400">
                {stage.state}
              </p>

              {index < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-[0.3rem] top-1/2 z-10 hidden h-[0.55rem] w-[0.55rem] -translate-y-1/2 rotate-45 border-r border-t border-white/20 bg-[#1a1815] lg:block"
                />
              )}
            </StaggerItem>
          ))}
        </Stagger>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 bg-black/15 px-4 py-3 font-mono text-[9px] text-stone-400 md:px-5">
          <span>consumer group: transcode-workers</span>
          <span>retry policy: bounded window · terminal failure state</span>
        </div>
      </div>
    </MarketingSection>
  );
}
