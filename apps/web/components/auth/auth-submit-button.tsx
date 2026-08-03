"use client";

import { Loader2 } from "lucide-react";
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
    <Button type="submit" disabled={loading} className="mt-6 w-full">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}