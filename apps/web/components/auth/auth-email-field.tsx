import type { InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/input";
import { InputError } from "@/components/ui/input-error";
import { Label } from "@/components/ui/label";

type AuthEmailFieldProps = {
  id: string;
  error?: string;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

export function AuthEmailField({
  id,
  error,
  inputProps,
}: AuthEmailFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>Email</Label>
      <Input
        id={id}
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        className="mt-2"
        {...inputProps}
      />
      <InputError>{error}</InputError>
    </div>
  );
}