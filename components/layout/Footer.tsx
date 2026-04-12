import React from 'react';
import Link from 'next/link';

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-6 mt-auto">
      <div className="max-w-lg mx-auto text-center space-y-2">
        <p className="text-sm font-semibold text-gray-700">SuratResmi.Online</p>
        <p className="text-xs text-gray-400">
          Dokumen dibuat oleh AI. Bukan pengganti konsultasi hukum profesional.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <Link href="/terms" className="hover:text-gray-600">Syarat & Ketentuan</Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-gray-600">Kebijakan Privasi</Link>
        </div>
      </div>
    </footer>
  );
}
