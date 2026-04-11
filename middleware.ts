import { NextRequest, NextResponse } from 'next/server';

// Rate limiting: max 10 requests per IP per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10;
const ipRequests = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest): NextResponse {
  // Skip rate limiting for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    /\.(jpg|jpeg|png|gif|ico|css|js|woff)$/.test(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (record && now < record.resetTime) {
    record.count++;
    if (record.count > RATE_LIMIT_MAX) {
      return new NextResponse('Too many requests', { status: 429 });
    }
  } else {
    ipRequests.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }

  // Protect API routes: require authentication for /api/generate and /api/payment
  if (
    request.nextUrl.pathname.startsWith('/api/generate') ||
    request.nextUrl.pathname.startsWith('/api/payment')
  ) {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader || !cookieHeader.includes('sb-')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
