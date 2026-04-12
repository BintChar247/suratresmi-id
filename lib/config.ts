export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  gemini: {
    apiKey: process.env.GOOGLE_AI_API_KEY!,
  },
  midtrans: {
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  posthog: {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },
};
