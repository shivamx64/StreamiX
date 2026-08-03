type MarketingSectionContainerProps = {
  children: React.ReactNode;
  className?: string;
};

import { cn } from "@/lib/class-name";

export function MarketingSectionContainer({
  children,
  className,
}: MarketingSectionContainerProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12",
        className,
      )}
    >
      {children}
    </section>
  );
}