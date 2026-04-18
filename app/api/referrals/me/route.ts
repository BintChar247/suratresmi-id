import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * GET /api/referrals/me
 * Returns the authenticated user's referral stats:
 *   - invited:        total referred users
 *   - converted:      referred users who completed first purchase
 *   - credits_earned: bonus credits issued so far
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Sesi tidak valid.' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('referrals')
    .select('id, converted_at, reward_granted_at')
    .eq('referrer_id', user.id);

  if (error) {
    console.error('Referrals fetch error:', error);
    return NextResponse.json({ error: 'Gagal memuat statistik.' }, { status: 500 });
  }

  const rows = data ?? [];
  const REWARD_PER_CONVERSION = 3;

  return NextResponse.json({
    invited: rows.length,
    converted: rows.filter((r) => r.converted_at != null).length,
    credits_earned:
      rows.filter((r) => r.reward_granted_at != null).length * REWARD_PER_CONVERSION,
  });
}
