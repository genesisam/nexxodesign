import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NOINDEX } from './lib/seo'
import type { NextRequest } from 'next/server'
import { NextResponse as NR } from 'next/server'

const handleI18n = createMiddleware(routing)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect legacy /work and /en/work to /proyectos and /en/proyectos
  if (pathname === '/work' || pathname.startsWith('/work/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/work/, '/proyectos')
    return NR.redirect(url, 301)
  }
  if (pathname === '/en/work' || pathname.startsWith('/en/work/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/en\/work/, '/en/proyectos')
    return NR.redirect(url, 301)
  }

  const response = handleI18n(request)

  // Detect locale from URL for the x-locale header (used by root layout for lang attr)
  const locale = pathname.startsWith('/en') ? 'en' : 'es'
  response.headers.set('x-locale', locale)

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|studio|api|.*\\..*).*)'],
}
