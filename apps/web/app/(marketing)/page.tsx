import type { Metadata } from "next";

import { ArchitectureSection } from "@/components/landing-page/architecture/architecture-section";
import { CtaSection } from "@/components/landing-page/cta/cta-section";
import { DeveloperSection } from "@/components/landing-page/developer/developer-section";
import { FaqSection } from "@/components/landing-page/faq/faq-section";
import { FeaturesSection } from "@/components/landing-page/features/features-section";
import { GettingStartedSection } from "@/components/landing-page/getting-started/getting-started-section";
import { HeroSection } from "@/components/landing-page/hero/hero-section";
import { ProblemSection } from "@/components/landing-page/problem/problem-section";
import { TechStackStrip } from "@/components/landing-page/tech/tech-stack-strip";
import { WorkflowSection } from "@/components/landing-page/workflow/workflow-section";

export const metadata: Metadata = {
  title: "Video processing, built as a pipeline",
  description:
    "Upload source files, run FFmpeg jobs over Redis Streams, and deliver adaptive HLS with authenticated playback.",
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <TechStackStrip />
      <ProblemSection />
      <WorkflowSection />
      <FeaturesSection />
      <ArchitectureSection />
      <DeveloperSection />
      <GettingStartedSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
