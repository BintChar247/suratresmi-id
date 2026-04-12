'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { SecurityBadge } from '@/components/ui/SecurityBadge';
import { Shield, Download, Trash2, ChevronLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage(): JSX.Element {
  const { user, accessToken, signOut } = useAuth();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!user) {
    router.push('/auth/login?redirect=/app/settings');
    return <div />;
  }

  const handleExportData = async (): Promise<void> => {
    setExporting(true);
    setMessage(null);
    try {
      const response = await fetch('/api/user/export-data', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error('Gagal mengekspor data');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suratresmi-data-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Data berhasil diekspor.' });
    } catch {
      setMessage({ type: 'error', text: 'Gagal mengekspor data. Coba lagi.' });
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteData = async (): Promise<void> => {
    if (deleteInput !== 'HAPUS DATA SAYA') return;
    setDeleting(true);
    setMessage(null);
    try {
      const response = await fetch('/api/user/delete-data', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error('Gagal menghapus data');

      setMessage({ type: 'success', text: 'Semua data telah dihapus. Anda akan keluar.' });
      setTimeout(() => void signOut(), 2000);
    } catch {
      setMessage({ type: 'error', text: 'Gagal menghapus data. Hubungi dpo@suratresmi.id.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/app"
            className="flex items-center gap-1 text-primary-500 text-sm font-semibold mb-4 min-h-[2.75rem]"
          >
            <ChevronLeft size={16} />
            Kembali
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Pengaturan Akun</h1>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        </div>

        {/* Privacy & Data Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-success-500" />
            <h2 className="text-lg font-bold text-gray-900">Privasi & Data Pribadi</h2>
          </div>

          <p className="text-sm text-gray-500">
            Sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP), Anda memiliki hak
            penuh atas data pribadi Anda.
          </p>

          {/* Info cards */}
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <SecurityBadge variant="encrypted" className="mb-2" />
              <p className="text-xs text-gray-500">
                Semua data pribadi Anda (nama, NIK/KTP, alamat) dienkripsi dengan AES-256
                sebelum disimpan di database. Bahkan admin tidak bisa membaca data asli Anda.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <SecurityBadge variant="private" className="mb-2" />
              <p className="text-xs text-gray-500">
                Data Anda hanya digunakan untuk membuat surat yang Anda minta. Kami tidak menjual,
                membagikan, atau menggunakan data Anda untuk iklan atau tujuan lainnya.
              </p>
            </div>
          </div>
        </div>

        {/* Export Data */}
        <div className="border border-gray-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-primary-500" />
            <h3 className="font-semibold text-gray-900">Ekspor Data Saya</h3>
          </div>
          <p className="text-sm text-gray-500">
            Unduh semua data pribadi Anda dalam format JSON, termasuk profil, surat yang dibuat,
            dan riwayat transaksi. Ini adalah hak akses data Anda sesuai UU PDP.
          </p>
          <Button
            variant="outline"
            loading={exporting}
            onClick={() => void handleExportData()}
          >
            <Download size={16} className="mr-2" />
            Ekspor Semua Data
          </Button>
        </div>

        {/* Delete Data */}
        <div className="border border-danger-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 size={18} className="text-danger-500" />
            <h3 className="font-semibold text-danger-700">Hapus Semua Data</h3>
          </div>
          <p className="text-sm text-gray-500">
            Menghapus semua data pribadi Anda secara permanen dari sistem kami: surat, riwayat
            transaksi, dan tiket dukungan. Tindakan ini tidak dapat dibatalkan.
          </p>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="border-danger-300 text-danger-600 hover:bg-danger-50"
            >
              <Trash2 size={16} className="mr-2" />
              Hapus Semua Data Saya
            </Button>
          ) : (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 space-y-3">
              <div className="flex gap-2">
                <AlertTriangle size={18} className="text-danger-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-danger-700">
                  <strong>Peringatan:</strong> Semua surat, data pribadi, dan riwayat transaksi
                  akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div>
                <label htmlFor="delete-confirm" className="text-xs font-semibold text-danger-700 block mb-1">
                  Ketik &quot;HAPUS DATA SAYA&quot; untuk konfirmasi:
                </label>
                <input
                  id="delete-confirm"
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full px-3 py-2 border border-danger-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-danger-300"
                  placeholder="HAPUS DATA SAYA"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  loading={deleting}
                  disabled={deleteInput !== 'HAPUS DATA SAYA'}
                  onClick={() => void handleDeleteData()}
                  className="bg-danger-500 hover:bg-danger-600 text-white disabled:opacity-50"
                >
                  Hapus Permanen
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Legal links */}
        <div className="text-center space-y-2 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Pertanyaan tentang privasi? Hubungi DPO kami di{' '}
            <a href="mailto:dpo@suratresmi.id" className="text-primary-500 underline">
              dpo@suratresmi.id
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">Kebijakan Privasi</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-gray-600">Syarat & Ketentuan</Link>
          </div>
        </div>

        {/* Status message */}
        {message && (
          <div
            className={`rounded-lg p-4 text-sm ${
              message.type === 'success'
                ? 'bg-success-50 border border-success-200 text-success-700'
                : 'bg-danger-50 border border-danger-200 text-danger-700'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
