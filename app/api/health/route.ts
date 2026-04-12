import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Authenticate via Bearer token to prevent info disclosure
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { status: 'ok' }, // Generic response for unauthenticated requests
      { status: 200 }
    );
  }

  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json(
      { status: 'ok' },
      { status: 200 }
    );
  }

  // Only authenticated users get detailed health info
  const checks: Record<string, boolean> = {
    api: true,
    database: false,
  };

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
