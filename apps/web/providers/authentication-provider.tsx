"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { useAuthentication } from "@/hooks/use-authentication";

type AuthenticationContextValue = ReturnType<typeof useAuthentication>;

const AuthenticationContext = createContext<AuthenticationContextValue | null>(
  null,
);

type AuthenticationProviderProps = {
  children: ReactNode;
};

export function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  const authentication = useAuthentication();

  return (
    <AuthenticationContext.Provider value={authentication}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenticationContext(): AuthenticationContextValue {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "useAuthenticationContext must be used within an AuthenticationProvider",
    );
  }

  return context;
}