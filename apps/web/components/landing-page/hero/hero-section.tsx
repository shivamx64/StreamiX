import {
  MarketingBackgroundGradient,
} from "@/components/shared-ui/marketing/marketing-background-gradient";

import {
  MarketingBackgroundGrid,
} from "@/components/shared-ui/marketing/marketing-background-grid";

import {
  MarketingSectionContainer,
} from "@/components/shared-ui/marketing/marketing-section-container";

import { HeroContent } from "./hero-content";
import { HeroDashboardPreview } from "./hero-dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <MarketingBackgroundGrid />
      <MarketingBackgroundGradient />

      <MarketingSectionContainer>
        <div className="flex flex-col items-center">
          <HeroContent />

          <div className="mt-20 w-full">
            <HeroDashboardPreview />
          </div>
        </div>
      </MarketingSectionContainer>
    </section>
  );
}