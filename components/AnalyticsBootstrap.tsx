'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { initializeAnalytics, trackEvent } from '@/lib/analytics';

const SIGNUP_FIRED_KEY = 'suratresmi_signup_tracked';

/**
 * Mounts in app/layout.tsx. Two responsibilities:
 *   1. Boot PostHog once on the client.
 *   2. Once a user is authenticated, identify them and fire `signup_completed`
 *      exactly once per user (tracked via localStorage so we don't double-count
 *      across sessions).
 */
export function AnalyticsBootstrap(): null {
  const { user } = useAuth();
  const initedRef = useRef(false);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;
    initializeAnalytics(user?.id);
  }, [user?.id]);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    const key = `${SIGNUP_FIRED_KEY}_${user.id}`;
    if (window.localStorage.getItem(key)) return;

    trackEvent('signup_completed', {
      provider: user.app_metadata?.provider ?? 'unknown',
    });

    try {
      window.localStorage.setItem(key, '1');
    } catch {
      // ignore
    }
  }, [user]);

  return null;
}
