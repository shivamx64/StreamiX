import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TechStack } from "@/components/landing/tech-stack";
import { Features } from "@/components/landing/features";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { WhyStreamix } from "@/components/landing/why-streamix";
import { EngineeringPrinciples } from "@/components/landing/engineering-principles";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
      <Hero />
      <TechStack />
      <Features />
      <DashboardPreview />
      <WhyStreamix />
      <EngineeringPrinciples />
      <CTA />
      </main>
      <Footer />
    </>
  );
}