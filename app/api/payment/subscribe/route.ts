import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Midtrans from 'midtrans-client';

const snap = new Midtrans.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

const B2B_PLANS = {
  basic: { price: 99000, seats: 3, label: 'Basic' },
  enterprise: { price: 299000, seats: 10, label: 'Enterprise' },
} as const;

type B2BPlanId = keyof typeof B2B_PLANS;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const planId = body.plan as string;
    const orgId = body.org_id as string;

    const plan = B2B_PLANS[planId as B2BPlanId];
    if (!plan || !orgId) {
      return NextResponse.json(
        { error: 'Invalid plan or missing org_id' },
        { status: 400 }
      );
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

    const orderId = `SR-B2B-${planId.toUpperCase()}-${orgId.slice(0, 8)}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: plan.price,
      },
      customer_details: {
        email: user.email,
        first_name: user.email?.split('@')[0],
      },
      custom_field1: orgId,
      custom_field2: planId,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?type=subscription`,
        error: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/error`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Log subscription transaction
    await supabase.from('transactions').insert([
      {
        user_id: user.id,
        type: 'purchase',
        credits_delta: 0,
        amount_idr: plan.price,
        midtrans_order_id: orderId,
        status: 'pending',
      },
    ]);

    return NextResponse.json({
      snap_token: transaction.token,
      snap_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
