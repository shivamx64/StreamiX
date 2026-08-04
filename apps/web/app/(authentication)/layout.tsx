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
  const { tokens } = useAuthenticationContext();

  useEffect(() => {
    if (!tokens) {
      router.replace("/login");
    }
  }, [tokens, router]);

  if (!tokens) {
    return null;
  }

  return <>{children}</>;
}