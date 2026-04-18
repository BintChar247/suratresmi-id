'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { config } from '@/lib/config';

interface AuthWallProps {
  children: React.ReactNode;
}

export function AuthWall({ children }: AuthWallProps): JSX.Element {
  const { user, loading, credits } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-12 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Masuk untuk Lanjut</h2>
        <p className="text-gray-600 text-sm mb-6">
          Buat akun gratis dan dapatkan 3 surat gratis untuk memulai.
        </p>
        <Button
          fullWidth
          onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent('/app')}`)}
        >
          Masuk / Daftar Gratis
        </Button>
      </div>
    );
  }

  if (config.billing.enabled && credits <= 0) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Kredit Habis</h2>
        <p className="text-gray-600 text-sm mb-6">
          Anda telah menggunakan semua kredit. Beli paket untuk melanjutkan.
        </p>
        <Button fullWidth onClick={() => router.push('/app/paywall')}>
          Beli Paket Kredit
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
