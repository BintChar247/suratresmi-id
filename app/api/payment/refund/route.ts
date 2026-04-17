import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Midtrans from 'midtrans-client';

const snap = new Midtrans.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
});

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { transaction_id } = await request.json();

    if (!transaction_id) {
      return NextResponse.json(
        { error: 'transaction_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Get transaction
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transaction_id)
      .single();

    if (!transaction || !transaction.midtrans_order_id) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.status !== 'success') {
      return NextResponse.json(
        { error: 'Only successful transactions can be refunded' },
        { status: 400 }
      );
    }

    // Call Midtrans refund API
    await snap.transaction.refund(transaction.midtrans_order_id);

    // Update transaction status
    await supabase
      .from('transactions')
      .update({ status: 'refunded' })
      .eq('id', transaction_id);

    // Revoke credits atomically via RPC
    await supabase.rpc('debit_credit', {
      p_user_id: transaction.user_id,
      p_amount: transaction.credits_delta,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Refund error:', error);
    return NextResponse.json({ error: 'Refund failed' }, { status: 500 });
  }
}
