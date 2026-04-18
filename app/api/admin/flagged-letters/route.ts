import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * GET /api/admin/flagged-letters
 *
 * Admin-only — returns letters that the heuristic moderator auto-flagged
 * for manual review. Requires plan = 'admin' on the requesting user.
 *
 * Encrypted letter content is NOT decrypted here; reviewers fetch a single
 * letter via a separate decrypting endpoint when they need to inspect it.
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

  const { data: actor } = await supabaseAdmin
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (actor?.plan !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('letters')
    .select('id, user_id, type, subtype_id, flagged, flag_reason, api_tokens_used, created_at')
    .eq('flagged', true)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('flagged-letters query error:', error);
    return NextResponse.json({ error: 'Gagal memuat data.' }, { status: 500 });
  }

  return NextResponse.json({ letters: data ?? [] });
}
