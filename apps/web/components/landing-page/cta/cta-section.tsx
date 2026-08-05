import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/shared-ui/reveal";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="px-6 pb-24 md:px-10 md:pb-32 lg:px-12">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-md bg-gradient-to-br from-primary to-orange-600 px-6 py-20 text-center shadow-2xl shadow-primary/25 md:px-16 md:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative">
            <h2 className="font-display mx-auto max-w-2xl text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Ready to start streaming?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-7 text-white/80 md:text-lg">
              Create a free account and upload your first video in minutes.
              Your content will be processing before you finish your coffee.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="group bg-white text-primary shadow-sm hover:bg-white/90"
              >
                <Link href="/signup">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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

            <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
              Free forever for personal projects
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}