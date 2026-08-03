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
        "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary",
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
