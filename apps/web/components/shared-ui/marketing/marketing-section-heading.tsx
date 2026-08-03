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
        "text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}
