'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getValidRedirect } from '@/lib/redirect-validation';

function LoginForm(): JSX.Element {
  const searchParams = useSearchParams();
  const redirect = getValidRedirect(searchParams.get('redirect'));

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentEmail, setSentEmail] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleLogin = async (): Promise<void> => {
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (err) setError(err.message);
    setLoading(false);
  };

  const handleMagicLink = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (err) {
      setError(err.message);
    } else {
      setSentEmail(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Masuk ke SuratResmi.id</h1>
          <p className="text-sm text-gray-500 mt-2">Buat surat resmi dalam 30 detik</p>
        </div>

        {sentEmail ? (
          <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-center">
            <p className="text-green-800 font-semibold text-lg">Email terkirim!</p>
            <p className="text-sm text-green-700 mt-2">
              Periksa inbox Anda dan klik link untuk masuk.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              fullWidth
              variant="outline"
              onClick={() => void handleGoogleLogin()}
              loading={loading}
            >
              Masuk dengan Google
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-400">atau</span>
              </div>
            </div>

            <form onSubmit={(e) => void handleMagicLink(e)} className="space-y-3">
              <Input
                label="Email Anda"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button fullWidth loading={loading} type="submit">
                Kirim Link Masuk
              </Button>
            </form>

            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-4">
              Belum punya akun? Daftar otomatis saat login pertama.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage(): JSX.Element {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
