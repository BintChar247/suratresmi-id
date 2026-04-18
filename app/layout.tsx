import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { HelpWidget } from '@/components/HelpWidget';
import { ConsentBanner } from '@/components/ConsentBanner';
import { ReferralCapture } from '@/components/ReferralCapture';
import { AnalyticsBootstrap } from '@/components/AnalyticsBootstrap';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://suratresmi.online'),
  title: {
    default: 'SuratResmi.Online — Pembuat Surat Resmi Online dalam 30 Detik',
    template: '%s | SuratResmi.Online',
  },
  description: 'Buat surat kuasa, perjanjian, dan dokumen resmi dalam 30 detik.',
  applicationName: 'SuratResmi.Online',
  icons: { icon: '/logo-icon.svg' },
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
          <AnalyticsBootstrap />
          <ReferralCapture />
          <div className="min-h-screen flex flex-col">{children}</div>
          <HelpWidget />
          <ConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
