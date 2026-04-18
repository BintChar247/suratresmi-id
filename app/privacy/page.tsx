export const metadata = {
  title: 'Kebijakan Privasi — SuratResmi.Online',
  description:
    'Kebijakan privasi SuratResmi.Online sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi.',
};

export default function PrivacyPage(): JSX.Element {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Kebijakan Privasi</h1>
        <p className="text-sm text-gray-600">
          Berlaku sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP).
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Data yang Kami Kumpulkan</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Alamat email (untuk autentikasi).</li>
          <li>
            Data yang Anda masukkan ke dalam wizard pembuatan surat — misal nama, NIK, alamat,
            nilai transaksi. Disimpan terenkripsi.
          </li>
          <li>Metadata teknis: IP address, user agent, timestamp permintaan.</li>
          <li>Riwayat transaksi (untuk keperluan pembukuan dan pajak).</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Tujuan Pemrosesan Data</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Membuat surat sesuai input Anda (pemenuhan kontrak).</li>
          <li>Analitik agregat dan peningkatan kualitas layanan (berdasarkan persetujuan).</li>
          <li>Keamanan sistem, pencegahan fraud, dan kepatuhan hukum.</li>
          <li>Komunikasi terkait layanan (support, perubahan kebijakan).</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Retensi Data</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Surat yang dihasilkan</strong>: konten terenkripsi disimpan hingga Anda
            menghapus akun, kemudian dihapus dalam 30 hari.
          </li>
          <li>
            <strong>Transaksi pembayaran</strong>: disimpan sesuai kewajiban pembukuan (UU
            Perpajakan).
          </li>
          <li>
            <strong>Audit log</strong>: disimpan untuk kepatuhan; entri yang mengidentifikasi Anda
            di-anonimkan saat Anda meminta penghapusan.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Hak Anda berdasarkan UU PDP</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Akses &amp; portabilitas</strong>: ekspor data pribadi Anda melalui{' '}
            <code className="font-mono text-sm">/api/user/export-data</code> (tersedia di halaman
            Pengaturan).
          </li>
          <li>
            <strong>Koreksi</strong>: perbarui informasi profil Anda di halaman Pengaturan.
          </li>
          <li>
            <strong>Penghapusan</strong>: hapus data pribadi Anda melalui{' '}
            <code className="font-mono text-sm">/api/user/delete-data</code>. Kami akan merespons
            dalam waktu paling lambat 30 hari.
          </li>
          <li>
            <strong>Penarikan persetujuan</strong>: ubah pilihan analitik/pemasaran kapan saja
            melalui banner persetujuan.
          </li>
          <li>
            <strong>Pengajuan keberatan</strong>: hubungi DPO kami untuk pemrosesan yang Anda
            anggap tidak sah.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Berbagi Data dengan Pihak Ketiga</h2>
        <p>
          Kami menggunakan pemroses pihak ketiga untuk infrastruktur (Supabase), pembayaran
          (Midtrans), dan generasi teks AI (Anthropic). Data dikirim seperlunya dan diatur dengan
          perjanjian pemrosesan data.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">6. Kontak Data Protection Officer</h2>
        <p>
          Untuk permintaan hak subjek data atau pertanyaan mengenai pemrosesan data pribadi,
          hubungi:
        </p>
        <p className="font-mono text-sm">dpo@suratresmi.online</p>
        <p className="text-sm text-gray-600">
          Kami wajib merespons dalam 30 hari kerja sesuai UU PDP No. 27/2022.
        </p>
      </section>
    </main>
  );
}
