import { cn } from "@/lib/class-name";

type DocsHeadingProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export function DocsHeading({
  id,
  children,
  className,
}: DocsHeadingProps) {
  return (
    <h2
      id={id}
      className={cn(
        "mt-14 scroll-mt-28 border-b border-border pb-3 text-2xl font-bold tracking-tight text-foreground first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  );
}
