const disallowedDestinations = ["/login", "/signup"];

export function safeRedirectPath(value: string | null | undefined): string | null {
  if (!value) return null;

  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  if (disallowedDestinations.some((path) => value.startsWith(path))) {
    return null;
  }

  return value;
}

export function loginRedirectPath(nextPath: string): string {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}
