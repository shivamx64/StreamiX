import Image from "next/image";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionHeader } from "@/components/shared-ui/marketing/marketing-section-header";
import { Reveal } from "@/components/shared-ui/reveal";

const components = [
  {
    index: "01",
    title: "API service",
    description:
      "Validates uploads, streams them to storage, records the video, and publishes a job.",
  },
  {
    index: "02",
    title: "Redis Streams queue",
    description:
      "Consumer groups distribute work and reclaim failed jobs for automatic retry.",
  },
  {
    index: "03",
    title: "FFmpeg worker fleet",
    description:
      "Probes each source and transcodes the full resolution ladder in parallel.",
  },
  {
    index: "04",
    title: "Object storage",
    description:
      "Holds sources alongside HLS playlists, segments, and generated thumbnails.",
  },
];

export function ArchitectureSection() {
  return (
    <MarketingSection id="architecture">
      <MarketingSectionHeader
        badge="Under the hood"
        title="One pipeline, four moving parts"
        description="Every layer is a small service with a narrow interface — the same architecture that scales from a laptop to a worker fleet."
      />

      <div className="mt-20 grid items-center gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal>
          <ol className="relative">
            {components.map((component, index) => (
              <li key={component.index} className="relative flex gap-5 pb-8 last:pb-0">
                {index < components.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[15px] top-9 h-[calc(100%-2rem)] w-px bg-border"
                  />
                )}

                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card font-mono text-[11px] font-semibold text-primary shadow-sm">
                  {component.index}
                </span>

                <div className="pt-1">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {component.title}
                  </h3>
                  <p className="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
                    {component.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} distance={32}>
          <figure className="overflow-hidden rounded-lg border border-border/80 bg-card shadow-2xl shadow-foreground/[0.07]">
            <figcaption className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-5 py-3">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                system-architecture
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                live
              </span>
            </figcaption>

            <Image
              src="/streamix-architecture.png"
              alt="StreamiX high-level architecture diagram: client uploads flow through the Go API into PostgreSQL, Redis Streams, and object storage, and are transcoded by FFmpeg workers into HLS outputs."
              width={1672}
              height={941}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </figure>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <p className="mt-12 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          At-least-once delivery · automatic retry · dead-lettering
        </p>
      </Reveal>
    </MarketingSection>
  );
}
