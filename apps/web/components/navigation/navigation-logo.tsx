import { Clapperboard } from "lucide-react";
import Link from "next/link";

export function NavigationLogo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
        <Clapperboard className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-foreground">
        StreamiX
      </span>
    </Link>
  );
}
