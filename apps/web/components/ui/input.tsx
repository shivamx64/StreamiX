import * as React from "react";

import { cn } from "@/lib/class-name";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type, ...props }, ref) {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-foreground caret-primary placeholder:text-muted-foreground/80 transition aria-invalid:border-danger/70 aria-invalid:focus-visible:ring-danger/30 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";