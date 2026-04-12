import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type TicketCategory = 'payment' | 'letter_quality' | 'account' | 'bug' | 'legal' | 'other';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface CreateTicketBody {
  category: TicketCategory;
  subject: string;
  description: string;
  related_letter_id?: string;
  related_transaction_id?: string;
}

function categorizePriority(category: TicketCategory): TicketPriority {
  const priorityMap: Record<TicketCategory, TicketPriority> = {
    payment: 'high',
    letter_quality: 'medium',
    bug: 'high',
    legal: 'urgent',
    account: 'medium',
    other: 'low',
  };
  return priorityMap[category];
}

const VALID_CATEGORIES = new Set<TicketCategory>([
  'payment',
  'letter_quality',
  'account',
  'bug',
  'legal',
  'other',
]);

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Authenticate
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
    return NextResponse.json({ error: 'Sesi tidak valid atau sudah berakhir.' }, { status: 401 });
  }

  // 2. Parse body
  let body: CreateTicketBody;
  try {
    body = (await request.json()) as CreateTicketBody;
  } catch {
    return NextResponse.json({ error: 'Body permintaan tidak valid.' }, { status: 400 });
  }

  const { category, subject, description, related_letter_id, related_transaction_id } = body;

  // 3. Validate
  if (!category || !VALID_CATEGORIES.has(category)) {
    return NextResponse.json(
      { error: `Kategori tidak valid. Pilih: ${[...VALID_CATEGORIES].join(', ')}` },
      { status: 400 }
    );
  }
  if (!subject?.trim() || subject.trim().length < 5) {
    return NextResponse.json(
      { error: 'Subject minimal 5 karakter.' },
      { status: 400 }
    );
  }
  if (!description?.trim() || description.trim().length < 10) {
    return NextResponse.json(
      { error: 'Deskripsi minimal 10 karakter.' },
      { status: 400 }
    );
  }
  if (subject.trim().length > 200) {
    return NextResponse.json({ error: 'Subject maksimal 200 karakter.' }, { status: 400 });
  }
  if (description.trim().length > 2000) {
    return NextResponse.json({ error: 'Deskripsi maksimal 2000 karakter.' }, { status: 400 });
  }

  // 4. Insert ticket
  const { data: ticket, error: insertError } = await supabaseAdmin
    .from('support_tickets')
    .insert({
      user_id: user.id,
      category,
      subject: subject.trim(),
      description: description.trim(),
      status: 'open',
      priority: categorizePriority(category),
      ...(related_letter_id ? { related_letter_id } : {}),
      ...(related_transaction_id ? { related_transaction_id } : {}),
    })
    .select()
    .single();

  if (insertError) {
    console.error('Ticket insert error:', insertError);
    return NextResponse.json({ error: 'Gagal membuat tiket support.' }, { status: 500 });
  }

  // 5. Audit log (fire-and-forget)
  void supabaseAdmin.from('audit_log').insert({
    actor_id: user.id,
    actor_type: 'user',
    action: 'support_ticket_create',
    resource_type: 'support_ticket',
    resource_id: ticket.id as string,
    metadata: { category, priority: ticket.priority },
  });

  // 6. TODO: Send confirmation email via Resend
  //    await sendTicketConfirmationEmail(user.email, ticket);

  return NextResponse.json(ticket, { status: 201 });
}
