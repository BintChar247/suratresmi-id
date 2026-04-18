import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const revalidate = 86400;

const SITE_URL = 'https://suratresmi.online';

const TYPE_LABELS: Record<string, string> = {
  kuasa: 'Surat Kuasa',
  surat_jual: 'Surat Jual Beli',
  kuasa_istimewa: 'Surat Kuasa Istimewa',
  perj_kerja: 'Perjanjian Kerja',
  perj_sewa: 'Perjanjian Sewa',
  perj_utang: 'Perjanjian Utang',
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  kuasa: 'Kuasa umum dan khusus untuk mengurus keperluan hukum, administrasi, dan lainnya.',
  surat_jual: 'Surat jual beli kendaraan, tanah, rumah, dan aset lainnya.',
  kuasa_istimewa: 'Kuasa istimewa dengan kewenangan khusus sesuai Pasal 1796 KUHPerdata.',
  perj_kerja: 'Kontrak kerja PKWT, PKWTT, dan perjanjian ketenagakerjaan.',
  perj_sewa: 'Perjanjian sewa rumah, ruko, kendaraan, dan aset lainnya.',
  perj_utang: 'Perjanjian utang piutang, pinjaman, dan surat pernyataan utang.',
};

export const metadata: Metadata = {
  title: 'Semua Template Surat Resmi | SuratResmi.Online',
  description:
    'Jelajahi 50+ template surat resmi Indonesia: surat kuasa, perjanjian kerja, jual beli, sewa, dan utang. Buat gratis dalam 30 detik.',
  alternates: { canonical: `${SITE_URL}/surat` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/surat`,
    title: 'Semua Template Surat Resmi | SuratResmi.Online',
    description:
      'Jelajahi 50+ template surat resmi Indonesia. Buat gratis dalam 30 detik.',
    siteName: 'SuratResmi.Online',
    locale: 'id_ID',
  },
  robots: { index: true, follow: true },
};

export default async function SuratIndexPage(): Promise<JSX.Element> {
  const { data } = await getSupabaseAdmin()
    .from('templates')
    .select('type, subtype_id, name_id')
    .eq('is_active', true)
    .order('type')
    .order('name_id');

  const grouped = new Map<string, { type: string; subtype_id: string; name_id: string }[]>();
  for (const row of data ?? []) {
    const list = grouped.get(row.type) ?? [];
    list.push(row);
    grouped.set(row.type, list);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Beranda</Link>
          <span className="mx-1.5 text-gray-300">/</span>
          <span className="text-gray-700">Surat</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading leading-tight">
            Semua Template Surat Resmi
          </h1>
          <p className="mt-3 text-gray-600 text-base md:text-lg max-w-2xl">
            Pilih dari {data?.length ?? 0}+ template surat resmi Indonesia. Gratis 3 surat pertama,
            siap jadi PDF dalam 30 detik.
          </p>
        </header>

        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([type, items]) => (
            <section key={type} aria-labelledby={`type-${type}`}>
              <div className="mb-4">
                <h2
                  id={`type-${type}`}
                  className="text-2xl font-bold text-gray-900"
                >
                  {TYPE_LABELS[type] ?? type}
                </h2>
                {TYPE_DESCRIPTIONS[type] && (
                  <p className="text-gray-600 mt-1">{TYPE_DESCRIPTIONS[type]}</p>
                )}
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((t) => (
                  <li key={t.subtype_id}>
                    <Link
                      href={`/surat/${t.type}/${t.subtype_id}`}
                      className="block h-full bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                    >
                      <div className="font-semibold text-gray-900">{t.name_id}</div>
                      <div className="text-xs text-primary-600 mt-2">Pelajari &rarr;</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
