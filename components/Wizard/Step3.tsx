'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SkeletonInput } from '@/components/ui/Skeleton';
import { AuthWall } from '@/components/AuthWall';
import { SecurityBadge, PrivacyAssurance } from '@/components/ui/SecurityBadge';
import { ChevronLeft } from 'lucide-react';

interface FieldDef {
  key: string;
  label_id: string;
  placeholder?: string;
  required: boolean;
  type?: string;
  max_length?: number;
}

interface Step3Props {
  subtype: string;
  onNext: (data: { formData: Record<string, string>; generatedLetter: string }) => void;
  onPrev: () => void;
}

export function WizardStep3({ subtype, onNext, onPrev }: Step3Props): JSX.Element {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [jumlahSaksi, setJumlahSaksi] = useState('2');
  const [loading, setLoading] = useState(false);
  const [loadingFields, setLoadingFields] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate(): Promise<void> {
      const { data } = await supabase
        .from('templates')
        .select('name_id, required_fields')
        .eq('subtype_id', subtype)
        .single();

      if (data) {
        setTemplateName(data.name_id as string);
        setFields((data.required_fields as FieldDef[]) ?? []);
      }
      setLoadingFields(false);
    }

    void fetchTemplate();
  }, [subtype]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.key]?.trim()) {
        newErrors[field.key] = `${field.label_id} wajib diisi`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      if (!user || !accessToken) {
        router.push(`/auth/login?redirect=/app`);
        return;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ subtype, fields: { ...formData, jumlah_saksi: jumlahSaksi } }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || 'Gagal membuat surat');
      }

      const { letter } = (await response.json()) as { letter: string };
      onNext({ formData, generatedLetter: letter });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat surat. Coba lagi.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWall>
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-1 text-primary-500 text-sm font-semibold mb-4 min-h-[2.75rem]"
        >
          <ChevronLeft size={16} />
          Kembali
        </button>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">
          Isi informasi yang diperlukan
        </h2>
        {templateName && (
          <p className="mt-1 text-gray-500 text-sm">{templateName}</p>
        )}
      </div>

      {loadingFields && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonInput key={i} />)}
        </div>
      )}

      {!loadingFields && fields.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Template tidak ditemukan</p>
        </div>
      )}

      {!loadingFields && fields.map((field) => (
        <Input
          key={field.key}
          label={field.label_id}
          placeholder={field.placeholder}
          required={field.required}
          maxLength={field.max_length}
          type={field.type ?? 'text'}
          error={errors[field.key]}
          value={formData[field.key] ?? ''}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, [field.key]: e.target.value }));
            if (errors[field.key]) {
              setErrors((prev) => { const next = { ...prev }; delete next[field.key]; return next; });
            }
          }}
        />
      ))}

      {/* Saksi-Saksi (optional) */}
      {!loadingFields && fields.length > 0 && (
        <div className="flex flex-col gap-1">
          <label htmlFor="jumlah-saksi" className="text-sm font-semibold text-gray-700">
            Saksi-Saksi (opsional)
          </label>
          <select
            id="jumlah-saksi"
            value={jumlahSaksi}
            onChange={(e) => setJumlahSaksi(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 min-h-[2.75rem] bg-white"
          >
            <option value="0">Tanpa saksi</option>
            <option value="1">1 saksi</option>
            <option value="2">2 saksi</option>
          </select>
          <p className="text-sm text-gray-500">
            Jumlah saksi yang akan menandatangani surat
          </p>
        </div>
      )}

      {apiError && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-danger-700 text-sm">
          {apiError}
        </div>
      )}

      {/* Privacy assurance — shown above submit when fields are visible */}
      {!loadingFields && fields.length > 0 && (
        <PrivacyAssurance />
      )}

      {!loadingFields && fields.length > 0 && (
        <div className="space-y-2">
          <Button type="submit" fullWidth size="lg" loading={loading}>
            Buat Surat
          </Button>
          <div className="flex justify-center">
            <SecurityBadge variant="encrypted" />
          </div>
        </div>
      )}
    </form>
    </AuthWall>
  );
}
