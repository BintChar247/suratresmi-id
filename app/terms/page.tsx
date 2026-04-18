export const metadata = {
  title: 'Syarat & Ketentuan — SuratResmi.Online',
  description:
    'Syarat dan ketentuan layanan SuratResmi.Online, termasuk batasan tanggung jawab dan kebijakan penggunaan yang dapat diterima.',
};

export default function TermsPage(): JSX.Element {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Syarat &amp; Ketentuan Layanan</h1>
        <p className="text-sm text-gray-600">
          Tunduk pada hukum Republik Indonesia. Versi lengkap bahasa Inggris tersedia di{' '}
          <code className="font-mono text-sm">TERMS_OF_SERVICE.md</code>.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Deskripsi Layanan</h2>
        <p>
          SuratResmi.Online menyediakan platform berbasis AI untuk membantu pengguna membuat{' '}
          <strong>draf</strong> surat dan dokumen dalam Bahasa Indonesia. Dokumen yang dihasilkan
          <strong> bukan nasihat hukum</strong> dan tidak menggantikan tinjauan oleh advokat atau
          notaris yang kompeten.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Tanggung Jawab Pengguna</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Memastikan seluruh data yang Anda masukkan akurat dan mutakhir.</li>
          <li>
            Meminta tinjauan advokat untuk transaksi signifikan (khususnya bernilai di atas{' '}
            Rp 100.000.000).
          </li>
          <li>Mengurus legalisasi notaris bila disyaratkan hukum (mis. jual-beli tanah).</li>
          <li>Menempelkan materai Rp 10.000 sesuai kewajiban yang berlaku.</li>
          <li>Memverifikasi kepatuhan terhadap peraturan daerah yang relevan.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Kebijakan Penggunaan yang Dapat Diterima</h2>
        <p>Anda setuju untuk TIDAK menggunakan platform ini untuk:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Membuat dokumen palsu, tanda tangan palsu, atau memalsukan tanggal.</li>
          <li>Meniru identitas orang atau lembaga lain.</li>
          <li>Penipuan, penggelapan pajak, pencucian uang, atau aktivitas ilegal lainnya.</li>
          <li>Membuat dokumen yang bersifat mengancam, mencemarkan, atau melecehkan.</li>
          <li>Melanggar hak kekayaan intelektual pihak ketiga.</li>
          <li>
            Mengganggu, meretas, atau mengeksploitasi sistem (termasuk permintaan berlebihan).
          </li>
        </ul>
        <p>
          Pelanggaran dapat mengakibatkan penangguhan atau penutupan akun serta pelaporan kepada
          pihak berwenang.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Pembatasan Tanggung Jawab</h2>
        <p className="font-semibold uppercase text-sm">
          Sejauh diizinkan oleh hukum Indonesia, SuratResmi.Online tidak bertanggung jawab atas:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Konsekuensi hukum, kerugian, atau sengketa yang timbul dari penggunaan dokumen yang
            dihasilkan.
          </li>
          <li>Kesalahan, kelalaian, atau ketidakakuratan konten yang dihasilkan AI.</li>
          <li>
            Kerugian karena dokumen tidak memenuhi persyaratan formal hukum Indonesia (notaris,
            materai, saksi).
          </li>
          <li>
            Kerugian tidak langsung, termasuk kehilangan keuntungan, gangguan usaha, atau kerusakan
            reputasi.
          </li>
          <li>Kehilangan data akibat kegagalan server, kesalahan pengguna, atau penghapusan akun.</li>
          <li>Tindakan pihak ketiga yang menyalahgunakan dokumen Anda.</li>
        </ul>
        <p>
          <strong>Batas tanggung jawab maksimum:</strong> total tanggung jawab kami tidak akan
          melebihi nilai yang Anda bayarkan dalam 12 bulan sebelum klaim, atau Rp 100.000 jika
          tidak ada pembayaran.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Disclaimer &amp; &quot;As-Is&quot;</h2>
        <p>
          Platform disediakan sebagaimana adanya (<em>as-is</em>) tanpa jaminan apapun atas
          keakuratan, kelengkapan, atau keabsahan hukum dokumen yang dihasilkan. Anda menanggung
          seluruh risiko atas penggunaan dokumen tersebut.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">6. Ganti Rugi</h2>
        <p>
          Anda setuju untuk mengganti rugi dan membebaskan SuratResmi.Online dari segala klaim,
          kerugian, atau biaya (termasuk biaya hukum) yang timbul dari pelanggaran Syarat &amp;
          Ketentuan ini atau dari penyalahgunaan dokumen oleh Anda.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">7. Privasi</h2>
        <p>
          Pemrosesan data pribadi Anda tunduk pada{' '}
          <a href="/privacy" className="underline text-primary-600">
            Kebijakan Privasi
          </a>{' '}
          yang disusun sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">8. Hukum yang Berlaku</h2>
        <p>
          Syarat &amp; Ketentuan ini tunduk pada hukum Republik Indonesia. Sengketa yang tidak
          dapat diselesaikan secara musyawarah akan diselesaikan di Pengadilan Negeri Jakarta Pusat.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">9. Kontak</h2>
        <p>
          Pertanyaan terkait Syarat &amp; Ketentuan:{' '}
          <span className="font-mono text-sm">legal@suratresmi.online</span>
          <br />
          Dukungan pelanggan:{' '}
          <span className="font-mono text-sm">support@suratresmi.online</span>
        </p>
      </section>
    </main>
  );
}
