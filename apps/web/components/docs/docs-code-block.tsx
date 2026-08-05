"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/class-name";

type DocsCodeBlockProps = {
  code: string;
  label?: string;
  className?: string;
};

export function DocsCodeBlock({
  code,
  label = "bash",
  className,
}: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — ignore.
    }
  };

  return (
    <div
      className={cn(
        "mt-4 overflow-hidden rounded-md border border-border bg-muted/40",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Terminal className="h-3.5 w-3.5" />
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
        >
          {copied
            ? <Check className="h-3.5 w-3.5 text-primary" />
            : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
}
