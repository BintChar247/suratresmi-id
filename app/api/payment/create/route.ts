import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Midtrans from 'midtrans-client';

const snap = new Midtrans.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

const PACKAGES = {
  hemat: { credits: 5, price: 5000, orderId: 'SR-H' },
  standar: { credits: 20, price: 15000, orderId: 'SR-S' },
  profesional: { credits: 50, price: 35000, orderId: 'SR-P' },
} as const;

type PackageId = keyof typeof PACKAGES;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const pkgId = body.package as string;
    const pkg = PACKAGES[pkgId as PackageId];

    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = `${pkg.orderId}-${user.id.slice(0, 8)}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: pkg.price,
      },
      customer_details: {
        email: user.email,
        first_name: user.email?.split('@')[0],
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
        error: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/error`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Log transaction as pending
    await supabase.from('transactions').insert([
      {
        user_id: user.id,
        type: 'purchase',
        credits_delta: pkg.credits,
        amount_idr: pkg.price,
        midtrans_order_id: orderId,
        status: 'pending',
      },
    ]);

    return NextResponse.json({
      snap_token: transaction.token,
      snap_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
