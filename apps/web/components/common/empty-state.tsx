import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="border rounded-xl bg-white p-12 text-center">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 text-neutral-500">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}