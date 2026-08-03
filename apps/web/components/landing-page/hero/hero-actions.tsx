import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroActions() {
  return (
    <div className="mt-10">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild className="group">
          <Link href="/signup">
            Start Building
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>

        <Button size="lg" variant="outline" asChild>
          <Link href="/docs">
            <Play className="mr-2 h-4 w-4" />
            Documentation
          </Link>
        </Button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Free forever for personal projects · No credit card required
      </p>
    </div>
  );
}