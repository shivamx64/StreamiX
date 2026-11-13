import {
  ArrowRight,
  ArrowUpRight,
  CloudOff,
  Cpu,
  Database,
  Film,
  HardDrive,
  Monitor,
  Play,
  Radio,
  Server,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionBadge } from "@/components/shared-ui/marketing/marketing-section-badge";
import { Reveal } from "@/components/shared-ui/reveal";

const flow = [
  {
    number: "01",
    title: "Upload",
    notes: "MP4 · WebM · MOV · 2 GB limit",
    nodes: [
      {
        name: "Next.js client",
        detail: "dashboard upload",
        icon: Monitor,
      },
      {
        name: "Go API",
        detail: "JWT-protected",
        icon: Server,
      },
    ],
  },
  {
    number: "02",
    title: "Persist",
    notes: "metadata + source",
    nodes: [
      {
        name: "PostgreSQL",
        detail: "video & job state",
        icon: Database,
      },
      {
        name: "Media storage",
        detail: "local or S3",
        icon: HardDrive,
      },
    ],
  },
  {
    number: "03",
    title: "Queue",
    notes: "consumer group: transcode-workers",
    nodes: [
      {
        name: "Redis Streams",
        detail: "video-transcode",
        icon: Radio,
      },
    ],
  },
  {
    number: "04",
    title: "Process",
    notes: "probe → transcode → package",
    nodes: [
      {
        name: "Go worker",
        detail: "claim & retry",
        icon: Cpu,
      },
      {
        name: "FFmpeg",
        detail: "HLS + thumbnail",
        icon: Film,
      },
    ],
  },
  {
    number: "05",
    title: "Deliver",
    notes: "token scoped to one video",
    nodes: [
      {
        name: "Media routes",
        detail: "signed HLS + JPEG",
        icon: ShieldCheck,
      },
      {
        name: "hls.js",
        detail: "signed playback",
        icon: Play,
      },
    ],
  },
];

const constraints = [
  {
    title: "Storage is pluggable",
    description:
      "Media lives on the local filesystem or in an S3-compatible bucket behind one interface. The API and worker always share the configured backend.",
  },
  {
    title: "No edge layer",
    description:
      "The API streams HLS playlists and segments directly. There is no CDN or global cache in the current path.",
  },
  {
    title: "One worker process",
    description:
      "Additional workers can share the consumer group. Autoscaling and a distributed worker fleet are not included.",
  },
  {
    title: "Ownership at the route",
    description:
      "Every signed media request validates a video-scoped token and resolves the owner before a file is opened.",
  },
];

export function ArchitectureSection() {
  return (
    <MarketingSection id="architecture" className="border-b border-border/70">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <MarketingSectionBadge>System map</MarketingSectionBadge>
          <h2 className="font-display mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground md:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
            Small enough to understand. Real enough to run.
          </h2>
        </div>

        <p className="max-w-sm text-pretty text-sm leading-7 text-muted-foreground md:text-base">
          One Next.js app, a Go API, PostgreSQL, Redis Streams, a worker, and
          pluggable media storage. Every job can be traced by hand.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        <Reveal>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Request path
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                single-machine topology
              </span>
            </div>

            <ol className="divide-y divide-border">
              {flow.map((step) => (
                <li
                  key={step.number}
                  className="grid grid-cols-[2.75rem_1fr] md:grid-cols-[4.5rem_1fr]"
                >
                  <div className="border-r border-border p-3 md:p-4">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-primary">
                      {step.number}
                    </span>
                  </div>

                  <div className="p-3 md:p-4">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="text-[12px] font-semibold text-foreground">
                        {step.title}
                      </p>
                      <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                        {step.notes}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {step.nodes.map((node, index) => (
                        <div
                          key={node.name}
                          className="flex items-center gap-2"
                        >
                          {index > 0 && (
                            <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                          )}
                          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2">
                            <node.icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-medium text-foreground">
                                {node.name}
                              </p>
                              <p className="truncate font-mono text-[8px] text-muted-foreground">
                                {node.detail}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="border-t border-dashed border-border bg-muted/20 px-4 py-3">
              <p className="font-mono text-[8px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Planned adapters · not in the current build
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "CDN delivery",
                  "Autoscaled workers",
                  "Realtime status",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-sm border border-dashed border-border px-2 py-1 font-mono text-[8px] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <aside className="lg:sticky lg:top-28">
            <div className="flex items-center gap-2">
              <CloudOff className="h-3.5 w-3.5 text-primary" />
              <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Design constraints
              </p>
            </div>

            <h3 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-foreground md:text-2xl">
              The whole system fits in one diagram.
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The current build is intentionally small enough to run on one
              machine. The diagram reflects what ships today, not a target
              cloud architecture.
            </p>

            <dl className="mt-8 border-t border-border">
              {constraints.map((constraint) => (
                <div
                  key={constraint.title}
                  className="border-b border-border py-5"
                >
                  <dt className="text-[13px] font-medium text-foreground">
                    {constraint.title}
                  </dt>
                  <dd className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                    {constraint.description}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href="/docs"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary transition-colors hover:text-primary/80"
            >
              Read the setup guide
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </aside>
        </Reveal>
      </div>
    </MarketingSection>
  );
}
