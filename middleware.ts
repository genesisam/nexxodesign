import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NOINDEX } from './lib/seo'
import type { NextRequest } from 'next/server'
import { NextResponse as NR } from 'next/server'

const handleI18n = createMiddleware(routing)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The English tree is gone. Anything still pointing at /en/... lands on the
  // Spanish equivalent rather than a 404 — a permanent redirect, because the
  // move is permanent.
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/en/, '') || '/'
    return NR.redirect(url, 301)
  }

  // Legacy /work → /proyectos
  if (pathname === '/work' || pathname.startsWith('/work/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/work/, '/proyectos')
    return NR.redirect(url, 301)
  }

  const response = handleI18n(request)

  // Kept so the root layout still has a locale to put on <html lang>.
  response.headers.set('x-locale', 'es')

  // Soft launch: strongest of the three noindex layers — applies to every
  // response the middleware touches, not just rendered HTML.
  if (NOINDEX) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
      "font-src 'self' https://api.fontshare.com https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cdn.sanity.io",
      "media-src 'self' https://cdn.sanity.io blob:",
      "worker-src blob:",
      "connect-src 'self' https://cdn.sanity.io https://*.sanity.io",
      "frame-src 'none'",
      "object-src 'none'",
    ].join('; '),
  )

  return response
}

export const config = {
  // `_vercel` is excluded because the analytics and speed-insights beacons post
  // to /_vercel/insights/view and /_vercel/speed-insights/vitals. Those carry no
  // file extension, so the trailing `.*\..*` rule does not catch them, and
  // next-intl would try to localise the path and redirect the beacon away.
  matcher: ['/((?!_next/static|_next/image|_vercel|favicon.ico|studio|api|.*\\..*).*)'],
}
