"use client";

import {
  Activity,
  CloudUpload,
  Cpu,
  Globe,
  Layers,
  ShieldCheck,
} from "lucide-react";

import { CountUp } from "@/components/shared-ui/count-up";
import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionHeader } from "@/components/shared-ui/marketing/marketing-section-header";
import { Stagger, StaggerItem } from "@/components/shared-ui/stagger";

const features = [
  {
    icon: Cpu,
    title: "Distributed Transcoding",
    description:
      "Fan out heavy FFmpeg jobs across a fleet of workers to process hundreds of videos in parallel — no queue, no waiting.",
  },
  {
    icon: Layers,
    title: "Adaptive Bitrate HLS",
    description:
      "Generate multi-resolution HLS streams automatically so every viewer gets crisp playback on any device or connection.",
  },
  {
    icon: CloudUpload,
    title: "Direct-to-Storage Uploads",
    description:
      "Stream uploads straight to object storage — no proxy bottlenecks, no dropped files, and no arbitrary size limits.",
  },
  {
    icon: Activity,
    title: "Realtime Processing Updates",
    description:
      "Follow every job from queue to completion with live progress, logs, and status events in a single dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Default",
    description:
      "JWT authentication and private object storage keep your content encrypted, isolated, and accessible only to you.",
  },
  {
    icon: Globe,
    title: "Global Delivery",
    description:
      "Serve adaptive streams from edge-optimized infrastructure so playback stays fast for audiences anywhere on earth.",
  },
];

const stats = [
  { value: 10, suffix: "M+", decimals: 0, label: "minutes processed" },
  { value: 99.9, suffix: "%", decimals: 1, label: "pipeline uptime" },
  { value: 120, suffix: "+", decimals: 0, label: "countries served" },
  { value: 1, prefix: "< ", suffix: " min", decimals: 0, label: "median encode time" },
];

export function FeaturesSection() {
  return (
    <MarketingSection id="features" className="bg-muted/40">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <MarketingSectionHeader
            align="left"
            badge="Why StreamiX"
            title="Built for scale. Designed for creators."
            description="Everything you need to turn raw uploads into polished, adaptive streams — without managing video infrastructure yourself."
          />

          <p className="mt-6 hidden font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground lg:block">
            06 capabilities · one pipeline
          </p>
        </div>

        <Stagger className="border-t border-border/70">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group flex gap-5 border-b border-border/70 py-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </span>

                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <dl className="mt-24 grid grid-cols-2 gap-x-8 gap-y-12 lg:mt-32 lg:grid-cols-4 lg:divide-x lg:divide-border">
        <Stagger className="contents">
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="px-0 lg:px-8 lg:first:pl-0">
              <dd className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </dd>
              <dt className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </dt>
            </StaggerItem>
          ))}
        </Stagger>
      </dl>
    </MarketingSection>
  );
}