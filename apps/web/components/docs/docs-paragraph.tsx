import { cn } from "@/lib/class-name";

type DocsParagraphProps = {
  children: React.ReactNode;
  className?: string;
};

export function DocsParagraph({
  children,
  className,
}: DocsParagraphProps) {
  return (
    <p className={cn(
      "mt-4 text-base leading-7 text-muted-foreground",
      className,
    )}>
      {children}
    </p>
  );
}
