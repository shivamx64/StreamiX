"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/shared-ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthenticationContext } from "@/providers/authentication-provider";

export function NavigationActions() {
  const { tokens, isReady } = useAuthenticationContext();
  const isAuthenticated = isReady && Boolean(tokens);

  return (
    <div className="hidden items-center gap-2 md:flex">
      <ThemeToggle className="h-9 w-9" />

      {isAuthenticated ? (
        <Button asChild size="sm" className="ml-1">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>

          <Button asChild size="sm" className="ml-1">
            <Link href="/signup">Get started</Link>
          </Button>
        </>
      )}
    </div>
  );
}
