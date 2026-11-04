import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/class-name";

type MetricTone = "default" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<MetricTone, string> = {
  default: "bg-accent text-accent-foreground",
  success: "bg-success-soft text-success-soft-foreground",
  warning: "bg-warning-soft text-warning-soft-foreground",
  danger: "bg-danger-soft text-danger-soft-foreground",
  info: "bg-info-soft text-info-soft-foreground",
};

type Metric = {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  tone?: MetricTone;
};

type MetricStripProps = {
  metrics: Metric[];
};

export function MetricStrip({ metrics }: MetricStripProps) {
  return (
    <Card className="grid grid-cols-1 divide-y divide-border/60 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
      {metrics.map(({ label, value, sublabel, icon: Icon, tone = "default" }) => (
        <div key={label} className="group flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {label}
            </p>

            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md",
                toneClasses[tone],
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          </div>

          <p className="font-display text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </p>

          <p
            className={cn(
              "truncate text-xs text-muted-foreground",
              !sublabel && "opacity-0",
            )}
            aria-hidden={!sublabel}
          >
            {sublabel ?? "—"}
          </p>
        </div>
      ))}
    </Card>
  );
}
