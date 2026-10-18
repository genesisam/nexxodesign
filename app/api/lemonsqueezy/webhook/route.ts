import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { verifyWebhookSignature } from '@/lib/lemonsqueezy-signature'

/**
 * Lemon Squeezy webhook. Ready before the shop is: with no secret configured it
 * refuses everything, which is the correct behaviour for an endpoint whose
 * signing key does not exist yet.
 *
 * Three things matter here:
 *
 * - The signature is checked against the RAW body. Parsing first and
 *   re-serialising changes bytes, and the HMAC stops matching for reasons that
 *   look like a platform bug.
 * - Comparison is timing-safe. A plain === leaks, one character at a time,
 *   where a forged signature went wrong.
 * - Delivery is at-least-once, so the same order can arrive twice. Processed
 *   event ids live in Sanity rather than in memory: every serverless instance
 *   has its own memory, so an in-memory set would let a duplicate through
 *   whenever the retry lands on a different instance.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SANITY   = 'https://h169b4gl.api.sanity.io/v2024-01-01'
const STATE_ID = 'automation.lemonsqueezy'
/** Enough history to cover a retry storm without the document growing forever. */
const KEEP_IDS = 200

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.RESEND_FROM_EMAIL ?? 'noreply@nexxodesign.com'
const TO     = process.env.NOTIFY_EMAIL ?? process.env.RESEND_TO_EMAIL ?? 'info@nexxodesign.com'

type SeenState = { ids?: string[] }

async function sanity(path: string, init?: RequestInit) {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return null
  const res = await fetch(`${SANITY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Sanity ${res.status}`)
  return res.json()
}

async function alreadyHandled(eventId: string): Promise<boolean> {
  try {
    const q = encodeURIComponent(`*[_id == "${STATE_ID}"][0]{ ids }`)
    const json = await sanity(`/data/query/production?query=${q}`)
    const state = (json?.result ?? null) as SeenState | null
    return !!state?.ids?.includes(eventId)
  } catch {
    // Unknown is not the same as handled: better to process a duplicate than to
    // drop a real order because the CMS blinked.
    return false
  }
}

async function remember(eventId: string) {
  try {
    const q = encodeURIComponent(`*[_id == "${STATE_ID}"][0]{ ids }`)
    const json = await sanity(`/data/query/production?query=${q}`)
    const prev = ((json?.result ?? null) as SeenState | null)?.ids ?? []
    const ids  = [eventId, ...prev.filter(id => id !== eventId)].slice(0, KEEP_IDS)
    await sanity('/data/mutate/production', {
      method: 'POST',
      body: JSON.stringify({
        mutations: [{ createOrReplace: { _id: STATE_ID, _type: 'automationState', ids } }],
      }),
    })
  } catch (err) {
    console.error('[lemonsqueezy] no se pudo registrar el evento:', err)
  }
}

type LemonPayload = {
  meta?: {
    event_name?: string
    custom_data?: { product_slug?: string; license?: string }
  }
  data?: {
    id?: string
    attributes?: Record<string, unknown>
  }
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')
const num = (v: unknown) => (typeof v === 'number' ? v : null)

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    console.error('[lemonsqueezy] falta LEMONSQUEEZY_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'webhook no configurado' }, { status: 500 })
  }

  const raw = await request.text()
  if (!verifyWebhookSignature(raw, request.headers.get('x-signature'), secret)) {
    console.error('[lemonsqueezy] firma inválida')
    return NextResponse.json({ error: 'firma inválida' }, { status: 401 })
  }

  let payload: LemonPayload
  try {
    payload = JSON.parse(raw) as LemonPayload
  } catch {
    return NextResponse.json({ error: 'cuerpo no es JSON' }, { status: 400 })
  }

  const event = payload.meta?.event_name ?? ''
  // Lemon Squeezy repeats the resource id on a retry, so it is the dedupe key.
  const eventId = `${event}:${payload.data?.id ?? ''}`

  if (!payload.data?.id) {
    return NextResponse.json({ error: 'evento sin id' }, { status: 400 })
  }

  if (await alreadyHandled(eventId)) {
    console.log('[lemonsqueezy] evento repetido, ignorado:', eventId)
    return NextResponse.json({ ok: true, duplicado: true })
  }

  if (event !== 'order_created' && event !== 'license_key_created') {
    console.log('[lemonsqueezy] evento ignorado:', event)
    return NextResponse.json({ ok: true, ignorado: event })
  }

  const attrs       = payload.data.attributes ?? {}
  const email       = str(attrs.user_email)
  const buyerName   = str(attrs.user_name)
  const productName = str(attrs.product_name) || str(attrs.first_order_item && (attrs.first_order_item as Record<string, unknown>).product_name)
  const variantName = str(attrs.variant_name)
  const totalCents  = num(attrs.total)
  const slug        = payload.meta?.custom_data?.product_slug ?? ''
  const license     = payload.meta?.custom_data?.license ?? variantName

  console.log('[lemonsqueezy]', event, { slug, license, productName, email: !!email })

  // The buyer joins the launch list, when there is a list to join.
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (audienceId && email) {
      await resend.contacts.create({ email, audienceId, unsubscribed: false })
    }
  } catch (err) {
    console.error('[lemonsqueezy] Resend audience:', err)
  }

  try {
    await resend.emails.send({
      from:    `Nexxo Tienda <${FROM}>`,
      to:      TO,
      replyTo: email || undefined,
      subject: event === 'order_created'
        ? `Venta — ${productName || slug || 'producto'}`
        : `Licencia emitida — ${productName || slug || 'producto'}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;color:#111">
          <h2 style="margin:0 0 20px;font-size:20px">${event === 'order_created' ? 'Nueva venta' : 'Licencia emitida'}</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#666;width:120px">Producto</td><td style="padding:6px 0;font-weight:600">${productName || slug || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Licencia</td><td style="padding:6px 0">${license || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Comprador</td><td style="padding:6px 0">${buyerName || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0">${email ? `<a href="mailto:${email}" style="color:#5B3DF5">${email}</a>` : '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Total</td><td style="padding:6px 0">${totalCents !== null ? `US$${(totalCents / 100).toFixed(2)}` : '—'}</td></tr>
          </table>
        </div>
      `,
    })
  } catch (err) {
    // The sale is already made; a failed notification must not make Lemon
    // Squeezy retry and risk a second one.
    console.error('[lemonsqueezy] Resend email:', err)
  }

  await remember(eventId)

  return NextResponse.json({ ok: true })
}
