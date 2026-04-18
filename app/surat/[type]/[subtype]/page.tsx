import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const revalidate = 86400;
export const dynamicParams = true;

const SITE_URL = 'https://suratresmi.id';

const TYPE_LABELS: Record<string, string> = {
  kuasa: 'Surat Kuasa',
  surat_jual: 'Surat Jual Beli',
  kuasa_istimewa: 'Surat Kuasa Istimewa',
  perj_kerja: 'Perjanjian Kerja',
  perj_sewa: 'Perjanjian Sewa',
  perj_utang: 'Perjanjian Utang',
};

interface PageParams {
  type: string;
  subtype: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface RelatedTemplate {
  type: string;
  subtype_id: string;
  name_id: string;
}

async function fetchPageData(subtype: string): Promise<{
  template: { type: string; subtype_id: string; name_id: string } | null;
  seo: {
    meta_title: string;
    meta_description: string;
    example_letter: string;
    faq_json: FAQItem[];
    related_subtypes: string[];
  } | null;
  related: RelatedTemplate[];
}> {
  const supabase = getSupabaseAdmin();

  const [{ data: template }, { data: seo }] = await Promise.all([
    supabase
      .from('templates')
      .select('type, subtype_id, name_id')
      .eq('subtype_id', subtype)
      .eq('is_active', true)
      .maybeSingle(),
    supabase
      .from('seo_cache')
      .select('meta_title, meta_description, example_letter, faq_json, related_subtypes')
      .eq('subtype_id', subtype)
      .maybeSingle(),
  ]);

  let related: RelatedTemplate[] = [];
  if (seo?.related_subtypes?.length) {
    const { data: relatedRows } = await supabase
      .from('templates')
      .select('type, subtype_id, name_id')
      .in('subtype_id', seo.related_subtypes)
      .eq('is_active', true);
    related = relatedRows ?? [];
  }

  return { template, seo, related };
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const { data } = await getSupabaseAdmin()
    .from('templates')
    .select('type, subtype_id')
    .eq('is_active', true);

  return (data ?? []).map((t: { type: string; subtype_id: string }) => ({
    type: t.type,
    subtype: t.subtype_id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { template, seo } = await fetchPageData(params.subtype);
  if (!template || !seo) {
    return { title: 'Surat tidak ditemukan | SuratResmi.id' };
  }

  const canonical = `${SITE_URL}/surat/${params.type}/${params.subtype}`;
  return {
    title: seo.meta_title,
    description: seo.meta_description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: seo.meta_title,
      description: seo.meta_description,
      siteName: 'SuratResmi.id',
      locale: 'id_ID',
      images: [
        { url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.meta_title,
      description: seo.meta_description,
      images: [`${SITE_URL}/og-image.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function SuratPage({
  params,
}: {
  params: PageParams;
}): Promise<JSX.Element> {
  const { template, seo, related } = await fetchPageData(params.subtype);
  if (!template || !seo || template.type !== params.type) notFound();

  const typeLabel = TYPE_LABELS[template.type] ?? 'Surat';
  const canonical = `${SITE_URL}/surat/${params.type}/${params.subtype}`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faq_json.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Surat', item: `${SITE_URL}/surat` },
      {
        '@type': 'ListItem',
        position: 3,
        name: typeLabel,
        item: `${SITE_URL}/surat/${template.type}`,
      },
      { '@type': 'ListItem', position: 4, name: template.name_id, item: canonical },
    ],
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Cara Membuat ${template.name_id}`,
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Pilih Jenis Surat', text: `Pilih template "${template.name_id}" di SuratResmi.id.` },
      { '@type': 'HowToStep', position: 2, name: 'Isi Data', text: 'Lengkapi form dengan data pihak-pihak terkait.' },
      { '@type': 'HowToStep', position: 3, name: 'Unduh PDF', text: 'Unduh surat resmi dalam format PDF siap cetak.' },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600">Beranda</Link>
          <span className="mx-1.5 text-gray-300">/</span>
          <Link href="/surat" className="hover:text-primary-600">Surat</Link>
          <span className="mx-1.5 text-gray-300">/</span>
          <span className="text-gray-700">{template.name_id}</span>
        </nav>

        <header className="mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-wide text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full mb-3">
            {typeLabel}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading leading-tight">
            {template.name_id}
          </h1>
          <p className="mt-3 text-gray-600 text-base md:text-lg max-w-2xl">
            {seo.meta_description}
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Link
            href={`/app?type=${template.type}&subtype=${template.subtype_id}`}
            className="inline-flex items-center justify-center bg-primary-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors shadow-md"
          >
            Buat Surat Ini Sekarang
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-colors"
          >
            Lihat Semua Template
          </Link>
        </div>

        <section aria-labelledby="contoh-heading" className="mb-12">
          <h2 id="contoh-heading" className="text-2xl font-bold text-gray-900 mb-4">
            Contoh {template.name_id}
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 md:p-6">
            <pre className="font-serif text-sm md:text-[15px] text-gray-800 whitespace-pre-wrap leading-relaxed">
              {seo.example_letter}
            </pre>
          </div>
        </section>

        {seo.faq_json.length > 0 && (
          <section aria-labelledby="faq-heading" className="mb-12">
            <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-4">
              Pertanyaan Umum
            </h2>
            <div className="space-y-3">
              {seo.faq_json.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white border border-gray-200 rounded-lg p-4 open:border-primary-200 open:bg-primary-50/30"
                >
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-start gap-3">
                    <span>{item.question}</span>
                    <span className="text-primary-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-gray-700 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mb-12">
            <h2 id="related-heading" className="text-2xl font-bold text-gray-900 mb-4">
              Surat Terkait
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <li key={r.subtype_id}>
                  <Link
                    href={`/surat/${r.type}/${r.subtype_id}`}
                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <div className="text-xs text-gray-500 mb-1">{TYPE_LABELS[r.type] ?? 'Surat'}</div>
                    <div className="font-semibold text-gray-900">{r.name_id}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-primary-50 border border-primary-100 rounded-xl p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Siap Membuat {template.name_id}?
          </h2>
          <p className="text-gray-600 mb-5">
            3 surat pertama gratis. Tidak perlu kartu kredit.
          </p>
          <Link
            href={`/app?type=${template.type}&subtype=${template.subtype_id}`}
            className="inline-flex items-center justify-center bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors shadow-md"
          >
            Buat Sekarang
          </Link>
        </section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </div>
  );
}
