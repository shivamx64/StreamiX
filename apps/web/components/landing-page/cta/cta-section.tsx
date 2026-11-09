import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionBadge } from "@/components/shared-ui/marketing/marketing-section-badge";
import { Button } from "@/components/ui/button";

const trace = [
  { label: "upload", detail: "source stored", time: "00:00.2" },
  { label: "probe", detail: "metadata ready", time: "00:00.4" },
  { label: "transcode", detail: "3 renditions", time: "00:19.8" },
  { label: "package", detail: "master.m3u8", time: "00:20.1" },
];

export function CtaSection() {
  return (
    <MarketingSection className="relative overflow-hidden bg-[#171512] text-[#f5f1e8] dark:bg-[#141210]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
        <div>
          <MarketingSectionBadge className="text-stone-400">
            Start here
          </MarketingSectionBadge>

          <h2 className="font-display mt-5 max-w-2xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#f5f1e8] md:text-5xl lg:text-6xl">
            From source file
            <br />
            <span className="text-stone-500">to adaptive HLS.</span>
          </h2>

          <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-stone-400">
            Run the pipeline locally, inspect every stage, and connect your own
            client when the dashboard is not the right fit.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 px-5">
              <Link href="/signup">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 border-white/20 bg-transparent px-5 text-[#f5f1e8] hover:bg-white/10 hover:text-white"
            >
              <Link href="/docs">Explore the docs</Link>
            </Button>
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
            Public repository · Self-hosted
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone-400">
              job_01HZX4K8Q2
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              complete
            </span>
          </div>

          <div className="py-2">
            {trace.map((item, index) => (
              <div
                key={item.label}
                className="relative flex items-center gap-3 py-2.5"
              >
                {index < trace.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[0.4375rem] top-7 w-px bg-white/10"
                  />
                )}
                <span className="relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <Check className="h-2 w-2" strokeWidth={3} />
                </span>
                <span className="w-20 font-mono text-[9px] text-stone-300">
                  {item.label}
                </span>
                <span className="flex-1 font-mono text-[8px] text-stone-400">
                  {item.detail}
                </span>
                <span className="font-mono text-[8px] text-stone-400">
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 rounded-md border border-white/10 bg-black/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] text-stone-300">
                master.m3u8
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-stone-400">
                3 variants
              </span>
            </div>
            <div className="mt-2 flex h-1 gap-0.5 overflow-hidden rounded-full">
              <span className="w-1/2 bg-primary/80" />
              <span className="w-1/3 bg-primary/50" />
              <span className="w-1/6 bg-primary/25" />
            </div>
          </div>
        </div>
      </div>
    </MarketingSection>
  );
}
