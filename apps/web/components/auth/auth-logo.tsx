import { Clapperboard } from "lucide-react";
import Link from "next/link";

export function AuthLogo() {
  return (
    <Link
      href="/"
      aria-label="StreamiX home"
      className="inline-flex items-center gap-2.5"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <Clapperboard className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="text-xl font-bold tracking-tight text-foreground">
        StreamiX
      </span>
    </Link>
  );
}