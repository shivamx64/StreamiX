"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthenticationContext } from "@/providers/authentication-provider";

type GuestRouteGuardProps = {
  children: React.ReactNode;
};

export function GuestRouteGuard({ children }: GuestRouteGuardProps) {
  const router = useRouter();
  const { tokens, isReady } = useAuthenticationContext();
  const isAuthenticated = isReady && Boolean(tokens);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return children;
}
