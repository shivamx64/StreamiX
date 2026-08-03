import { MarketingSectionBadge } from "@/components/shared-ui/marketing/marketing-section-badge";
import { MarketingSectionDescription } from "@/components/shared-ui/marketing/marketing-section-description";
import { MarketingSectionHeading } from "@/components/shared-ui/marketing/marketing-section-heading";
import { Reveal } from "@/components/shared-ui/reveal";

import { HeroActions } from "./hero-actions";
import { HeroTrustBadge } from "./hero-trust-badge";

export function HeroContent() {
  return (
    <div className="max-w-4xl text-center">
      <Reveal>
        <MarketingSectionBadge>
          Distributed Video Infrastructure
        </MarketingSectionBadge>
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
        <MarketingSectionDescription className="mx-auto mt-8">
          StreamiX automates video transcoding, adaptive bitrate generation,
          storage, and delivery through a scalable distributed pipeline built
          for modern creators and engineering teams.
        </MarketingSectionDescription>
      </Reveal>

      <Reveal delay={0.15}>
        <HeroActions />
      </Reveal>

      <Reveal delay={0.2}>
        <HeroTrustBadge />
      </Reveal>
    </div>
  );
}
