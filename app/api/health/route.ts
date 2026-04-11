import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(): Promise<NextResponse> {
  const checks: Record<string, boolean> = {
    api: true,
    database: false,
  };

  // Lightweight DB ping
  try {
    const { error } = await supabaseAdmin
      .from('templates')
      .select('id', { head: true, count: 'exact' })
      .limit(1);
    checks.database = !error;
  } catch {
    checks.database = false;
  }

  const allHealthy = Object.values(checks).every(Boolean);

  return NextResponse.json(
    { status: allHealthy ? 'ok' : 'degraded', checks, ts: new Date().toISOString() },
    { status: allHealthy ? 200 : 503 }
  );
}
