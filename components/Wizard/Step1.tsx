'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface Step1Props {
  onNext: (data: { type: string }) => void;
}

const LETTER_TYPES = [
  { id: 'kuasa', name: 'Surat Kuasa', icon: '📄', desc: 'Memberikan kuasa kepada orang lain' },
  { id: 'surat_jual', name: 'Surat Jual Beli', icon: '🤝', desc: 'Transaksi jual beli aset' },
  { id: 'perj_kerja', name: 'Perjanjian Kerja', icon: '💼', desc: 'Kontrak kerja karyawan' },
  { id: 'perj_sewa', name: 'Perjanjian Sewa', icon: '🏠', desc: 'Sewa properti atau kendaraan' },
  { id: 'perj_utang', name: 'Perjanjian Utang', icon: '💰', desc: 'Perjanjian pinjam meminjam' },
  { id: 'kuasa_istimewa', name: 'Kuasa Istimewa', icon: '⚖️', desc: 'Kuasa khusus untuk tindakan hukum' },
];

export function WizardStep1({ onNext }: Step1Props): JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading">
          Apa jenis surat yang Anda butuhkan?
        </h1>
        <p className="mt-2 text-gray-500">Pilih salah satu dari kategori di bawah</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {LETTER_TYPES.map((type) => (
          <Card key={type.id} onClick={() => onNext({ type: type.id })}>
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{type.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{type.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{type.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-sm text-gray-400 text-center">
        💡 Tidak yakin? Lihat contoh surat di halaman kami
      </p>
    </div>
  );
}
