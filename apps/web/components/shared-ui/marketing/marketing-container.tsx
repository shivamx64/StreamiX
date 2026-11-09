import type { ReactNode } from "react";

import { cn } from "@/lib/class-name";

type MarketingContainerProps = {
  children: ReactNode;
  className?: string;
};

export function MarketingContainer({
  children,
  className,
}: MarketingContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
