import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/class-name";

type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "link";

type ButtonSize =
  | "default"
  | "sm"
  | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",

  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",

  outline:
    "border border-border bg-background hover:bg-accent hover:text-accent-foreground",

  ghost:
    "hover:bg-accent hover:text-accent-foreground",

  link:
    "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 text-sm",

  sm: "h-9 px-3 text-sm",

  lg: "h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
