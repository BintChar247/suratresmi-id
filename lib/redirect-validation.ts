/**
 * Validates that a redirect URL is safe — must be relative and not external.
 * Type predicate so callers get narrowing.
 */
export function isValidRedirect(redirect: string | null): redirect is string {
  if (!redirect) return false;
  // Only allow relative URLs starting with /
  if (!redirect.startsWith('/')) return false;
  // Reject protocol-like patterns (//, http:, javascript:, etc.) and \-prefixed paths
  if (/^\/\/|^[a-z]+:|^\/\\/i.test(redirect)) return false;
  return true;
}

export function getValidRedirect(redirect: string | null, defaultPath: string = '/app'): string {
  return isValidRedirect(redirect) ? redirect : defaultPath;
}
