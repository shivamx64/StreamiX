import { ArrowUpRight, CircleCheck, Timer, Workflow } from "lucide-react";

import { MarketingSectionBadge } from "@/components/shared-ui/marketing/marketing-section-badge";
import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { Reveal } from "@/components/shared-ui/reveal";

const concerns = [
  {
    number: "01",
    title: "Ingest without guesswork",
    description:
      "Accept MP4, WebM, or MOV sources up to 2 GB. Every upload becomes a job with explicit state, so failures surface instead of disappearing into a quiet background task.",
    icon: CircleCheck,
    detail: "upload → queued",
  },
  {
    number: "02",
    title: "Process with a real worker",
    description:
      "FFmpeg builds a 1080p, 720p, and 480p ladder plus a thumbnail, with smaller renditions when the source is low resolution. Bounded retries and terminal failure states live in the queue.",
    icon: Workflow,
    detail: "queued → transcoded",
  },
  {
    number: "03",
    title: "Play back with control",
    description:
      "Adaptive HLS is served through authenticated media routes. The dashboard player respects session state and lets you select available renditions during playback.",
    icon: Timer,
    detail: "transcoded → ready",
  },
];

export function ProblemSection() {
  return (
    <MarketingSection id="product" className="border-b border-border/70">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <MarketingSectionBadge>The surface area</MarketingSectionBadge>

          <h2 className="font-display mt-5 max-w-md text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground md:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
            A video product is more than a player.
          </h2>

          <p className="mt-5 max-w-md text-pretty text-base leading-7 text-muted-foreground">
            Behind every upload sits a chain of state: source files, job
            progress, rendition outputs, playback manifests, and access
            control. StreamiX keeps that chain visible.
          </p>

          <div className="mt-10 hidden border-t border-border pt-5 lg:block">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Current scope
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Local filesystem storage, Redis Streams, and a standalone Go
              worker. No CDN or managed cloud dependency.
            </p>
          </div>
        </div>

        <div className="border-t border-border">
          {concerns.map((concern, index) => (
            <Reveal
              key={concern.number}
              delay={index * 0.06}
              className="group border-b border-border"
            >
              <div className="grid gap-5 py-8 md:grid-cols-[3rem_1fr_auto] md:gap-8 md:py-10">
                <span className="font-mono text-[11px] tracking-[0.16em] text-primary">
                  {concern.number}
                </span>

                <div>
                  <div className="flex items-center gap-2.5">
                    <concern.icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground md:text-xl">
                      {concern.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-xl text-pretty text-sm leading-6 text-muted-foreground md:text-[15px] md:leading-7">
                    {concern.description}
                  </p>
                </div>

                <div className="hidden items-start gap-2 md:flex">
                  <span className="pt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    {concern.detail}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </MarketingSection>
  );
}
