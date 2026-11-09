import { cn } from "@/lib/class-name";

type MarketingSectionHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingSectionHeading({
  children,
  className,
}: MarketingSectionHeadingProps) {
  return (
    <h1
      className={cn(
        "font-display text-balance text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl lg:text-[5.25rem]",
        className,
      )}
    >
      {children}
    </h1>
  );
}
