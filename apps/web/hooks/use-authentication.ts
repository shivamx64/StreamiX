"use client";

import axios from "axios";
import { useCallback, useState } from "react";

import { authenticationService } from "@/services/authentication-service";
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
} from "@/types/authentication-types";

const TOKEN_STORAGE_KEY = "streamix-auth-tokens";

type TokenState = AuthTokens | null;

function readStoredTokens(): TokenState {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthTokens) : null;
  } catch {
    return null;
  }
}

function readApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as
      | { error?: { message?: string } }
      | undefined;
    const message = payload?.error?.message;
    if (message) return message;
  }

  return "Something went wrong. Please try again.";
}

export function useAuthentication() {
  const [tokens, setTokens] = useState<TokenState>(readStoredTokens);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistTokens = useCallback((next: TokenState) => {
    setTokens(next);

    if (next) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (request: LoginRequest): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await authenticationService.login(request);
        persistTokens(result);
        return true;
      } catch (caught) {
        setError(readApiErrorMessage(caught));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [persistTokens],
  );

  const register = useCallback(
    async (request: RegisterRequest): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);

      try {
        await authenticationService.register(request);
        const result = await authenticationService.login({
          email: request.email,
          password: request.password,
        });
        persistTokens(result);
        return true;
      } catch (caught) {
        setError(readApiErrorMessage(caught));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [persistTokens],
  );

  const logout = useCallback(async () => {
    // Revoke the refresh token server-side. Local logout always
    // proceeds, even if the revocation request fails.
    try {
      if (tokens?.refreshToken) {
        await authenticationService.logout(tokens.refreshToken);
      }
    } catch {
      // ignore: local state is cleared regardless
    } finally {
      persistTokens(null);
      setError(null);
    }
  }, [persistTokens, tokens]);

  return {
    tokens,
    isSubmitting,
    error,
    login,
    register,
    logout,
  };
}