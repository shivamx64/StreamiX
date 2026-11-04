import type { ReactNode } from "react";

type AuthFormCardProps = {
  children: ReactNode;
};

export function AuthFormCard({ children }: AuthFormCardProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-8 shadow-xl shadow-foreground/[0.04] md:p-10">
      {children}
    </div>
  );
}
