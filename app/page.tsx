import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 font-heading leading-tight">
              Buat Surat Resmi<br />
              <span className="text-primary-500">dalam 30 Detik</span>
            </h1>
            <p className="text-lg text-gray-500">
              Surat kuasa, perjanjian, dan dokumen resmi lainnya — dibuat oleh AI,
              siap pakai dalam hitungan detik.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/app"
            className="inline-flex items-center justify-center w-full bg-primary-500 text-white font-semibold text-lg px-6 py-4 rounded-lg hover:bg-primary-600 transition-colors min-h-[3rem]"
          >
            Mulai Buat Surat — Gratis
          </Link>

          {/* Social proof */}
          <p className="text-sm text-gray-400">
            ✓ 3 surat gratis &nbsp;·&nbsp; ✓ Tanpa daftar &nbsp;·&nbsp; ✓ Format PDF
          </p>

          {/* Letter types preview */}
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { icon: '📄', name: 'Surat Kuasa' },
              { icon: '🤝', name: 'Surat Jual Beli' },
              { icon: '💼', name: 'Perjanjian Kerja' },
              { icon: '🏠', name: 'Perjanjian Sewa' },
              { icon: '💰', name: 'Perjanjian Utang' },
              { icon: '⚖️', name: 'Kuasa Istimewa' },
            ].map((type) => (
              <div
                key={type.name}
                className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
              >
                <span className="text-xl">{type.icon}</span>
                <span className="text-sm font-medium text-gray-700">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
