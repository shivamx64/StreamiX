import {
  Activity,
  CloudUpload,
  Cpu,
  Globe,
  Layers,
  ShieldCheck,
} from "lucide-react";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionHeader } from "@/components/shared-ui/marketing/marketing-section-header";
import { Reveal } from "@/components/shared-ui/reveal";
import { Card } from "@/components/ui/card";

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
  { value: "10M+", label: "minutes processed" },
  { value: "99.9%", label: "pipeline uptime" },
  { value: "120+", label: "countries served" },
  { value: "< 1 min", label: "median encode time" },
];

export function FeaturesSection() {
  return (
    <MarketingSection id="features" className="bg-muted/40">
      <MarketingSectionHeader
        badge="Why StreamiX"
        title="Built for scale. Designed for creators."
        description="Everything you need to turn raw uploads into polished, adaptive streams — without managing video infrastructure yourself."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.06}>
            <Card className="group flex h-full flex-col p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-border">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.05} className="px-4 text-center">
            <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </MarketingSection>
  );
}