import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroActions() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button size="lg" asChild>
        <Link href="/signup">
          Start Building
        </Link>
      </Button>

      <Button
        size="lg"
        variant="outline"
        asChild
      >
        <Link href="/docs">
          Documentation
        </Link>
      </Button>
    </div>
  );
}