'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

const STORAGE_KEY = 'suratresmi_pending_referral';

interface PendingReferral {
  code: string;
  source: string | null;
  capturedAt: number;
}

/**
 * Mounts globally (in app/layout.tsx). Two responsibilities:
 *
 * 1. On any page load, if `?ref=<code>` is in the URL, persist it to localStorage
 *    so it survives the OAuth/magic-link round-trip.
 * 2. Once the user is authenticated AND a pending referral exists, POST it to
 *    /api/referrals/capture and clear the storage. The endpoint is idempotent.
 */
export function ReferralCapture(): null {
  const { user, accessToken } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('ref');
    const source = params.get('utm_source');

    if (code && /^[0-9a-f]{8}$/i.test(code)) {
      try {
        const payload: PendingReferral = {
          code: code.toLowerCase(),
          source: source ? source.slice(0, 32) : null,
          capturedAt: Date.now(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // localStorage may be unavailable (private browsing) — ignore
      }
    }
  }, []);

  useEffect(() => {
    if (!user || !accessToken || typeof window === 'undefined') return;

    let pending: PendingReferral | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      pending = JSON.parse(raw) as PendingReferral;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    // Expire after 30 days
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    if (!pending || Date.now() - pending.capturedAt > THIRTY_DAYS_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    void fetch('/api/referrals/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ code: pending.code, source: pending.source }),
    })
      .then(() => {
        window.localStorage.removeItem(STORAGE_KEY);
      })
      .catch(() => {
        // network failure — keep the pending entry; we'll retry on next auth tick
      });
  }, [user, accessToken]);

  return null;
}
