import type { InputHTMLAttributes } from "react";

import { Label } from "@/components/ui/label";
import { InputError } from "@/components/ui/input-error";

import { PasswordInput } from "./password-input";

type AuthPasswordFieldProps = {
  id: string;
  label?: string;
  autoComplete?: string;
  error?: string;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

export function AuthPasswordField({
  id,
  label = "Password",
  autoComplete = "current-password",
  error,
  inputProps,
}: AuthPasswordFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <PasswordInput
        id={id}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className="mt-2"
        {...inputProps}
      />
      <InputError>{error}</InputError>
    </div>
  );
}