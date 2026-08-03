import { cn } from "@/lib/class-name";

import { MarketingSectionBadge } from "./marketing-section-badge";

type MarketingSectionHeaderProps = {
  badge?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function MarketingSectionHeader({
  badge,
  title,
  description,
  align = "center",
  className,
}: MarketingSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center"
          ? "items-center text-center"
          : "items-start text-left",
        className,
      )}
    >
      {badge && (
        <MarketingSectionBadge>
          {badge}
        </MarketingSectionBadge>
      )}

      <h2
        className={cn(
          "max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl",
          badge && "mt-6",
        )}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
