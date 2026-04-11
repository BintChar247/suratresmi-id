import { NextRequest, NextResponse } from 'next/server';

// Rate limiting: buckets are keyed by "<ip>:<endpoint_bucket>"
// /api/generate gets a stricter limit (20/min); all other API routes share 10/min.
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const DEFAULT_LIMIT = 10;
const GENERATE_LIMIT = 20; // IP-level limit (per-user limit is enforced inside the route)

const ipRequests = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Skip rate limiting for static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    /\.(jpg|jpeg|png|gif|ico|css|js|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  const isGenerate = pathname.startsWith('/api/generate');
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

  // Protect /api/generate and /api/payment — require a Supabase session cookie.
  // The route itself validates the Bearer token; this is a quick early-exit guard.
  if (isGenerate || pathname.startsWith('/api/payment')) {
    const cookieHeader = request.headers.get('cookie') ?? '';
    if (!cookieHeader.includes('sb-')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
