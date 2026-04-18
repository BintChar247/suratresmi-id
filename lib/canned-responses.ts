export const CANNED_RESPONSES = {
  PAYMENT_FAILED: `Pembayaran Anda belum berhasil. Coba:
1. Refresh halaman dan coba kembali
2. Gunakan metode pembayaran lain (QRIS, transfer bank, e-wallet)
3. Hubungi bank untuk memastikan kartu/saldo aktif

Masih bermasalah? Reply dengan nomor pesanan Anda.`,

  LETTER_ERROR: `Mohon maaf, ada kendala pada surat yang dibuat. Langkah berikut:
1. Periksa kembali data yang Anda masukkan
2. Coba buat ulang surat dari awal
3. Jika masalah berlanjut, kirim detail kesalahan ke support

Tim kami siap membantu!`,

  REFUND_PROCESS: `Refund akan diproses dalam 3-5 hari kerja ke sumber pembayaran asal.
Jika sudah lebih dari 5 hari kerja dan belum diterima, hubungi kami dengan:
- Bukti pembayaran
- Tanggal transaksi
- Nominal refund`,

  URGENT_ESCALATION: `Tiket Anda sudah kami tandai URGENT. Tim support akan merespons dalam 1 jam pada jam kerja (Senin–Jumat 09.00–18.00 WIB).`,

  LETTER_LEGAL_DISCLAIMER: `Surat yang dibuat adalah draf untuk referensi. Untuk dokumen dengan nilai hukum tinggi (tanah, properti, perjanjian besar), wajib dikonsultasikan dan ditandatangani di hadapan notaris resmi.`,

  CREDITS_LOW: `Kredit Anda hampir habis. Beli kredit tambahan di halaman Kredit untuk terus membuat surat. Kredit tidak kedaluwarsa.`,

  ACCOUNT_ISSUE: `Coba langkah berikut:
1. Logout dan login ulang
2. Hapus cache browser
3. Coba browser berbeda atau mode incognito

Masih bermasalah? Kirim email/screenshot ke support@suratresmi.online`,
} as const;

export type CannedResponseKey = keyof typeof CANNED_RESPONSES;
