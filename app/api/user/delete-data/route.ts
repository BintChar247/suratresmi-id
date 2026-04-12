import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * DELETE /api/user/delete-data
 *
 * UU PDP (UU No. 27/2022) — Right to Erasure
 * Deletes all personal data associated with the authenticated user:
 *   - letters (contains encrypted PII: KTP, names, addresses)
 *   - transactions (financial history)
 *   - support_tickets
 *   - audit_log entries (actor_id references)
 *   - the users row itself
 *
 * The Supabase auth.users record is NOT deleted here — the user can still
 * sign in but will have a fresh state. To fully delete the auth account,
 * the user should also revoke OAuth access from their Google account.
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
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

  const userId = user.id;

  try {
    // Log the erasure request before deleting (compliance audit trail)
    await supabaseAdmin.from('audit_log').insert({
      actor_id: userId,
      actor_type: 'user',
      action: 'data_erasure_request',
      resource_type: 'user',
      resource_id: userId,
      metadata: { email_hash: hashEmail(user.email ?? '') },
    });

    // Delete in dependency order (FK constraints)
    await supabaseAdmin.from('support_tickets').delete().eq('user_id', userId);
    await supabaseAdmin.from('letters').delete().eq('user_id', userId);
    await supabaseAdmin.from('transactions').delete().eq('user_id', userId);

    // Anonymize audit log entries — keep the log but strip the actor reference
    await supabaseAdmin
      .from('audit_log')
      .update({ actor_id: null, metadata: { redacted: true } })
      .eq('actor_id', userId);

    // Delete the public.users row (cascades from auth.users FK)
    await supabaseAdmin.from('users').delete().eq('id', userId);

    return NextResponse.json({
      success: true,
      message: 'Semua data pribadi Anda telah dihapus sesuai UU PDP.',
    });
  } catch (err) {
    console.error('Data deletion error:', err);
    return NextResponse.json(
      { error: 'Gagal menghapus data. Hubungi dpo@suratresmi.id.' },
      { status: 500 }
    );
  }
}

/** One-way hash for audit trail (we keep proof of erasure without storing the email) */
function hashEmail(email: string): string {
  const { createHash } = require('crypto') as typeof import('crypto');
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex').substring(0, 16);
}
