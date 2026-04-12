'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ: FaqItem[] = [
  { q: 'Bagaimana cara membuat surat?', a: 'Pilih jenis surat → pilih subtype → isi form → klik Buat Surat → download PDF.' },
  { q: 'Berapa harga per surat?', a: 'Paket Hemat Rp 5.000, Standar Rp 15.000, Profesional Rp 25.000. Kredit tidak kedaluwarsa.' },
  { q: 'Apakah surat saya legal?', a: 'Surat adalah draf yang dapat digunakan sebagai referensi. Untuk transaksi besar (tanah, properti), konsultasikan dengan notaris.' },
  { q: 'Apakah saya perlu materai?', a: 'Beberapa surat (perjanjian, kuasa jual tanah) memerlukan materai Rp 10.000. Kami akan memberi tahu setelah surat dibuat.' },
  { q: 'Cara membayar kredit?', a: 'Kami menerima QRIS, transfer bank, GoPay, OVO, dan Dana. Pilih metode saat checkout.' },
  { q: 'Apakah kredit saya bisa kedaluwarsa?', a: 'Tidak. Kredit yang sudah dibeli tidak kedaluwarsa.' },
  { q: 'Pembayaran saya gagal, apa yang harus dilakukan?', a: 'Coba refresh halaman, gunakan metode pembayaran lain, atau hubungi bank Anda. Kredit tidak dipotong jika pembayaran gagal.' },
  { q: 'Bisakah saya mengedit surat setelah dibuat?', a: 'Saat ini surat tidak dapat diedit langsung. Buat ulang surat dengan data yang benar.' },
  { q: 'Di mana saya bisa melihat surat yang sudah dibuat?', a: 'Masuk ke akun Anda → Dashboard → Riwayat Surat.' },
  { q: 'Apakah data saya aman?', a: 'Ya. Data disimpan terenkripsi dan tidak dibagikan ke pihak ketiga selain untuk pemrosesan surat. Lihat Kebijakan Privasi.' },
  { q: 'Berapa lama surat dihasilkan?', a: 'Biasanya 10-30 detik tergantung jenis surat dan kecepatan koneksi.' },
  { q: 'Apakah ada refund?', a: 'Refund tersedia jika surat tidak dapat dibuat karena kesalahan sistem. Hubungi support dengan detail pesanan.' },
  { q: 'Saya lupa password, bagaimana cara reset?', a: 'Klik "Lupa Password" di halaman login. Link reset akan dikirim ke email Anda.' },
  { q: 'Bisakah saya menggunakan akun yang sama di perangkat berbeda?', a: 'Ya, akun dapat digunakan di semua perangkat.' },
  { q: 'Apakah ada versi gratis?', a: 'Tidak ada kredit gratis permanen, tetapi beberapa paket menawarkan harga per surat yang sangat terjangkau mulai Rp 5.000.' },
];

interface TicketFormState {
  category: string;
  subject: string;
  description: string;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

export function HelpWidget(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TicketFormState>({
    category: 'other',
    subject: '',
    description: '',
    submitting: false,
    submitted: false,
    error: null,
  });

  const filtered = search.trim()
    ? FAQ.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      )
    : FAQ.slice(0, 6);

  const handleTicketSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) return;

    setForm((prev) => ({ ...prev, submitting: true, error: null }));

    try {
      const res = await fetch('/api/support/create-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          category: form.category,
          subject: form.subject.trim(),
          description: form.description.trim(),
        }),
      });

      if (!res.ok) {
        const { error } = (await res.json()) as { error?: string };
        throw new Error(error ?? 'Gagal mengirim tiket');
      }

      setForm((prev) => ({ ...prev, submitted: true, submitting: false }));
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        submitting: false,
        error: err instanceof Error ? err.message : 'Terjadi kesalahan',
      }));
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="bg-white rounded-xl shadow-2xl w-80 border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Bantuan</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              aria-label="Tutup"
            >
              &times;
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Search */}
            <Input
              placeholder="Cari FAQ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* FAQ list */}
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <details key={i} className="group">
                    <summary className="cursor-pointer font-semibold text-sm text-gray-800 py-2 pr-2 list-none flex justify-between items-start gap-2">
                      <span>{item.q}</span>
                      <span className="text-primary-500 mt-0.5 flex-shrink-0 text-xs group-open:rotate-180 transition-transform">
                        &#9660;
                      </span>
                    </summary>
                    <p className="text-sm text-gray-600 pb-2 pl-1">{item.a}</p>
                  </details>
                ))
              ) : (
                <p className="text-sm text-gray-400 py-4 text-center">
                  Tidak ada FAQ yang cocok
                </p>
              )}
            </div>

            {/* Contact support toggle */}
            <Button
              fullWidth
              variant="outline"
              size="sm"
              onClick={() => setShowForm(!showForm)}
            >
              Hubungi Support
            </Button>

            {/* Ticket form */}
            {showForm && (
              form.submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  Tiket berhasil dikirim! Tim kami akan merespons segera.
                </div>
              ) : (
                <form onSubmit={(e) => void handleTicketSubmit(e)} className="space-y-2">
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="payment">Pembayaran</option>
                    <option value="letter_quality">Kualitas Surat</option>
                    <option value="account">Akun</option>
                    <option value="bug">Bug / Error</option>
                    <option value="legal">Pertanyaan Hukum</option>
                    <option value="other">Lainnya</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Subjek masalah..."
                    value={form.subject}
                    maxLength={200}
                    required
                    onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  />

                  <textarea
                    placeholder="Jelaskan masalah Anda secara detail..."
                    value={form.description}
                    maxLength={2000}
                    required
                    rows={3}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary-500"
                  />

                  {form.error && (
                    <p className="text-sm text-red-500">{form.error}</p>
                  )}

                  <Button fullWidth size="sm" type="submit" loading={form.submitting}>
                    Kirim Tiket
                  </Button>
                </form>
              )
            )}
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="rounded-full shadow-lg px-5"
        >
          Bantuan
        </Button>
      )}
    </div>
  );
}
