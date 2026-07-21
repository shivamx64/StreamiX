export const ACCESS_TOKEN_KEY = "streamix_access_token";

export const REFRESH_TOKEN_KEY = "streamix_refresh_token";

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
}