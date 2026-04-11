const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

type Severity = 'critical' | 'warning' | 'info';

const EMOJI: Record<Severity, string> = {
  critical: '🔴',
  warning: '🟡',
  info: 'ℹ️',
};

export async function sendTelegramAlert(
  title: string,
  message: string,
  severity: Severity = 'info'
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const text = `${EMOJI[severity]} *${title}*\n\n${message}\n\n_${new Date().toISOString()}_`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );
    if (!res.ok) {
      console.error('Telegram alert failed:', res.status, await res.text());
    }
  } catch (error) {
    console.error('Failed to send Telegram alert:', error);
  }
}
