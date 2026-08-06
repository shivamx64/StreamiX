import type { ReactNode } from "react";

import { AuthLogo } from "@/components/auth/auth-logo";
import { ThemeToggle } from "@/components/shared-ui/theme-toggle";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/30 px-6 py-12">
      <div className="absolute right-6 top-6">
        <ThemeToggle className="border border-border" />
      </div>

      <AuthLogo />

      <div className="mt-8 w-full max-w-md">
        {children}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} StreamiX, Inc. All rights reserved.
      </p>
    </div>
  );
}