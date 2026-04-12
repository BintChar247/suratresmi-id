import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroIllustration } from '@/components/landing/HeroIllustration';
import { SolvedIllustration } from '@/components/landing/SolvedIllustration';
import { FileText, Clock, Download, Shield, Lock, Eye, Trash2, Building2, Landmark, Briefcase, GraduationCap, HeartHandshake, Scale } from 'lucide-react';

const LETTER_TYPES = [
  { icon: FileText, name: 'Surat Kuasa', desc: 'Kuasa umum & khusus', color: 'bg-primary-50 text-primary-600' },
  { icon: Briefcase, name: 'Perjanjian Kerja', desc: 'Kontrak & kesepakatan', color: 'bg-success-50 text-success-600' },
  { icon: HeartHandshake, name: 'Surat Jual Beli', desc: 'Kendaraan, tanah, dll', color: 'bg-warning-50 text-warning-700' },
  { icon: Building2, name: 'Perjanjian Sewa', desc: 'Rumah, ruko, kendaraan', color: 'bg-primary-50 text-primary-600' },
  { icon: Scale, name: 'Perjanjian Utang', desc: 'Piutang & pinjaman', color: 'bg-danger-50 text-danger-600' },
  { icon: Shield, name: 'Surat Pernyataan', desc: 'Bermaterai & resmi', color: 'bg-success-50 text-success-600' },
];

const INSTANSI = [
  { name: 'Kelurahan', icon: Landmark },
  { name: 'Kecamatan', icon: Landmark },
  { name: 'Pengadilan', icon: Scale },
  { name: 'Notaris', icon: GraduationCap },
  { name: 'Bank', icon: Building2 },
  { name: 'Perusahaan', icon: Briefcase },
];

