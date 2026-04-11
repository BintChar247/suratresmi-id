'use client';

import posthog from 'posthog-js';

export function initializeAnalytics(userId?: string): void {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: 'https://app.posthog.com',
    autocapture: false,
  });

  if (userId) {
    posthog.identify(userId);
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  posthog.capture(eventName, properties);
}
