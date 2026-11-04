import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/class-name";

type InputErrorProps = {
  children?: React.ReactNode;
  className?: string;
};

export function InputError({
  children,
  className,
}: InputErrorProps) {
  if (!children) return null;

  return (
    <p
      role="alert"
      className={cn(
        "mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger",
        className,
      )}
    >
      <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}
