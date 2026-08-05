import { cn } from "@/lib/class-name";

type MarketingSectionDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingSectionDescription({
  children,
  className,
}: MarketingSectionDescriptionProps) {
  return (
    <p
      className={cn(
        "text-pretty text-lg leading-8 text-muted-foreground md:text-xl",
        className,
      )}
    >
      {children}
    </p>
  );
}
