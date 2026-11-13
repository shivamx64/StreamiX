"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { loginRedirectPath } from "@/lib/navigation";
import { useAuthenticationContext } from "@/providers/authentication-provider";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { tokens, isReady } = useAuthenticationContext();

  useEffect(() => {
    if (isReady && !tokens) {
      const nextPath = `${pathname}${window.location.search}`;
      router.replace(loginRedirectPath(nextPath));
    }
  }, [isReady, tokens, router, pathname]);

  if (!isReady || !tokens) {
    return null;
  }

  return <>{children}</>;
}