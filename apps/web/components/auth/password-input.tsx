"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/input";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={`pr-10 ${className ?? ""}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition hover:text-foreground"
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}