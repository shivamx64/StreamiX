import type { InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/input";
import { InputError } from "@/components/ui/input-error";
import { Label } from "@/components/ui/label";

type AuthNameFieldProps = {
  id: string;
  error?: string;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
};

export function AuthNameField({
  id,
  error,
  inputProps,
}: AuthNameFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>Full name</Label>
      <Input
        id={id}
        type="text"
        autoComplete="name"
        placeholder="Ada Lovelace"
        aria-invalid={error ? true : undefined}
        className="mt-2"
        {...inputProps}
      />
      <InputError>{error}</InputError>
    </div>
  );
}