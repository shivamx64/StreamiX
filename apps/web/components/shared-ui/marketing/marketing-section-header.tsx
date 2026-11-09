import { cn } from "@/lib/class-name";

import { MarketingSectionBadge } from "./marketing-section-badge";

type MarketingSectionHeaderProps = {
  badge?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
};

export function MarketingSectionHeader({
  badge,
  title,
  description,
  align = "center",
  className,
  titleClassName,
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
      {badge && <MarketingSectionBadge>{badge}</MarketingSectionBadge>}

      <h2
        className={cn(
          "font-display max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground md:text-4xl lg:text-[2.9rem] lg:leading-[1.08]",
          badge && "mt-5",
          titleClassName,
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground md:text-lg md:leading-8",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
