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
    <h2
      className={cn(
        "mt-6 text-5xl font-black tracking-tight text-foreground md:text-6xl lg:text-7xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}