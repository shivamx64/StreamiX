import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/class-name";

type StatCardTone = "default" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<StatCardTone, string> = {
  default: "bg-accent text-accent-foreground",
  success: "bg-success-soft text-success-soft-foreground",
  warning: "bg-warning-soft text-warning-soft-foreground",
  danger: "bg-danger-soft text-danger-soft-foreground",
  info: "bg-info-soft text-info-soft-foreground",
};

type StatCardProps = {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  tone?: StatCardTone;
};

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
          toneClasses[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {label}
        </p>
        {sublabel && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground/80">
            {sublabel}
          </p>
        )}
      </div>
    </Card>
  );
}