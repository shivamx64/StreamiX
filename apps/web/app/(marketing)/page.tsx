import { CtaSection } from "@/components/landing-page/cta/cta-section";
import { FaqSection } from "@/components/landing-page/faq/faq-section";
import { FeaturesSection } from "@/components/landing-page/features/features-section";
import { HeroSection } from "@/components/landing-page/hero/hero-section";
import { PricingSection } from "@/components/landing-page/pricing/pricing-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}