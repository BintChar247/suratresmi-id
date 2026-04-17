'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/Button';

const PACKAGES = [
  { id: 'hemat', name: 'Paket Hemat', credits: 5, price: 'Rp 5.000' },
  {
    id: 'standar',
    name: 'Paket Standar',
    credits: 20,
    price: 'Rp 15.000',
    recommended: true,
  },
  {
    id: 'profesional',
    name: 'Paket Profesional',
    credits: 50,
    price: 'Rp 35.000',
  },
];

interface PaywallModalProps {
  onClose?: () => void;
}

export function PaywallModal({ onClose }: PaywallModalProps): JSX.Element {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = async (pkgId: string) => {
    setLoading(pkgId);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package: pkgId }),
      });

      if (!res.ok) {
        setLoading(null);
        return;
      }

      const { snap_token } = await res.json();

      if (window.snap) {
        window.snap.pay(snap_token, {
          onSuccess: () => {
            window.location.href = '/payment/success';
          },
          onError: () => {
            window.location.href = '/payment/error';
          },
          onClose: () => {
            setLoading(null);
          },
        });
      }
    } catch {
      setLoading(null);
    }
  };

  return (
    <>
      <Script
        src={
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js'
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Beli Kredit</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Tutup"
              >
                &times;
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-lg border-2 p-6 ${
                  pkg.recommended
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}
              >
                {pkg.recommended && (
                  <p className="mb-2 text-sm font-semibold text-primary-600">
                    Paling Hemat
                  </p>
                )}
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {pkg.name}
                </h3>
                <p className="mb-4 text-3xl font-bold text-gray-900">
                  {pkg.price}
                </p>
                <p className="mb-6 text-gray-600">{pkg.credits} surat</p>
                <Button
                  fullWidth
                  loading={loading === pkg.id}
                  disabled={loading !== null}
                  onClick={() => handleSelect(pkg.id)}
                >
                  Pilih Paket
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
