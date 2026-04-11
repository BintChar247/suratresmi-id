// Credit management — implemented in Phase 3
export const FREE_TIER_CREDITS = 3;

export const CREDIT_PACKAGES = [
  { credits: 5, price_idr: 5000, label: '5 surat' },
  { credits: 15, price_idr: 15000, label: '15 surat' },
  { credits: 35, price_idr: 35000, label: '35 surat' },
] as const;
