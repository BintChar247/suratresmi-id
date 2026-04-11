import { sendTelegramAlert } from './telegram-alerts';

// Thresholds
const ERROR_RATE_THRESHOLD = 0.1; // 10%
const DAILY_API_COST_THRESHOLD_IDR = 500_000; // Rp 500k
const FREE_TIER_LETTERS_PER_IP_PER_DAY = 20;
const SUPABASE_POOL_THRESHOLD = 0.8; // 80%

export async function checkErrorRate(errorRate: number): Promise<void> {
  if (errorRate > ERROR_RATE_THRESHOLD) {
    await sendTelegramAlert(
      'High API Error Rate',
      `Error rate: ${(errorRate * 100).toFixed(2)}%\n\nCheck Sentry immediately.`,
      'critical'
    );
  }
}

export async function checkDailyApiCost(dailyApiCostIdr: number): Promise<void> {
  if (dailyApiCostIdr > DAILY_API_COST_THRESHOLD_IDR) {
    await sendTelegramAlert(
      'Abnormal API Spending',
      `Daily cost: Rp ${dailyApiCostIdr.toLocaleString('id-ID')}\n\nPossible abuse detected.`,
      'critical'
    );
  }
}

export async function checkMidtransWebhookFailure(failureCount: number): Promise<void> {
  if (failureCount > 0) {
    await sendTelegramAlert(
      'Midtrans Webhook Failure',
      `${failureCount} webhook(s) failed to process. Check payment logs.`,
      'critical'
    );
  }
}

export async function checkFreeTierAbuse(ip: string, lettersToday: number): Promise<void> {
  if (lettersToday > FREE_TIER_LETTERS_PER_IP_PER_DAY) {
    await sendTelegramAlert(
      'Free Tier Abuse Detected',
      `IP ${ip} generated ${lettersToday} letters today (limit: ${FREE_TIER_LETTERS_PER_IP_PER_DAY}).`,
      'warning'
    );
  }
}

export async function checkSupabasePoolUsage(usageRatio: number): Promise<void> {
  if (usageRatio > SUPABASE_POOL_THRESHOLD) {
    await sendTelegramAlert(
      'Supabase Connection Pool High',
      `Pool usage at ${(usageRatio * 100).toFixed(0)}% (threshold: ${SUPABASE_POOL_THRESHOLD * 100}%).`,
      'warning'
    );
  }
}
