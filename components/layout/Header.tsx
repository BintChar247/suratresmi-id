import React from 'react';
import Link from 'next/link';

export function Header(): JSX.Element {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-primary-600 text-lg">
          SuratResmi.id
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
            Bantuan
          </Link>
        </nav>
      </div>
    </header>
  );
}
