export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'SuratResmi.id';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const LETTER_TYPES = [
  'kuasa',
  'surat_jual',
  'kuasa_istimewa',
  'perj_kerja',
  'perj_sewa',
  'perj_utang',
] as const;

export type LetterType = (typeof LETTER_TYPES)[number];
