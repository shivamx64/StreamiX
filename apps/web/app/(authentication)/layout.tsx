"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthenticationContext } from "@/providers/authentication-provider";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const { tokens, isReady } = useAuthenticationContext();

  useEffect(() => {
    if (isReady && !tokens) {
      router.replace("/login");
    }
  }, [isReady, tokens, router]);

  if (!isReady || !tokens) {
    return null;
  }

  return <>{children}</>;
}