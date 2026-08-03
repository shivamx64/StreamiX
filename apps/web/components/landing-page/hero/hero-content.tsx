import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { MarketingSectionDescription } from "@/components/shared-ui/marketing/marketing-section-description";
import { MarketingSectionHeading } from "@/components/shared-ui/marketing/marketing-section-heading";
import { Reveal } from "@/components/shared-ui/reveal";

import { HeroActions } from "./hero-actions";

export function HeroContent() {
  return (
    <div className="max-w-4xl text-center">
      <Reveal>
        <Link
          href="#features"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pl-1.5 pr-3.5 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/40"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="h-3 w-3" />
          </span>
          Introducing adaptive HLS streaming
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      <Reveal delay={0.05}>
        <MarketingSectionHeading className="mt-8">
          Upload once.
          <br />
          Stream{" "}
          <span className="text-gradient">
            everywhere.
          </span>
        </MarketingSectionHeading>
      </Reveal>

      <Reveal delay={0.1}>
        <MarketingSectionDescription className="mx-auto mt-6">
          StreamiX automates video transcoding, adaptive bitrate generation,
          storage, and delivery through a scalable distributed pipeline built
          for modern creators and engineering teams.
        </MarketingSectionDescription>
      </Reveal>

      <Reveal delay={0.15}>
        <HeroActions />
      </Reveal>
    </div>
  );
}
