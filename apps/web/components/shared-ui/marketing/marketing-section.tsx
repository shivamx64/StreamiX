import type { ReactNode } from "react";

import { cn } from "@/lib/class-name";

import { MarketingContainer } from "./marketing-container";

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
      className={cn("relative py-20 md:py-28 lg:py-32", className)}
    >
      <MarketingContainer>{children}</MarketingContainer>
    </section>
  );
}