const STEPS = [
  { num: '1', title: 'Pilih Jenis Surat', desc: 'Pilih dari 20+ template surat resmi Indonesia', icon: FileText },
  { num: '2', title: 'Isi Data Anda', desc: 'Form sederhana, cukup isi nama & detail yang diperlukan', icon: Clock },
  { num: '3', title: 'Unduh PDF', desc: 'Surat resmi siap cetak, langsung download dalam format PDF', icon: Download },
];

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white px-4 pt-8 pb-12 md:pt-16 md:pb-20">
          {/* Subtle decorative circles — smaller on mobile to prevent overflow */}
          <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-primary-100 rounded-full opacity-30 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-success-100 rounded-full opacity-20 translate-y-1/3 -translate-x-1/4" />

          <div className="relative max-w-5xl mx-auto">
            <div className="md:flex md:items-center md:gap-8">
              {/* Left: Text */}
              <div className="md:flex-1 text-center md:text-left space-y-5">
                <div className="inline-block bg-warning-100 text-warning-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                  Gratis 3 surat pertama
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-heading leading-tight">
                  Buat Surat Resmi<br />
                  <span className="text-primary-500">dalam 30 Detik</span>
                </h1>

                <p className="text-base md:text-lg text-gray-500 max-w-md mx-auto md:mx-0">
                  Tidak perlu pusing cari format, ketik dari nol, atau bayar mahal ke notaris.
                  Cukup isi form, langsung jadi PDF.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center bg-primary-500 text-white font-semibold text-lg px-8 py-4 rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    Mulai Buat Surat
                  </Link>
                  <a
                    href="#cara-kerja"
                    className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold text-base px-6 py-4 rounded-lg border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-colors"
                  >
                    Lihat Cara Kerja
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-gray-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-success-400 rounded-full flex-shrink-0" />
                    Tanpa daftar
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-success-400 rounded-full flex-shrink-0" />
                    Format PDF
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-success-400 rounded-full flex-shrink-0" />
                    Bahasa Indonesia
                  </span>
                </div>
              </div>

              {/* Right: Illustration */}
              <div className="mt-8 md:mt-0 md:flex-1">
                <HeroIllustration />
                <p className="text-center text-xs text-gray-400 mt-2 italic">
                  Pusing cari format surat yang benar?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRUSTED BY / INSTANSI SECTION ===== */}
        <section className="border-y border-gray-100 bg-gray-50 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
              Dipakai untuk keperluan di berbagai instansi
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {INSTANSI.map((inst) => (
                <div
                  key={inst.name}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs border border-gray-200">
                    <inst.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{inst.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="cara-kerja" className="px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
                Semudah 1-2-3
              </h2>
              <p className="text-gray-500 mt-2">Tidak perlu keahlian hukum. Tidak perlu pengalaman.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, idx) => (
                <div key={step.num} className="relative text-center p-6 rounded-xl bg-white border border-gray-100 shadow-xs hover:shadow-sm transition-shadow">
                  {/* Step number bubble */}
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>

                  {/* Connector arrow (hidden on mobile, last item) */}
                  {idx < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 text-2xl">
                      &#8250;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== BEFORE/AFTER SECTION ===== */}
        <section className="px-4 py-12 bg-gradient-to-b from-white to-primary-50">
          <div className="max-w-4xl mx-auto md:flex md:items-center md:gap-12">
            <div className="md:flex-1 mb-8 md:mb-0">
              <SolvedIllustration />
            </div>
            <div className="md:flex-1 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading text-center md:text-left">
                Dari pusing jadi selesai,<br />
                <span className="text-primary-500">kurang dari semenit.</span>
              </h2>
              <div className="space-y-3">
                {[
                  { before: 'Googling format surat berjam-jam', after: 'Pilih template, langsung isi' },
                  { before: 'Ketik ulang dari nol di Word', after: 'Form otomatis, tinggal lengkapi' },
                  { before: 'Bayar Rp 200rb+ ke jasa ketik', after: 'Gratis untuk 3 surat pertama' },
                ].map((item) => (
                  <div key={item.before} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 line-through">{item.before}</p>
                      <p className="text-sm font-medium text-gray-800">{item.after}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== LETTER TYPES ===== */}
        <section className="px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
                Jenis Surat yang Tersedia
              </h2>
              <p className="text-gray-500 mt-2">Semua template sudah sesuai format resmi Indonesia</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {LETTER_TYPES.map((type) => (
                <Link
                  key={type.name}
                  href="/app"
                  className="group flex flex-col items-center text-center gap-2 p-4 md:p-5 rounded-xl border-2 border-gray-100 bg-white hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type.color} group-hover:scale-110 transition-transform`}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{type.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SOCIAL PROOF NUMBERS ===== */}
        <section className="bg-primary-500 px-4 py-10">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <p className="text-2xl md:text-3xl font-bold font-heading">20+</p>
              <p className="text-xs md:text-sm text-primary-100 mt-1">Template Surat</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold font-heading">30dtk</p>
              <p className="text-xs md:text-sm text-primary-100 mt-1">Rata-rata Waktu</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold font-heading">PDF</p>
              <p className="text-xs md:text-sm text-primary-100 mt-1">Siap Cetak</p>
            </div>
          </div>
        </section>

        {/* ===== DATA SECURITY TRUST SECTION ===== */}
        <section className="px-4 py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-success-100 rounded-full mb-4">
                <Shield className="w-7 h-7 text-success-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
                Data Anda Aman Bersama Kami
              </h2>
              <p className="text-gray-500 mt-2">Sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Lock,
                  title: 'Enkripsi End-to-End',
                  desc: 'Semua data pribadi (nama, NIK, alamat) dienkripsi dengan AES-256 sebelum disimpan. Tidak ada yang bisa membaca data Anda, termasuk tim kami.',
                },
                {
                  icon: Eye,
                  title: 'Tidak Dijual ke Pihak Ketiga',
                  desc: 'Data Anda hanya digunakan untuk membuat surat. Kami tidak menjual, membagikan, atau menggunakan data Anda untuk keperluan lain.',
                },
                {
                  icon: Trash2,
                  title: 'Hapus Data Kapan Saja',
                  desc: 'Sesuai UU PDP, Anda berhak menghapus semua data pribadi dari sistem kami kapan saja melalui pengaturan akun.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-success-50 rounded-lg mb-3">
                    <item.icon className="w-5 h-5 text-success-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="px-4 py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-lg mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
              Sudah siap buat surat?
            </h2>
            <p className="text-gray-500">
              Gratis, cepat, dan langsung jadi PDF. Tanpa perlu daftar akun.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-primary-500 text-white font-semibold text-lg px-10 py-4 rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
            >
              Mulai Buat Surat — Gratis
            </Link>
            <p className="text-xs text-gray-400">
              Tidak perlu kartu kredit. 3 surat pertama gratis.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
