import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'SuratResmi.Online — Pembuat Surat Resmi Online',
  description: 'Buat surat kuasa, perjanjian, dan dokumen resmi dalam 30 detik.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="id">
      <body className="bg-white text-gray-900 font-sans antialiased">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
