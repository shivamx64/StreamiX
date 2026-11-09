import {
  ArrowUpRight,
  Braces,
  KeyRound,
  SquareTerminal,
} from "lucide-react";
import Link from "next/link";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionBadge } from "@/components/shared-ui/marketing/marketing-section-badge";
import { Reveal } from "@/components/shared-ui/reveal";

const developerNotes = [
  {
    title: "Predictable REST endpoints",
    description:
      "Upload, list, inspect, and delete videos over HTTP. Status polling is a first-class endpoint, not a workaround.",
    icon: Braces,
  },
  {
    title: "Session-aware media",
    description:
      "Request HLS and thumbnails with the same bearer session used by the dashboard. Media routes enforce video ownership.",
    icon: KeyRound,
  },
  {
    title: "No proprietary SDK",
    description:
      "Use curl, fetch, hls.js, or the dashboard. The pipeline speaks HTTP and writes standard HLS playlists.",
    icon: SquareTerminal,
  },
];

export function DeveloperSection() {
  return (
    <MarketingSection
      id="developers"
      className="border-b border-border/70 bg-muted/20"
    >
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <MarketingSectionBadge>Developer surface</MarketingSectionBadge>

          <h2 className="font-display mt-5 max-w-lg text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground md:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
            Read the job. Control the flow.
          </h2>

          <p className="mt-5 max-w-md text-pretty text-base leading-7 text-muted-foreground">
            The pipeline is exposed through small, explicit endpoints. You can
            build your own client without reverse-engineering the dashboard.
          </p>

          <div className="mt-9 border-t border-border">
            {developerNotes.map((note) => (
              <div
                key={note.title}
                className="flex gap-3.5 border-b border-border py-5"
              >
                <note.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <h3 className="text-[13px] font-medium text-foreground">
                    {note.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                    {note.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/docs"
            className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary transition-colors hover:text-primary/80"
          >
            API documentation
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Reveal delay={0.08} className="min-w-0">
          <div className="w-full min-w-0 overflow-hidden rounded-lg border border-stone-800 bg-[#171512] shadow-[0_24px_80px_-40px_rgba(28,25,23,0.55)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone-500">
                  upload.sh
                </span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-stone-500">
                REST · BEARER
              </span>
            </div>

            <div className="overflow-x-auto p-4 md:p-5">
              <pre className="min-w-[34rem] font-mono text-[10px] leading-6 text-stone-300 md:text-[11px]">
                <code>
                  <span className="text-stone-500">$</span> curl -X POST
                  http://localhost:8080/api/v1/videos \{"\n"}
                  {"  "}-H{" "}
                  <span className="text-emerald-400">
                    &quot;Authorization: Bearer $STREAMIX_TOKEN&quot;
                  </span>{" "}
                  \{"\n"}
                  {"  "}-F{" "}
                  <span className="text-emerald-400">
                    &quot;file=@demo-reel.mp4&quot;
                  </span>
                  {"\n\n"}
                  <span className="text-stone-500">
                    # 201 Created
                  </span>
                  {"\n"}
                  {"{"}
                  {"\n"}
                  {"  "}
                  <span className="text-sky-400">
                    &quot;success&quot;
                  </span>
                  : true,{"\n"}
                  {"  "}
                  <span className="text-sky-400">
                    &quot;message&quot;
                  </span>
                  :{" "}
                  <span className="text-emerald-400">
                    &quot;video uploaded successfully&quot;
                  </span>
                  ,{"\n"}
                  {"  "}
                  <span className="text-sky-400">
                    &quot;data&quot;
                  </span>
                  : {"{"}
                  {"\n"}
                  {"    "}
                  <span className="text-sky-400">
                    &quot;id&quot;
                  </span>
                  :{" "}
                  <span className="text-emerald-400">
                    &quot;7f4c2e1a-...&quot;
                  </span>
                  ,{"\n"}
                  {"    "}
                  <span className="text-sky-400">
                    &quot;status&quot;
                  </span>
                  :{" "}
                  <span className="text-amber-300">
                    &quot;queued&quot;
                  </span>
                  {"\n"}
                  {"  "}
                  {"}"}
                  {"\n"}
                  {"}"}
                </code>
              </pre>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/15 px-4 py-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[8px] uppercase tracking-[0.1em] text-stone-500">
                <span className="text-stone-300">POST /videos</span>
                <span>GET /videos/:id/status</span>
                <span>GET /videos/:id/hls/*path</span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-emerald-400">
                Ready
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </MarketingSection>
  );
}
