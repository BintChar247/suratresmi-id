const RESEND_API = 'https://api.resend.com/emails';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? 'SuratResmi <support@suratresmi.online>';

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping email send.');
    return;
  }

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    console.error('Resend send failed:', res.status, await res.text());
  }
}

interface TicketConfirmationPayload {
  email: string;
  ticketId: string;
  subject: string;
  category: string;
  priority: string;
}

export async function sendTicketConfirmationEmail(
  params: TicketConfirmationPayload
): Promise<void> {
  const { email, ticketId, subject, category, priority } = params;

  const slaNote =
    priority === 'urgent'
      ? 'Tiket Anda URGENT — tim akan merespons dalam 1 jam (Senin–Jumat 09.00–18.00 WIB).'
      : priority === 'high'
        ? 'Tim akan merespons dalam 4 jam pada jam kerja.'
        : 'Tim akan merespons dalam 1x24 jam pada jam kerja.';

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
      <h2 style="margin: 0 0 16px;">Tiket Support Diterima</h2>
      <p>Halo, terima kasih telah menghubungi SuratResmi. Tiket Anda telah kami terima dengan detail:</p>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 4px 12px 4px 0; color: #666;">ID Tiket</td><td style="padding: 4px 0;"><code>${ticketId}</code></td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #666;">Subjek</td><td style="padding: 4px 0;">${escapeHtml(subject)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #666;">Kategori</td><td style="padding: 4px 0;">${category}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #666;">Prioritas</td><td style="padding: 4px 0;">${priority}</td></tr>
      </table>
      <p>${slaNote}</p>
      <p style="color: #666; font-size: 13px; margin-top: 24px;">Balas email ini jika ada informasi tambahan. Mohon sertakan ID tiket di atas.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `[SuratResmi] Tiket #${ticketId.slice(0, 8)} — ${subject}`,
    html,
  });
}

interface B2BOutreachPayload {
  to: string;
  contactName: string;
  companyName: string;
  senderName: string;
  demoCalendarUrl: string;
}

/**
 * Cold-outreach template for HR managers / ops leads at companies that produce
 * many letters per month. Sent manually from the admin panel — never automated.
 */
export async function sendB2BOutreachEmail(params: B2BOutreachPayload): Promise<void> {
  const { to, contactName, companyName, senderName, demoCalendarUrl } = params;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
      <p>Halo ${escapeHtml(contactName)},</p>

      <p>
        Banyak tim HR di ${escapeHtml(companyName)} masih menyusun surat resmi secara manual.
        Hasilnya: 1&ndash;2 jam untuk satu perjanjian kerja, plus revisi bolak-balik.
      </p>

      <p><strong>SuratResmi.Online paket Enterprise</strong> bisa membantu:</p>
      <ul style="padding-left: 20px; line-height: 1.7;">
        <li>100+ surat per bulan (tanpa batas template)</li>
        <li>Kop surat custom dengan logo perusahaan</li>
        <li>Hingga 10 anggota tim</li>
        <li>API &amp; integrasi HRIS (roadmap Q3)</li>
        <li>Support prioritas via WhatsApp</li>
      </ul>

      <p>
        Bisa jadwalkan demo 20 menit minggu ini?
        <a href="${escapeHtml(demoCalendarUrl)}" style="color: #2563eb;">${escapeHtml(demoCalendarUrl)}</a>
      </p>

      <p>Salam,<br/>${escapeHtml(senderName)}<br/>SuratResmi.Online</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">
        Email ini dikirim sebagai outreach B2B. Balas &ldquo;UNSUBSCRIBE&rdquo; untuk berhenti menerima.
      </p>
    </div>
  `;

  await sendEmail({
    to,
    subject: `${companyName}: bikin 100+ surat resmi per bulan dalam hitungan menit`,
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
