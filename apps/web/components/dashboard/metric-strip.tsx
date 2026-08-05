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
        <div key={label} className="flex flex-col gap-1 p-5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-sm",
                toneClasses[tone],
              )}
            >
              <Icon className="h-3 w-3" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {label}
            </p>
          </div>

          <p className="font-display text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>

          {sublabel && (
            <p className="truncate text-xs text-muted-foreground">
              {sublabel}
            </p>
          )}
        </div>
      ))}
    </Card>
  );
}