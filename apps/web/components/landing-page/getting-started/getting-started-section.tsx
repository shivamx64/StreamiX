import { ArrowRight, GitBranch } from "lucide-react";
import Link from "next/link";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionBadge } from "@/components/shared-ui/marketing/marketing-section-badge";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Clone and install",
    description:
      "Fetch the repository, download the Go modules, and install the web workspace.",
    command: `git clone https://github.com/shivamx64/streamix.git
cd streamix
go mod download
pnpm --dir apps/web install`,
  },
  {
    number: "02",
    title: "Prepare state",
    description:
      "Create the database and start Redis. Add the database values and JWT secret to .env at the repo root.",
    command: `createdb streamix
redis-server`,
  },
  {
    number: "03",
    title: "Start API and worker",
    description:
      "Run the API and worker in separate terminals from the repository root. Uploaded jobs will flow through the queue automatically.",
    command: `go run ./apps/api/cmd/api
go run ./apps/api/worker/cmd/worker`,
  },
  {
    number: "04",
    title: "Open the app",
    description:
      "Start the Next.js app. It expects the API at localhost:8080/api/v1 by default.",
    command: `pnpm --dir apps/web dev`,
  },
];

export function GettingStartedSection() {
  return (
    <MarketingSection id="start" className="border-b border-border/70">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <MarketingSectionBadge>Getting started</MarketingSectionBadge>

          <h2 className="font-display mt-5 max-w-md text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground md:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
            Start with the source.
          </h2>

          <p className="mt-5 max-w-md text-pretty text-base leading-7 text-muted-foreground">
            StreamiX runs locally with PostgreSQL, Redis, FFmpeg, and the two
            Go binaries. There is no hosted account or managed service in the
            setup path.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 px-5">
              <Link href="/signup">
                Create an account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5">
              <Link
                href="https://github.com/shivamx64/StreamiX"
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch className="h-4 w-4" />
                View repository
              </Link>
            </Button>
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Public repository · No hosted dependency
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3 md:px-5">
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Local quickstart
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              4 steps
            </span>
          </div>

          <ol className="divide-y divide-border">
            {steps.map((step) => (
              <li
                key={step.number}
                className="grid gap-4 p-4 md:grid-cols-[2.5rem_1fr] md:p-5"
              >
                <span className="font-mono text-[10px] tracking-[0.16em] text-primary">
                  {step.number}
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[14px] font-semibold tracking-[-0.015em] text-foreground">
                      {step.title}
                    </h3>
                    <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                      shell
                    </span>
                  </div>

                  <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground">
                    {step.description}
                  </p>

                  <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-muted/30 px-3 py-2.5 font-mono text-[10px] leading-5 text-foreground">
                    <code>{step.command}</code>
                  </pre>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-3 md:px-5">
            <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
              requires Go 1.25+, Node 20+, PostgreSQL, Redis, FFmpeg
            </p>
            <Link
              href="/docs"
              className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary transition-colors hover:text-primary/80"
            >
              Full setup guide →
            </Link>
          </div>
        </div>
      </div>
    </MarketingSection>
  );
}
