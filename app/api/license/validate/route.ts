import { NextResponse } from 'next/server'

/**
 * Licence check for the Pro mode of the Framer components. Phase two: the route
 * is complete, but nothing calls it until the shop is live and the components
 * ship their Pro build.
 *
 * It exists as a proxy rather than a direct call from the component because a
 * Lemon Squeezy API key must never reach a Framer canvas — anyone could read it
 * from the published site and manage the account with it.
 *
 * How a component uses it:
 *
 *   // inside the component, e.g. isProEnabled()
 *   const res = await fetch('https://nexxodesign.com/api/license/validate', {
 *     method:  'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body:    JSON.stringify({ licenseKey, instanceName: 'mi-proyecto' }),
 *   })
 *   const { valid, productSlug, licenseName } = await res.json()
 *   return valid && productSlug === 'tech-specs-viewer'
 *
 * Passing `instanceName` activates the key for that project the first time and
 * validates it afterwards; omitting it only validates.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LEMON_API = 'https://api.lemonsqueezy.com/v1/licenses'

/** Framer's published and preview domains, plus anything added by env. */
const ALLOWED_SUFFIXES = ['.framer.app', '.framer.website']
const ALLOWED_HOSTS    = ['framer.com', 'www.framer.com']

function allowedOrigin(origin: string | null): string | null {
  if (!origin) return null
  let host: string
  try {
    host = new URL(origin).hostname
  } catch {
    return null
  }

  const extra = (process.env.LICENSE_ALLOWED_ORIGINS ?? '')
    .split(',').map(s => s.trim()).filter(Boolean)

  const ok =
    ALLOWED_HOSTS.includes(host) ||
    ALLOWED_SUFFIXES.some(suffix => host.endsWith(suffix)) ||
    extra.includes(host) ||
    extra.includes(origin)

  return ok ? origin : null
}

function cors(origin: string | null): Record<string, string> {
  const allowed = allowedOrigin(origin)
  return allowed
    ? {
        'Access-Control-Allow-Origin':  allowed,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age':       '86400',
        Vary:                           'Origin',
      }
    : { Vary: 'Origin' }
}

/**
 * Rate limit per IP. In memory, so it is per instance — enough to blunt a key
 * being brute-forced from one place, and the honest ceiling for a site with no
 * Redis. Move it to a shared store if the components ever get popular.
 */
const WINDOW_MS = 60_000
const MAX_HITS  = 20
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    // Opportunistic cleanup; without it the map grows for the life of the
    // instance.
    if (hits.size > 5_000) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key)
    }
    return false
  }

  entry.count += 1
  return entry.count > MAX_HITS
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: cors(request.headers.get('origin')) })
}

export async function POST(request: Request) {
  const origin  = request.headers.get('origin')
  const headers = cors(origin)

  // A browser blocks the response without the header anyway; refusing here
  // means an unknown site cannot use the endpoint as a free licence oracle.
  if (origin && !allowedOrigin(origin)) {
    return NextResponse.json({ valid: false, error: 'origen no permitido' }, { status: 403, headers })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'desconocida'
  if (rateLimited(ip)) {
    return NextResponse.json({ valid: false, error: 'demasiadas peticiones' }, { status: 429, headers })
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  if (!apiKey) {
    console.error('[license] falta LEMONSQUEEZY_API_KEY')
    return NextResponse.json({ valid: false, error: 'validación no disponible' }, { status: 503, headers })
  }

  let body: { licenseKey?: string; instanceName?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ valid: false, error: 'cuerpo inválido' }, { status: 400, headers })
  }

  const licenseKey = body.licenseKey?.trim()
  if (!licenseKey) {
    return NextResponse.json({ valid: false, error: 'falta licenseKey' }, { status: 400, headers })
  }

  // With an instance name this activates the key for that project; without it,
  // it only checks the key.
  const activate = !!body.instanceName?.trim()
  const form = new URLSearchParams({ license_key: licenseKey })
  if (activate) form.set('instance_name', body.instanceName!.trim())

  try {
    const res = await fetch(`${LEMON_API}/${activate ? 'activate' : 'validate'}`, {
      method:  'POST',
      headers: {
        Accept:          'application/json',
        'Content-Type':  'application/x-www-form-urlencoded',
        Authorization:   `Bearer ${apiKey}`,
      },
      body:  form,
      cache: 'no-store',
    })

    const json = await res.json().catch(() => ({}))
    const meta = (json?.meta ?? {}) as Record<string, unknown>

    const valid = res.ok && json?.activated !== false && json?.valid !== false

    return NextResponse.json({
      valid,
      // custom_data travels with the checkout, so the slug is what the store
      // sent; the product name is the fallback when it was bought elsewhere.
      productSlug: (meta.custom_data as { product_slug?: string } | undefined)?.product_slug
        ?? (typeof meta.product_name === 'string' ? meta.product_name : null),
      licenseName: typeof meta.variant_name === 'string' ? meta.variant_name : null,
    }, { status: valid ? 200 : 403, headers })
  } catch (err) {
    console.error('[license] error consultando Lemon Squeezy:', err)
    return NextResponse.json({ valid: false, error: 'no se pudo validar' }, { status: 502, headers })
  }
}
