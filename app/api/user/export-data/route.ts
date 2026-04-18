import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { decrypt, decryptJSON, isEncrypted } from '@/lib/encryption';

/**
 * GET /api/user/export-data
 *
 * UU PDP (UU No. 27/2022) — Right of Access / Data Portability
 * Returns all personal data associated with the authenticated user as JSON.
 * Encrypted fields (input_data, content) are decrypted for the export.
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

  const userId = user.id;

  try {
    // Fetch all user data in parallel
    const [profileResult, lettersResult, transactionsResult, ticketsResult] = await Promise.all([
      supabaseAdmin.from('users').select('*').eq('id', userId).single(),
      supabaseAdmin.from('letters').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabaseAdmin.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabaseAdmin.from('support_tickets').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    // Decrypt letter content and input_data for the export
    const letters = (lettersResult.data ?? []).map((letter) => ({
      ...letter,
      content: safeDecrypt(letter.content as string),
      input_data: safeDecryptJSON(letter.input_data),
    }));

    const exportData = {
      exported_at: new Date().toISOString(),
      format_version: '1.0',
      data_controller: 'SuratResmi.Online',
      legal_basis: 'UU No. 27/2022 tentang Pelindungan Data Pribadi',
      profile: profileResult.data,
      letters,
      transactions: transactionsResult.data ?? [],
      support_tickets: ticketsResult.data ?? [],
    };

    // Log the export for audit compliance
    void supabaseAdmin.from('audit_log').insert({
      actor_id: userId,
      actor_type: 'user',
      action: 'data_export_request',
      resource_type: 'user',
      resource_id: userId,
      metadata: {
        letters_count: letters.length,
        transactions_count: (transactionsResult.data ?? []).length,
      },
    });

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="suratresmi-data-export-${Date.now()}.json"`,
      },
    });
  } catch (err) {
    console.error('Data export error:', err);
    return NextResponse.json(
      { error: 'Gagal mengekspor data. Hubungi dpo@suratresmi.online.' },
      { status: 500 }
    );
  }
}

/** Decrypt a string field, falling back to the raw value for unencrypted legacy data. */
function safeDecrypt(value: string): string {
  if (!value || !isEncrypted(value)) return value;
  try {
    return decrypt(value);
  } catch {
    return value;
  }
}

/** Decrypt a JSON field, falling back to the raw value for unencrypted legacy data. */
function safeDecryptJSON(value: unknown): unknown {
  if (typeof value === 'string' && isEncrypted(value)) {
    try {
      return decryptJSON(value);
    } catch {
      return value;
    }
  }
  return value;
}
