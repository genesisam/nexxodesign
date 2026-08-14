import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/constants'

export { SITE_URL }

/**
 * Soft-launch switch. While `NEXT_PUBLIC_NOINDEX=1` the site is reachable on its
 * real domain but asks every crawler to stay away, on three independent layers:
 * robots.txt, a `robots` meta tag, and an `X-Robots-Tag` header (which also
 * covers non-HTML responses like the OG image).
 *
 * Set it to `0` — or delete it — to go live.
 */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === '1'

/**
 * Path for a route under `localePrefix: 'as-needed'`: the default locale (es)
 * is served unprefixed, every other locale is served under `/<locale>`.
 *
 * Building `/es/...` by hand produces a 307 to the unprefixed URL, so canonical
 * tags and sitemap entries must go through here.
 */
export function localizedPath(locale: string, path = ''): string {
  const clean  = path && !path.startsWith('/') ? `/${path}` : path
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return `${prefix}${clean}` || '/'
}

export function absoluteUrl(locale: string, path = ''): string {
  const p = localizedPath(locale, path)
  return p === '/' ? SITE_URL : `${SITE_URL}${p}`
}

/**
 * Canonical + hreflang for a single page. `path` is the locale-agnostic route
 * (`''` for home, `/proyectos`, `/proyectos/merxo`, …).
 *
 * Every page must declare its own, otherwise it inherits the nearest layout's
 * canonical and reports itself as a duplicate of that page.
 *
 * `languages` is emitted only when there is more than one locale. A single-locale
 * site that still ships hreflang is pointing every alternate at the page itself,
 * which says nothing and reads as a mistake to anyone auditing it.
 */
export function buildAlternates(locale: string, path = '') {
  const canonical = absoluteUrl(locale, path)
  if (routing.locales.length < 2) return { canonical }

  return {
    canonical,
    languages: {
      ...Object.fromEntries(routing.locales.map(l => [l, absoluteUrl(l, path)])),
      'x-default': absoluteUrl(routing.defaultLocale, path),
    },
  }
}
