"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CloudUpload, Cpu, MonitorPlay } from "lucide-react";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionHeader } from "@/components/shared-ui/marketing/marketing-section-header";
import { Stagger, StaggerItem } from "@/components/shared-ui/stagger";

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
  const reduceMotion = useReducedMotion();

  return (
    <MarketingSection id="how-it-works">
      <MarketingSectionHeader
        badge="How it works"
        title="From upload to streaming in three steps"
        description="No infrastructure to manage. Upload a file and StreamiX handles the rest."
      />

      <Stagger className="relative mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
        {/* Connector line */}
        {!reduceMotion && (
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden h-px origin-left bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
        )}

        {steps.map((step, index) => (
          <StaggerItem key={step.title} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-md border border-border bg-card text-primary shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-md bg-primary font-mono text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
              </div>

              <h3 className="mt-7 text-lg font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>

            {index < steps.length - 1 && (
              <ArrowRight
                aria-hidden="true"
                className="absolute left-1/2 top-10 hidden h-5 w-5 -translate-x-1/2 text-muted-foreground/50 md:block"
              />
            )}
          </StaggerItem>
        ))}
      </Stagger>
    </MarketingSection>
  );
}