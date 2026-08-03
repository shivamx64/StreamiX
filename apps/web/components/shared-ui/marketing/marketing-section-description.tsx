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
        "max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl",
        className,
      )}
    >
      {children}
    </p>
  );
}
