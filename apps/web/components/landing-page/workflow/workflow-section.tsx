import { ArrowRight, CloudUpload, Cpu, MonitorPlay } from "lucide-react";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionHeader } from "@/components/shared-ui/marketing/marketing-section-header";
import { Reveal } from "@/components/shared-ui/reveal";

const steps = [
  {
    icon: CloudUpload,
    title: "Upload your video",
    description:
      "Upload straight to object storage or point us at an existing bucket. No proxies, no arbitrary size limits.",
  },
  {
    icon: Cpu,
    title: "We transcode it",
    description:
      "FFmpeg jobs fan out across a fleet of workers to generate multi-resolution HLS renditions in parallel.",
  },
  {
    icon: MonitorPlay,
    title: "Stream everywhere",
    description:
      "Adaptive playlists are delivered from the edge, so playback stays crisp on any device or connection.",
  },
];

export function WorkflowSection() {
  return (
    <MarketingSection id="how-it-works">
      <MarketingSectionHeader
        badge="How it works"
        title="From upload to streaming in three steps"
        description="No infrastructure to manage. Upload a file and StreamiX handles the rest."
      />

      <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.1} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                  <step.icon className="h-7 w-7" />
                </span>
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>

            {index < steps.length - 1 && (
              <ArrowRight
                aria-hidden="true"
                className="absolute -right-8 top-8 hidden h-5 w-5 text-border md:block"
              />
            )}
          </Reveal>
        ))}
      </div>
    </MarketingSection>
  );
}
