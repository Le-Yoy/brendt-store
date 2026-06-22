// Edge middleware: detect the visitor's country (Vercel geolocation) and set a
// `region` cookie (MA/EU/US/OTHER) so the store shows the right currency + payment
// options. A manual switch in the header overrides this, so we never overwrite an
// existing `region` cookie.
import { NextResponse } from 'next/server';
import { regionFromCountry } from '@/utils/currency';

export function middleware(request) {
  const response = NextResponse.next();

  // Respect a manual override already chosen by the visitor.
  if (request.cookies.get('region')) return response;

  // Vercel populates request.geo.country in production; fall back to the header.
  const country =
    request.geo?.country ||
    request.headers.get('x-vercel-ip-country') ||
    '';

  const region = regionFromCountry(country);
  response.cookies.set('region', region, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  // Run on pages only — skip API, Next internals, and static assets.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|icon-|apple-touch|manifest|sitemap|robots).*)'],
};
