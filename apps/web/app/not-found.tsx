import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clapperboard } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Clapperboard className="h-6 w-6" />
        </span>

        <p className="mt-8 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          404
        </p>

        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-foreground">
          This page does not exist
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The link may be broken, or the page may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back home
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
