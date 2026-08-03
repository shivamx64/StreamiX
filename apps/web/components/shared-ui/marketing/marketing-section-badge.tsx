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
        "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-primary"
      />
      {children}
    </span>
  );
}
