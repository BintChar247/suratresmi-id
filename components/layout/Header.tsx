import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header(): JSX.Element {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="SuratResmi.Online"
            width={200}
            height={48}
            className="h-9 w-auto"
            priority
          />
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
            Bantuan <span className="text-gray-300 font-normal">/ Help</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
