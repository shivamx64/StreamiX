import {
  Braces,
  Database,
  Film,
  Layers,
  Radio,
  Server,
} from "lucide-react";
import Link from "next/link";

import { MarketingContainer } from "@/components/shared-ui/marketing/marketing-container";

const technologies = [
  { name: "Next.js", role: "Interface", icon: Layers },
  { name: "Go", role: "API", icon: Server },
  { name: "PostgreSQL", role: "Metadata", icon: Database },
  { name: "Redis Streams", role: "Queue", icon: Radio },
  { name: "FFmpeg", role: "Transcode", icon: Film },
  { name: "HLS", role: "Delivery", icon: Braces },
];

export function TechStackStrip() {
  return (
    <section
      aria-label="Technology stack"
      className="border-b border-border/70 bg-muted/20"
    >
      <MarketingContainer>
        <div className="flex flex-col gap-5 py-7 lg:flex-row lg:items-center lg:justify-between">
          <p className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Built with
          </p>

          <ul className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:gap-x-8">
            {technologies.map((technology) => (
              <li
                key={technology.name}
                className="flex items-center gap-2.5"
              >
                <technology.icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-[13px] font-medium text-foreground">
                  {technology.name}
                </span>
                <span className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground xl:inline">
                  {technology.role}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="#architecture"
            className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary lg:inline"
          >
            System map ↓
          </Link>
        </div>
      </MarketingContainer>
    </section>
  );
}
