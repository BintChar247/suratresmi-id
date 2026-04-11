import { sendTelegramAlert } from './telegram-alerts';

interface WeeklyMetrics {
  weekOf: string;
  newUsers: number;
  returningUsers: number;
  totalSessions: number;
  avgSessionDurationSec: number;
  // Funnel
  typeSelected: number;
  subtypeSelected: number;
  formStarted: number;
  letterGenerated: number;
  pdfDownloaded: number;
  paywallHit: number;
  convertedToPaid: number;
  // Revenue
  newPaidUsers: number;
  newPaidLetters: number;
  revenueIdr: number;
  // Errors
  apiErrors: number;
  paymentFailures: number;
  pdfFailures: number;
  // Top letter types
  topTypes: { subtype: string; count: number }[];
  // Support
  supportTickets: number;
  avgResolutionTimeMin: number;
}

function funnelPct(a: number, b: number): string {
  if (b === 0) return '0%';
  return `${((a / b) * 100).toFixed(0)}%`;
}

export function buildWeeklyReport(m: WeeklyMetrics): string {
  const topList = m.topTypes
    .slice(0, 3)
    .map((t, i) => `${i + 1}. ${t.subtype}: ${t.count}`)
    .join('\n');

  const avgMin = Math.floor(m.avgSessionDurationSec / 60);
  const avgSec = m.avgSessionDurationSec % 60;

  return `📊 SuratResmi.id Weekly Report
Week of ${m.weekOf}

📢 METRICS
- New Users: ${m.newUsers}
- Returning Users: ${m.returningUsers}
- Total Sessions: ${m.totalSessions}
- Avg Session Duration: ${avgMin}m ${avgSec}s

🔽 FUNNEL
- Type Selected: ${m.typeSelected} → ${funnelPct(m.subtypeSelected, m.typeSelected)}
- Subtype Selected: ${m.subtypeSelected} → ${funnelPct(m.formStarted, m.subtypeSelected)}
- Form Started: ${m.formStarted} → ${funnelPct(m.letterGenerated, m.formStarted)}
- Letter Generated: ${m.letterGenerated} → ${funnelPct(m.pdfDownloaded, m.letterGenerated)}
- PDF Downloaded: ${m.pdfDownloaded}
- Paywall Hit: ${m.paywallHit} → ${funnelPct(m.convertedToPaid, m.paywallHit)} converted

💰 REVENUE
- New Paid Users: ${m.newPaidUsers}
- New Paid Letters: ${m.newPaidLetters}
- Revenue: Rp ${m.revenueIdr.toLocaleString('id-ID')}
- Avg Order Value: Rp ${m.newPaidUsers > 0 ? Math.round(m.revenueIdr / m.newPaidUsers).toLocaleString('id-ID') : 0}

🔴 ERRORS
- API Errors: ${m.apiErrors}
- Payment Failures: ${m.paymentFailures}
- PDF Generation Failures: ${m.pdfFailures}

🎯 TOP LETTER TYPES
${topList}

💬 SUPPORT
- Tickets: ${m.supportTickets}
- Avg Resolution Time: ${Math.floor(m.avgResolutionTimeMin / 60)}h ${m.avgResolutionTimeMin % 60}m`;
}

export async function sendWeeklyReport(metrics: WeeklyMetrics): Promise<void> {
  const body = buildWeeklyReport(metrics);
  await sendTelegramAlert('Weekly Report', body, 'info');
}
