import {
  MarketingSectionBadge,
} from "@/components/shared-ui/marketing/marketing-section-badge";

import {
  MarketingSectionDescription,
} from "@/components/shared-ui/marketing/marketing-section-description";

import {
  MarketingSectionHeading,
} from "@/components/shared-ui/marketing/marketing-section-heading";

import { HeroActions } from "./hero-actions";

export function HeroContent() {
  return (
    <div className="max-w-4xl text-center">
      <MarketingSectionBadge>
        Distributed Video Infrastructure
      </MarketingSectionBadge>

      <MarketingSectionHeading className="mt-8">
        Upload once.
        <br />
        Stream everywhere.
      </MarketingSectionHeading>

      <MarketingSectionDescription className="mx-auto">
        StreamiX automates video transcoding, adaptive bitrate generation,
        storage, and delivery through a scalable distributed pipeline built for
        modern creators and engineering teams.
      </MarketingSectionDescription>

      <HeroActions />
    </div>
  );
}