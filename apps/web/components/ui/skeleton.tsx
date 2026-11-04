import type { HTMLAttributes } from "react";

import { cn } from "@/lib/class-name";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "shimmer rounded-md bg-muted",
        className,
      )}
      {...props}
    />
  );
}
