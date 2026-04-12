/**
 * GET /api/health
 * Checks all dependencies needed for letter generation.
 * Safe to call unauthenticated — returns no sensitive data.
 */
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Anthropic from '@anthropic-ai/sdk';

interface HealthCheck {
  status: 'ok' | 'error';
  message: string;
}

interface HealthReport {
  overall: 'healthy' | 'degraded';
  checks: Record<string, HealthCheck>;
  timestamp: string;
}

export async function GET(): Promise<NextResponse> {
  const checks: Record<string, HealthCheck> = {};

  // 1. Supabase connectivity
  try {
    const { error } = await supabaseAdmin
      .from('templates')
      .select('id', { count: 'exact', head: true });
    checks.supabase = error
      ? { status: 'error', message: error.message }
      : { status: 'ok', message: 'Connected' };
  } catch (e) {
    checks.supabase = { status: 'error', message: String(e) };
  }

  // 2. Templates seeded
  try {
    const { count } = await supabaseAdmin
      .from('templates')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    checks.templates = (count ?? 0) > 0
      ? { status: 'ok', message: `${count} active templates` }
      : { status: 'error', message: 'No templates — run scripts/seed-templates-part1/2/3.sql' };
  } catch (e) {
    checks.templates = { status: 'error', message: String(e) };
  }

  // 3. debit_credit RPC exists
  try {
    const { error } = await supabaseAdmin.rpc('debit_credit', {
      p_user_id: '00000000-0000-0000-0000-000000000000',
      p_amount: 0,
    });
    const fnMissing =
      error?.message?.includes('Could not find') ||
      error?.message?.includes('function') ||
      error?.code === 'PGRST202';
    checks.debit_credit_rpc = fnMissing
      ? { status: 'error', message: 'RPC missing — run scripts/debit_credit.sql in Supabase' }
      : { status: 'ok', message: 'Function exists' };
  } catch (e) {
    checks.debit_credit_rpc = { status: 'error', message: String(e) };
  }

  // 4. Users table has rows (trigger health)
  try {
    const { count: authCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });
    checks.users_table = (authCount ?? 0) > 0
      ? { status: 'ok', message: `${authCount} users provisioned` }
      : { status: 'error', message: 'No rows in public.users — run scripts/create_user_trigger.sql' };
  } catch (e) {
    checks.users_table = { status: 'error', message: String(e) };
  }

  // 5. Anthropic API key reachable
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    checks.anthropic = { status: 'error', message: 'ANTHROPIC_API_KEY not set' };
  } else {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'ping' }],
      });
      checks.anthropic = { status: 'ok', message: `Key valid (${anthropicKey.slice(0, 10)}...)` };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      checks.anthropic = { status: 'error', message: msg };
    }
  }

  // 6. Env vars present
  const missing = (
    ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'ANTHROPIC_API_KEY'] as const
  ).filter((k) => !process.env[k]);
  checks.env_vars = missing.length === 0
    ? { status: 'ok', message: 'All required vars present' }
    : { status: 'error', message: `Missing: ${missing.join(', ')}` };

  const hasError = Object.values(checks).some((c) => c.status === 'error');
  const overall: HealthReport['overall'] = hasError ? 'degraded' : 'healthy';

  return NextResponse.json(
    { overall, checks, timestamp: new Date().toISOString() } satisfies HealthReport,
    { status: hasError ? 207 : 200 }
  );
}
