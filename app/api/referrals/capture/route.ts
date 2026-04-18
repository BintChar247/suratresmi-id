import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * POST /api/referrals/capture
 * Body: { code: string, source?: string }
 *
 * Called once after a new user's first authenticated session if a referral code
 * was captured from the landing page (?ref=...). Idempotent — if the user is
 * already in the referrals table or self-referring, it no-ops with 200.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
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

  let body: { code?: string; source?: string };
  try {
    body = (await request.json()) as { code?: string; source?: string };
  } catch {
    return NextResponse.json({ error: 'Body tidak valid.' }, { status: 400 });
  }

  const code = body.code?.trim().toLowerCase();
  const source = body.source?.trim().slice(0, 32) ?? null;

  if (!code || !/^[0-9a-f]{8}$/.test(code)) {
    return NextResponse.json({ error: 'Kode referral tidak valid.' }, { status: 400 });
  }

  // Don't re-capture
  const { data: existing } = await supabaseAdmin
    .from('referrals')
    .select('id')
    .eq('referred_id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, captured: false }, { status: 200 });
  }

  // Find referrer by id-prefix match (UUIDs start with 8 hex chars)
  const { data: referrers, error: lookupErr } = await supabaseAdmin
    .from('users')
    .select('id')
    .like('id', `${code}%`)
    .limit(2);

  if (lookupErr) {
    console.error('Referral lookup error:', lookupErr);
    return NextResponse.json({ error: 'Gagal memproses referral.' }, { status: 500 });
  }

  if (!referrers || referrers.length === 0) {
    return NextResponse.json({ ok: true, captured: false }, { status: 200 });
  }

  // Ambiguous prefix — refuse rather than crediting the wrong person
  if (referrers.length > 1) {
    return NextResponse.json({ ok: true, captured: false, reason: 'ambiguous' }, { status: 200 });
  }

  const referrerId = referrers[0].id as string;

  if (referrerId === user.id) {
    return NextResponse.json({ ok: true, captured: false, reason: 'self' }, { status: 200 });
  }

  const { error: insertErr } = await supabaseAdmin.from('referrals').insert({
    referrer_id: referrerId,
    referred_id: user.id,
    source,
  });

  if (insertErr) {
    // Race condition — referred_id is UNIQUE, treat duplicate as success
    if (insertErr.code === '23505') {
      return NextResponse.json({ ok: true, captured: false }, { status: 200 });
    }
    console.error('Referral insert error:', insertErr);
    return NextResponse.json({ error: 'Gagal mencatat referral.' }, { status: 500 });
  }

  await supabaseAdmin.from('users').update({ referred_by: referrerId }).eq('id', user.id);

  void supabaseAdmin.from('audit_log').insert({
    actor_id: user.id,
    actor_type: 'system',
    action: 'referral_captured',
    resource_type: 'user',
    resource_id: user.id,
    metadata: { referrer_id: referrerId, source },
  });

  return NextResponse.json({ ok: true, captured: true }, { status: 201 });
}
