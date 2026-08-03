import * as React from "react";

import { cn } from "@/lib/class-name";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.04] text-card-foreground shadow-sm backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
