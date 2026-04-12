import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-6 mt-auto">
      <div className="max-w-5xl mx-auto text-center space-y-3">
        <Image
          src="/logo.svg"
          alt="SuratResmi.Online"
          width={160}
          height={40}
          className="h-7 w-auto mx-auto"
        />
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
