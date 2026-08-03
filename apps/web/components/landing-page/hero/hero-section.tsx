import { MarketingBackgroundGradient } from "@/components/shared-ui/marketing/marketing-background-gradient";
import { MarketingBackgroundGrid } from "@/components/shared-ui/marketing/marketing-background-grid";
import { Reveal } from "@/components/shared-ui/reveal";

import { HeroContent } from "./hero-content";
import { HeroDashboardPreview } from "./hero-dashboard-preview";
import { HeroSocialProof } from "./hero-social-proof";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-24 pt-28 md:pb-32 md:pt-36">
      <MarketingBackgroundGrid />
      <MarketingBackgroundGradient />

      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="flex flex-col items-center">
          <HeroContent />

          <Reveal delay={0.2} className="mt-16 w-full md:mt-20">
            <HeroDashboardPreview />
          </Reveal>

          <Reveal delay={0.25} className="w-full">
            <HeroSocialProof />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
