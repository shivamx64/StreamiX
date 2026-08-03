import type { ReactNode } from "react";

import { cn } from "@/lib/class-name";

type MarketingSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function MarketingSection({
  id,
  className,
  children,
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-24 md:py-32",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
        {children}
      </div>
    </section>
  );
}
