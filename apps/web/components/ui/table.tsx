import type {
  HTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";

import { cn } from "@/lib/class-name";

type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full min-w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

type THeadProps = HTMLAttributes<HTMLTableSectionElement>;

export function THead({ className, ...props }: THeadProps) {
  return <thead className={cn("", className)} {...props} />;
}

type TBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export function TBody({ className, ...props }: TBodyProps) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

type TRProps = HTMLAttributes<HTMLTableRowElement>;

export function TR({ className, ...props }: TRProps) {
  return (
    <tr
      className={cn(
        "border-b border-border/60 transition-colors hover:bg-muted/40",
        className,
      )}
      {...props}
    />
  );
}

type THProps = ThHTMLAttributes<HTMLTableCellElement>;

export function TH({ className, ...props }: THProps) {
  return (
    <th
      className={cn(
        "h-11 px-4 text-left align-middle text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type TDProps = TdHTMLAttributes<HTMLTableCellElement>;

export function TD({ className, ...props }: TDProps) {
  return (
    <td
      className={cn("px-4 py-3.5 align-middle", className)}
      {...props}
    />
  );
}
