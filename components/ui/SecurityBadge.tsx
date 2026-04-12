'use client';

import React from 'react';
import { Shield, Lock, Eye, Trash2 } from 'lucide-react';

/**
 * Compact trust badge shown inline near forms and CTAs.
 * Variants:
 *   - "encrypted"  — shown on the form step (Step 3)
 *   - "private"    — shown on the landing page
 *   - "deletable"  — shown in account settings
 */
type BadgeVariant = 'encrypted' | 'private' | 'deletable';

interface SecurityBadgeProps {
  variant?: BadgeVariant;
  className?: string;
}

const BADGE_CONFIG: Record<BadgeVariant, { icon: typeof Shield; text: string }> = {
  encrypted: {
    icon: Lock,
    text: 'Data dienkripsi AES-256',
  },
  private: {
    icon: Eye,
    text: 'Data pribadi tidak dijual atau dibagikan',
  },
  deletable: {
    icon: Trash2,
    text: 'Hapus data kapan saja (UU PDP)',
  },
};

export function SecurityBadge({ variant = 'encrypted', className = '' }: SecurityBadgeProps): JSX.Element {
  const config = BADGE_CONFIG[variant];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs text-gray-500 ${className}`}>
      <Icon size={13} className="text-success-500 flex-shrink-0" />
      <span>{config.text}</span>
    </div>
  );
}

/**
 * Full privacy assurance banner — shown below the form on Step 3 and on the
 * landing page trust section.
 */
export function PrivacyAssurance({ className = '' }: { className?: string }): JSX.Element {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Shield size={18} className="text-success-500" />
        <span className="text-sm font-semibold text-gray-700">Keamanan Data Anda</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          { icon: Lock, text: 'Enkripsi AES-256 untuk semua data pribadi' },
          { icon: Eye, text: 'Data tidak dijual atau dibagikan ke pihak ketiga' },
          { icon: Trash2, text: 'Hapus semua data kapan saja — hak Anda di UU PDP' },
          { icon: Shield, text: 'Sesuai UU No. 27/2022 Pelindungan Data Pribadi' },
        ].map((item) => (
          <div key={item.text} className="flex items-start gap-2">
            <item.icon size={14} className="text-success-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-600">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
