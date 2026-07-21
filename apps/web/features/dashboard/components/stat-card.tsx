import { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
}: StatCardProps) {
  return (
    <Card className="rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-2 text-sm text-stone-500">
              {subtitle}
            </p>
          )}
        </div>

        {icon}
      </div>
    </Card>
  );
}