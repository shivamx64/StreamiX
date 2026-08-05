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
        "font-display text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-foreground md:text-6xl lg:text-7xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}
