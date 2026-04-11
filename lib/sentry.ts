import * as Sentry from '@sentry/nextjs';

export function initSentry(): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}

export function captureException(
  error: Error,
  context?: Record<string, unknown>
): void {
  Sentry.captureException(error, {
    contexts: { app: context ?? {} },
  });
}
