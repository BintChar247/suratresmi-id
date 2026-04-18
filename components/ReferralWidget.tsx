'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { trackEvent } from '@/lib/analytics';
import { Gift, MessageCircle, Send, Copy, Check } from 'lucide-react';

interface ReferralStats {
  invited: number;
  converted: number;
  credits_earned: number;
}

export function ReferralWidget(): JSX.Element | null {
  const { user, accessToken } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);

  const referralCode = user ? user.id.slice(0, 8) : null;
  const referralLink = referralCode ? `https://suratresmi.online/?ref=${referralCode}` : '';

  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/referrals/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ReferralStats | null) => {
        if (data) setStats(data);
      })
      .catch(() => {
        // silent — widget still works without stats
      });
  }, [accessToken]);

  if (!user) return null;

  const shareText =
    `Saya pakai SuratResmi.Online untuk bikin surat resmi. Gratis 3 surat pertama: ${referralLink}`;

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'copy'): void => {
    trackEvent('referral_shared', { platform });

    if (platform === 'whatsapp') {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText)}`,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    void navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="border border-primary-200 bg-primary-50 rounded-lg p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Gift size={20} className="text-primary-600" />
        <h3 className="font-semibold text-gray-900">Ajak Teman, Dapat 3 Surat Gratis</h3>
      </div>

      <p className="text-sm text-gray-600">
        Setiap teman yang mendaftar lewat link Anda mendapat 3 surat gratis. Anda dapat 3 kredit
        bonus saat mereka melakukan pembelian pertama.
      </p>

      <div className="bg-white border border-primary-200 rounded-lg p-3 flex items-center gap-2">
        <code className="flex-1 text-xs text-gray-700 truncate font-mono">{referralLink}</code>
        <button
          type="button"
          onClick={() => handleShare('copy')}
          className="text-primary-600 hover:text-primary-700 text-xs font-semibold flex items-center gap-1"
          aria-label="Salin link referral"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Tersalin' : 'Salin'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleShare('whatsapp')}
          className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          <MessageCircle size={14} />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => handleShare('twitter')}
          className="flex items-center justify-center gap-1 bg-[#1DA1F2] hover:bg-[#1991da] text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          <Send size={14} />
          Twitter
        </button>
        <button
          type="button"
          onClick={() => handleShare('copy')}
          className="flex items-center justify-center gap-1 bg-gray-700 hover:bg-gray-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          Copy
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-primary-200 text-center">
          <div>
            <div className="text-xl font-bold text-gray-900">{stats.invited}</div>
            <div className="text-xs text-gray-500">Diundang</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{stats.converted}</div>
            <div className="text-xs text-gray-500">Konversi</div>
          </div>
          <div>
            <div className="text-xl font-bold text-primary-600">{stats.credits_earned}</div>
            <div className="text-xs text-gray-500">Kredit</div>
          </div>
        </div>
      )}
    </div>
  );
}
