import type { ReactNode } from "react";

type AuthFormCardProps = {
  children: ReactNode;
};

export function AuthFormCard({ children }: AuthFormCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">
      {children}
    </div>
  );
}