import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="px-6 pb-24 md:px-10 md:pb-32 lg:px-12">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-orange-500 px-6 py-20 text-center shadow-xl shadow-primary/20 md:px-16 md:py-24">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            <Sparkles className="h-3.5 w-3.5" />
            Get Started
          </div>

          <h2 className="mx-auto mt-8 max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            Ready to start streaming?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/80 md:text-lg">
            Create a free account and upload your first video in minutes.
            Your content will be processing before you finish your coffee.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-white text-primary shadow-sm hover:bg-white/90"
            >
              <Link href="/signup">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
            >
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}