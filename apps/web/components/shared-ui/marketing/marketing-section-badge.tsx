import { cn } from "@/lib/class-name";

type MarketingSectionBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingSectionBadge({
  children,
  className,
}: MarketingSectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-primary" />
      {children}
    </span>
  );
}
