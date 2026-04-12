import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

// Rate limiting: buckets are keyed by "<ip>:<endpoint_bucket>"
// /api/generate gets a stricter limit (20/min); all other API routes share 10/min.
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const DEFAULT_LIMIT = 10;
const GENERATE_LIMIT = 20; // IP-level limit (per-user limit is enforced inside the route)

const ipRequests = new Map<string, { count: number; resetTime: number }>();

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Skip for static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    /\.(jpg|jpeg|png|gif|ico|css|js|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request: { headers: request.headers } });

  // Refresh session on every request so it doesn't expire
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;

  // Redirect unauthenticated users from /app to login
  if (pathname.startsWith('/app') && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rate limiting — extract rightmost IP from x-forwarded-for to prevent spoofing
  let ip = 'unknown';
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // Take rightmost IP (closest to our server) when behind trusted proxies
    const ips = xForwardedFor.split(',').map(i => i.trim());
    ip = ips[ips.length - 1];
  } else {
    ip = request.headers.get('x-real-ip') ?? 'unknown';
  }

  const isGenerate = pathname.startsWith('/api/generate');
  const isApiRoute = pathname.startsWith('/api/');

  if (isApiRoute) {
    const bucketKey = `${ip}:${isGenerate ? 'generate' : 'api'}`;
    const limit = isGenerate ? GENERATE_LIMIT : DEFAULT_LIMIT;
    const now = Date.now();

    const record = ipRequests.get(bucketKey);
    if (record && now < record.resetTime) {
      record.count++;
      if (record.count > limit) {
        return new NextResponse(
          JSON.stringify({ error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      ipRequests.set(bucketKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }
    // Auth for API routes is handled by each route handler (Bearer token validation).
    // Middleware only enforces IP-level rate limiting here.
  }

  return response;
}

export const config = {
  matcher: ['/:path*'],
};
