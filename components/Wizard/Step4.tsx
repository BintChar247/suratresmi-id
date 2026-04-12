'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';
import { ChevronLeft, Download, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface Step4Props {
  letter: string;
  onPrev: () => void;
  onRestart: () => void;
}

export function WizardStep4({ letter, onPrev, onRestart }: Step4Props): JSX.Element {
  const { accessToken } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadPDF = async (): Promise<void> => {
    setDownloading(true);
    setDownloadError(null);
    try {
      if (!accessToken) {
        throw new Error('Sesi tidak valid. Silakan masuk ulang.');
      }

      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ letter }),
      });

      if (!response.ok) throw new Error('Gagal mengunduh PDF');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'surat-resmi.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError('Gagal mengunduh PDF. Coba lagi.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="text-center">
        <CheckCircle className="mx-auto text-success-500 mb-3" size={48} />
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Surat Anda siap!</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Lihat pratinjau di bawah, lalu unduh dalam format PDF
        </p>
      </div>

      {/* Letter preview */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
        <pre className="text-sm text-gray-800 font-serif whitespace-pre-wrap leading-relaxed">
          {letter}
        </pre>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 bg-warning-50 border border-warning-200 p-4 rounded-lg">
        <AlertTriangle className="text-warning-600 flex-shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-warning-900">
          <strong>Periksa kembali</strong> sebelum digunakan. Dokumen ini dibuat oleh AI dan
          bersifat draf. Konsultasikan dengan notaris atau pengacara untuk keperluan hukum formal.
        </p>
      </div>

      {downloadError && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-danger-700 text-sm">
          {downloadError}
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Button variant="outline" fullWidth onClick={onPrev}>
          <ChevronLeft size={16} className="mr-1" />
          Edit
        </Button>
        <Button fullWidth loading={downloading} onClick={() => void handleDownloadPDF()}>
          <Download size={16} className="mr-1" />
          Unduh PDF
        </Button>
      </div>

      <Button variant="secondary" fullWidth onClick={onRestart}>
        <RefreshCw size={16} className="mr-2" />
        Buat Surat Lain
      </Button>
    </div>
  );
}
