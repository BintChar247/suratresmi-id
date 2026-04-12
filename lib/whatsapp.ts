const WHATSAPP_PHONE_ID = process.env.WHATSAPP_BUSINESS_PHONE_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_BUSINESS_TOKEN;
const WHATSAPP_API_BASE = 'https://graph.facebook.com/v18.0';

export async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  if (!WHATSAPP_PHONE_ID || !WHATSAPP_TOKEN) {
    console.warn('WhatsApp credentials not configured.');
    return;
  }

  try {
    const res = await fetch(`${WHATSAPP_API_BASE}/${WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      }),
    });

    if (!res.ok) {
      console.error('WhatsApp send failed:', res.status, await res.text());
    }
  } catch (error) {
    console.error('WhatsApp send error:', error);
  }
}

// ─── FAQ keyword matching ────────────────────────────────────────────────────

const FAQ_RESPONSES: Record<string, string> = {
  'cara buat surat': 'Buka aplikasi → pilih jenis surat → isi data → download PDF. Mudah!',
  'cara bayar': 'Kami menerima QRIS, transfer bank, e-wallet (GoPay, OVO, Dana). Pilih saat checkout.',
  'surat saya error': 'Periksa kembali isi surat. Jika ada kesalahan, coba buat ulang atau hubungi support.',
  refund: 'Hubungi support dengan detail pesanan. Refund diproses dalam 3-5 hari kerja.',
  'akun bermasalah': 'Coba logout dan login ulang. Jika masih bermasalah, hubungi support di sini.',
  harga: 'Paket mulai Rp 5.000 (hemat), Rp 15.000 (standar), Rp 25.000 (profesional). Cek di halaman kredit.',
  materai: 'Beberapa surat memerlukan materai Rp 10.000 untuk keabsahan hukum. Kami akan memberi tahu jika perlu.',
};

function matchFAQ(query: string): string | null {
  const lower = query.toLowerCase();
  for (const [keyword, answer] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(keyword)) return answer;
  }
  return null;
}

// ─── Webhook handler ─────────────────────────────────────────────────────────

interface WhatsAppWebhookEntry {
  changes?: {
    value?: {
      messages?: { from: string; text?: { body: string } }[];
    };
  }[];
}

interface WhatsAppWebhookPayload {
  entry?: WhatsAppWebhookEntry[];
}

export async function handleWhatsAppWebhook(payload: WhatsAppWebhookPayload): Promise<void> {
  const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return;

  const phoneNumber = message.from;
  const text = message.text?.body ?? '';

  const faqAnswer = matchFAQ(text);

  if (faqAnswer) {
    await sendWhatsAppMessage(phoneNumber, faqAnswer);
  } else {
    await sendWhatsAppMessage(
      phoneNumber,
      'Terima kasih! Pesan Anda telah diterima. Tim support akan merespons segera dalam 1x24 jam. Untuk pertanyaan umum, kunjungi suratresmi.id/bantuan'
    );
  }
}
