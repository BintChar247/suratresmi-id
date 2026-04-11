'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Skeleton';
import type { Template } from '@/types/index';
import { ChevronLeft } from 'lucide-react';

interface Step2Props {
  type: string;
  onNext: (data: { subtype: string }) => void;
  onPrev: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  kuasa: 'Surat Kuasa',
  surat_jual: 'Surat Jual Beli',
  perj_kerja: 'Perjanjian Kerja',
  perj_sewa: 'Perjanjian Sewa',
  perj_utang: 'Perjanjian Utang',
  kuasa_istimewa: 'Kuasa Istimewa',
};

export function WizardStep2({ type, onNext, onPrev }: Step2Props): JSX.Element {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates(): Promise<void> {
      const { data, error: err } = await supabase
        .from('templates')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .order('name_id');

      if (err) {
        setError('Gagal memuat daftar surat. Coba lagi.');
      } else {
        setTemplates(data ?? []);
      }
      setLoading(false);
    }

    void fetchTemplates();
  }, [type]);

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onPrev}
          className="flex items-center gap-1 text-primary-500 text-sm font-semibold mb-4 min-h-[2.75rem]"
        >
          <ChevronLeft size={16} />
          Kembali
        </button>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">
          Pilih jenis {TYPE_LABELS[type] ?? type}
        </h2>
        <p className="mt-1 text-gray-500 text-sm">Pilih yang paling sesuai dengan kebutuhan Anda</p>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-danger-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && templates.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Belum ada template tersedia</p>
          <p className="text-sm mt-1">Segera hadir</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {templates.map((template) => (
            <Card key={template.subtype_id} onClick={() => onNext({ subtype: template.subtype_id })}>
              <p className="font-semibold text-gray-900">{template.name_id}</p>
              {template.name_en && (
                <p className="text-sm text-gray-400 mt-0.5">{template.name_en}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
