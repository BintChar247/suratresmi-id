'use client';

import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'consent.v1';

interface ConsentState {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  decided_at: string;
}

export function ConsentBanner(): JSX.Element | null {
  const [decided, setDecided] = useState(true);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      setDecided(localStorage.getItem(STORAGE_KEY) !== null);
    } catch {
      setDecided(true);
    }
  }, []);

  if (decided) return null;

  const save = (state: ConsentState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // best effort — storage may be disabled
    }
    setDecided(true);
  };

  const acceptAll = () =>
    save({ essential: true, analytics: true, marketing: true, decided_at: new Date().toISOString() });

  const rejectNonEssential = () =>
    save({
      essential: true,
      analytics: false,
      marketing: false,
      decided_at: new Date().toISOString(),
    });

  const savePrefs = () =>
    save({ essential: true, analytics, marketing, decided_at: new Date().toISOString() });

  return (
    <div
      role="dialog"
      aria-label="Persetujuan cookie dan data"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white text-gray-900 shadow-lg"
    >
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-3">
        <p className="text-sm">
          Kami menggunakan data Anda sesuai dengan{' '}
          <a href="/privacy" className="underline text-primary-600">
            Kebijakan Privasi
          </a>{' '}
          (UU No. 27/2022 tentang Pelindungan Data Pribadi). Data esensial selalu aktif; Anda dapat
          memilih izin terpisah untuk analitik dan pemasaran.
        </p>

        {showPrefs && (
          <div className="rounded-md bg-gray-50 p-3 text-sm space-y-2">
            <label className="flex items-center gap-2 opacity-60">
              <input type="checkbox" checked readOnly />
              <span>
                <strong>Esensial</strong> — keamanan, autentikasi, pemenuhan kontrak (wajib).
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              <span>
                <strong>Analitik</strong> — mengukur penggunaan agar layanan lebih baik.
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>
                <strong>Pemasaran</strong> — email promosi dan penawaran khusus.
              </span>
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-end">
          {!showPrefs ? (
            <button
              onClick={() => setShowPrefs(true)}
              className="text-sm px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
            >
              Sesuaikan
            </button>
          ) : (
            <button
              onClick={savePrefs}
              className="text-sm px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
            >
              Simpan pilihan
            </button>
          )}
          <button
            onClick={rejectNonEssential}
            className="text-sm px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            Tolak non-esensial
          </button>
          <button
            onClick={acceptAll}
            className="text-sm px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600"
          >
            Terima semua
          </button>
        </div>
      </div>
    </div>
  );
}
