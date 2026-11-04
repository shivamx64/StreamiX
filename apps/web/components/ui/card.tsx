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
        "rounded-lg border border-border/80 bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
