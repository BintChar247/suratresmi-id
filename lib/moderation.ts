export type ModerationSeverity = 'low' | 'medium' | 'high';

export interface ModerationResult {
  flagged: boolean;
  reason?: string;
  severity: ModerationSeverity;
}

interface ModerationCheck {
  pattern: RegExp;
  reason: string;
  severity: ModerationSeverity;
}

const CHECKS: ModerationCheck[] = [
  {
    pattern: /(departemen|kementerian|bea\s*cukai|kepolisian|polri|tni|bpjs|pajak|dirjen)[^\n]{0,60}(resmi|surat\s*resmi|dokumen\s*resmi|keputusan\s*resmi)/i,
    reason: 'Kemungkinan meniru instansi pemerintah',
    severity: 'high',
  },
  {
    pattern: /notaris[^\n]{0,40}(no\.?|nomor)\s*\d+[^\n]{0,20}20\d{2}|materai\s*(asli|palsu|scan|tempel)/i,
    reason: 'Kemungkinan referensi notaris/materai tidak sah',
    severity: 'high',
  },
  {
    pattern: /rp\.?\s*[\d.,]+\s*(miliar|milyar)|rp\.?\s*([5-9]\d|[1-9]\d{2,})\s*juta|\brp\.?\s*\d{9,}\b/i,
    reason: 'Nilai uang sangat besar terdeteksi (>Rp 50 juta)',
    severity: 'medium',
  },
  {
    pattern: /(ktp|sim|paspor|passport)\s*(palsu|aspal|bodong|scan\s*edit)/i,
    reason: 'Kemungkinan referensi dokumen identitas palsu',
    severity: 'high',
  },
];

export function scanLetterOutput(content: string): ModerationResult {
  for (const check of CHECKS) {
    if (check.pattern.test(content)) {
      return { flagged: true, reason: check.reason, severity: check.severity };
    }
  }
  return { flagged: false, severity: 'low' };
}
