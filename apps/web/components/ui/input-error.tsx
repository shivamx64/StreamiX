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
        "mt-1.5 text-xs font-medium text-red-600",
        className,
      )}
    >
      {children}
    </p>
  );
}