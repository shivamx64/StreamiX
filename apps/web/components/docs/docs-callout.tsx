import { Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/class-name";

type DocsCalloutProps = {
  variant?: "info" | "warning";
  children: React.ReactNode;
};

export function DocsCallout({
  variant = "info",
  children,
}: DocsCalloutProps) {
  const Icon = variant === "warning" ? TriangleAlert : Info;

  return (
    <div
      className={cn(
        "mt-4 flex gap-3 rounded-md border p-4 text-sm leading-6",
        variant === "warning"
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : "border-primary/20 bg-primary/5 text-foreground",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0",
          variant === "warning" ? "text-amber-600" : "text-primary",
        )}
      />
      <div>{children}</div>
    </div>
  );
}
