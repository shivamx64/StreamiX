"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type AuthSubmitButtonProps = {
  loading: boolean;
  children: ReactNode;
};

export function AuthSubmitButton({
  loading,
  children,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      loading={loading}
      className="mt-6 h-11 w-full text-[15px]"
    >
      {children}
    </Button>
  );
}
