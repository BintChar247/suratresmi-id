import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Use service role key directly — webhook has no user session
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function verifyMidtransSignature(
  body: Record<string, string>,
  signature: string
): boolean {
  const orderId = body.order_id;
  const statusCode = body.status_code;
  const grossAmount = body.gross_amount;
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;

  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');

  return hash === signature;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-midtrans-signature');

    if (!signature || !verifyMidtransSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const orderId = body.order_id as string;
    const status = body.transaction_status as string;

    const supabase = getSupabase();

    // Get transaction
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('midtrans_order_id', orderId)
      .single();

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Idempotency: ignore if already processed
    if (transaction.status !== 'pending') {
      return NextResponse.json({ ok: true });
    }

    if (['settlement', 'capture'].includes(status)) {
      // Credit user atomically via RPC
      await supabase.rpc('credit_user', {
        p_user_id: transaction.user_id,
        p_amount: transaction.credits_delta,
      });

      // Update transaction status
      await supabase
        .from('transactions')
        .update({ status: 'success' })
        .eq('id', transaction.id);

      // TODO: Send success email via Resend API
    } else if (['deny', 'expire', 'cancel'].includes(status)) {
      await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);

      // TODO: Send failure email with retry link
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
