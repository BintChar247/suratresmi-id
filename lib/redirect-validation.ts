/**
 * Validates that a redirect URL is safe — must be relative and not external
 */
export function isValidRedirect(redirect: string | null): boolean {
  if (!redirect) return false;
  // Only allow relative URLs starting with /
  if (!redirect.startsWith('/')) return false;
  // Reject protocol-like patterns (http:, https:, //)
  if (redirect.match(/^\/\/|^[a-z]+:/i)) return false;
  return true;
}

export function getValidRedirect(redirect: string | null, defaultPath: string = '/app'): string {
  return isValidRedirect(redirect) ? redirect : defaultPath;
}
