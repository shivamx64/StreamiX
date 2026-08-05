import { cn } from "@/lib/class-name";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const methodStyles: Record<HttpMethod, string> = {
  GET: "bg-emerald-100 text-emerald-700",
  POST: "bg-primary/10 text-primary",
  PUT: "bg-blue-100 text-blue-700",
  PATCH: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
};

type DocsEndpointProps = {
  method: HttpMethod;
  path: string;
  description: string;
};

export function DocsEndpoint({
  method,
  path,
  description,
}: DocsEndpointProps) {
  return (
    <div className="mt-4 flex flex-col gap-2 rounded-md border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="flex shrink-0 items-center gap-3 sm:w-72">
        <span
          className={cn(
            "rounded-md px-2.5 py-1 font-mono text-xs font-bold",
            methodStyles[method],
          )}
        >
          {method}
        </span>
        <code className="font-mono text-sm text-foreground">{path}</code>
      </div>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}