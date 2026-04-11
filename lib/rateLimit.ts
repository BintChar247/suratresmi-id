import { supabaseAdmin } from './supabaseAdmin';

/**
 * Per-user rate limiting backed by audit_log.
 * Returns true if the user is within the allowed limit, false if rate limited.
 */
export async function checkUserRateLimit(
  userId: string,
  limit = 5,
  windowSeconds = 60
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count, error } = await supabaseAdmin
    .from('audit_log')
    .select('*', { count: 'exact', head: true })
    .eq('actor_id', userId)
    .eq('action', 'letter_generate')
    .gte('created_at', windowStart);

  if (error) {
    // Fail open: if audit_log can't be queried, don't block the user
    console.error('Rate limit check failed:', error);
    return true;
  }

  return (count ?? 0) < limit;
}
