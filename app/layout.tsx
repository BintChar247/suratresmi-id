import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SuratResmi.id — Pembuat Surat Resmi Online',
  description: 'Buat surat kuasa, perjanjian, dan dokumen resmi dalam 30 detik.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="id">
      <body className="bg-white text-gray-900 font-sans">{children}</body>
    </html>
  );
}
