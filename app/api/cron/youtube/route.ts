import { NextResponse } from 'next/server'
import {
  getAccessToken, listUploads, getDetails, isShort, getTranscript,
  hasEnoughMaterial, thumbnailUrl, watchUrl, YouTubeAuthError, REQUIRED_YOUTUBE_ENV,
  type VideoDetail, type TranscriptSource,
} from '@/lib/youtube'
import { writeArticle, toPortableText, slugify } from '@/lib/article-writer'
import { SITE_URL } from '@/lib/constants'

export const runtime     = 'nodejs'
export const dynamic     = 'force-dynamic'
export const maxDuration = 60

/**
 * Turns a long-form upload into a draft article, once a day.
 *
 * What changed after the first version, and why:
 *
 * - It fails closed. The first version skipped the secret check whenever
 *   CRON_SECRET was unset, which left the route open to anyone who guessed the
 *   path. No secret now means no run.
 * - Missing configuration is a log line, not an email. A variable absent from
 *   Vercel produced the same failure email every morning, which is noise, not
 *   an alert. Real failures are emailed once, then again only if the error
 *   changes or is still happening RENOTIFY_DAYS later — tracked in a private
 *   Sanity document.
 * - It reads what was said. Articles are written from the caption track,
 *   fetched through the official API as the channel owner, with description and
 *   chapters for structure.
 *
 * Unchanged: it writes a draft, never a published post, and handles one video
 * per run — the model call takes most of the 60 seconds, so a backlog drains a
 * day at a time instead of timing out mid-write.
 */

const SANITY = 'https://h169b4gl.api.sanity.io/v2024-01-01'

/** A dot in the id makes the document invisible to unauthenticated reads. */
const STATE_ID = 'automation.youtube'

/** A failure that keeps happening is re-reported at most this often. */
const RENOTIFY_DAYS = 7

/** Each caption download costs 250 quota units; stop after this many per run. */
const MAX_CANDIDATES = 3

const REQUIRED = ['CRON_SECRET', 'SANITY_API_WRITE_TOKEN', 'ANTHROPIC_API_KEY', ...REQUIRED_YOUTUBE_ENV]

const SOURCE_NOTE: Record<TranscriptSource, string> = {
  'subtítulos':
    'escrito a partir de tus subtítulos.',
  'subtítulos automáticos':
    'escrito a partir de los subtítulos automáticos. Revisa nombres de herramientas y términos en inglés, que es donde suelen fallar.',
  'ninguna':
    'el video no tiene subtítulos disponibles, así que está escrito solo con la descripción y los capítulos y será más corto.',
}

// ─── Sanity ───────────────────────────────────────────────────────────────────

async function sanity(path: string, init?: RequestInit) {
  const res = await fetch(`${SANITY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.SANITY_API_WRITE_TOKEN}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return res.json()
}

/** Every video already turned into a post, published or still a draft. */
async function processedIds(): Promise<Set<string>> {
  const q = encodeURIComponent(`*[_type == "post" && defined(youtubeId)].youtubeId`)
  const { result } = await sanity(`/data/query/production?query=${q}`)
  return new Set((result as string[]).filter(Boolean))
}

async function uniqueSlug(base: string): Promise<string> {
  const q = encodeURIComponent(`*[_type == "post"].slug.current`)
  const { result } = await sanity(`/data/query/production?query=${q}`)
  const taken = new Set((result as string[]).filter(Boolean))
  if (!taken.has(base)) return base
  for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`
}

async function uploadThumbnail(videoId: string): Promise<string | null> {
  try {
    const img = await fetch(thumbnailUrl(videoId), { cache: 'no-store' })
    if (!img.ok) return null
    const bytes = await img.arrayBuffer()
    // YouTube answers 200 with a tiny placeholder when maxres does not exist.
    if (bytes.byteLength < 5_000) return null

    const res = await fetch(`${SANITY}/assets/images/production?filename=${videoId}.jpg`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${process.env.SANITY_API_WRITE_TOKEN}`, 'Content-Type': 'image/jpeg' },
      body:    bytes,
    })
    const json = await res.json()
    return json?.document?._id ?? null
  } catch {
    return null
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────

async function notify(subject: string, lines: string[]) {
  const key = process.env.RESEND_API_KEY
  const to  = process.env.RESEND_TO_EMAIL
  if (!key || !to) return
  try {
    await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? 'Nexxo <info@nexxodesign.com>',
        to, subject,
        text: lines.join('\n'),
      }),
    })
  } catch {
    // A failed notification must never fail the run.
  }
}

type State = {
  lastErrorKey?:  string | null
  lastErrorAt?:   string | null
  notifiedAt?:    string | null
  lastSuccessAt?: string | null
}

async function readState(): Promise<State | null> {
  const q = encodeURIComponent(`*[_id == "${STATE_ID}"][0]{ lastErrorKey, lastErrorAt, notifiedAt, lastSuccessAt }`)
  const { result } = await sanity(`/data/query/production?query=${q}`)
  return result ?? null
}

async function writeState(state: State) {
  await sanity('/data/mutate/production', {
    method: 'POST',
    body: JSON.stringify({
      mutations: [{ createOrReplace: { _id: STATE_ID, _type: 'automationState', ...state } }],
    }),
  })
}

/** Tells Alexander what to do, not just what broke. */
function explain(err: unknown): string {
  if (err instanceof YouTubeAuthError) {
    return `${err.message}\n\nVuelve a ejecutar "node scripts/youtube-auth.mjs" en tu ordenador y actualiza YOUTUBE_REFRESH_TOKEN en Vercel.`
  }
  const message = err instanceof Error ? err.message : String(err)
  if (message.startsWith('Sanity 401')) {
    return `Sanity rechazó el token. Revisa SANITY_API_WRITE_TOKEN en Vercel.\n\n${message}`
  }
  if (message.startsWith('Anthropic 401')) {
    return `Anthropic rechazó la clave. Revisa ANTHROPIC_API_KEY en Vercel.\n\n${message}`
  }
  return message
}

async function reportFailure(err: unknown): Promise<string> {
  const text = explain(err)
  const key  = text.slice(0, 160)
  console.error('[cron/youtube]', text)

  let state: State | null
  try {
    state = await readState()
  } catch {
    // Without the state there is no knowing whether this was already reported.
    // Rather than email every morning, fall back to at most once a week.
    if (new Date().getUTCDay() === 1) {
      await notify('La automatización de YouTube necesita atención', [
        text, '',
        'Este aviso se repite como máximo una vez por semana mientras el problema siga.',
      ])
    }
    return text
  }

  const now      = new Date()
  const sameKey  = state?.lastErrorKey === key
  const recently =
    !!state?.notifiedAt &&
    now.getTime() - new Date(state.notifiedAt).getTime() < RENOTIFY_DAYS * 86_400_000
  const email = !(sameKey && recently)

  if (email) {
    await notify('La automatización de YouTube necesita atención', [
      text, '',
      `No volverás a recibir este aviso salvo que el error cambie o siga ocurriendo dentro de ${RENOTIFY_DAYS} días.`,
    ])
  }

  try {
    await writeState({
      ...(state ?? {}),
      lastErrorKey: key,
      lastErrorAt:  now.toISOString(),
      notifiedAt:   email ? now.toISOString() : state?.notifiedAt ?? null,
    })
  } catch {
    // The email, if any, already went out.
  }

  return text
}

/** Clears a recorded failure so the next one is reported straight away. */
async function markHealthy(force = false) {
  try {
    const state = await readState()
    if (force || state?.lastErrorKey) {
      await writeState({ lastSuccessAt: new Date().toISOString(), lastErrorKey: null, lastErrorAt: null, notifiedAt: null })
    }
  } catch {
    // Not worth failing a good run over.
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  // Vercel sends this header on cron invocations when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 })
  }

  const missing = REQUIRED.filter(name => !process.env[name])
  if (missing.length) {
    console.error('[cron/youtube] configuración incompleta:', missing.join(', '))
    return NextResponse.json({ error: 'configuración incompleta', faltan: missing }, { status: 500 })
  }

  try {
    const token = await getAccessToken()
    const [uploads, done] = await Promise.all([listUploads(token), processedIds()])
    const pending = uploads.filter(id => !done.has(id))

    if (!pending.length) {
      await markHealthy()
      return NextResponse.json({ ok: true, subidas: uploads.length, pendientes: 0 })
    }

    const details = await getDetails(token, pending)
    const skipped: string[] = []
    let target: VideoDetail | null = null
    let transcript: { text: string; source: TranscriptSource } = { text: '', source: 'ninguna' }
    let tried = 0

    for (const video of details) {
      if (!video.isPublic)      { skipped.push(`${video.title} — no es público`); continue }
      if (await isShort(video)) { skipped.push(`${video.title} — Short`); continue }
      if (video.seconds < 180)  { skipped.push(`${video.title} — ${video.seconds}s`); continue }
      if (tried >= MAX_CANDIDATES) break
      tried++

      const t = await getTranscript(token, video.id)
      if (!hasEnoughMaterial(video, t.text)) {
        skipped.push(`${video.title} — poco material`)
        continue
      }
      target     = video
      transcript = t
      break
    }

    if (!target) {
      await markHealthy()
      return NextResponse.json({ ok: true, pendientes: pending.length, aptos: 0, descartados: skipped })
    }

    const article  = await writeArticle(target, transcript.text, transcript.source)
    const slug     = await uniqueSlug(slugify(article.title) || `video-${target.id.toLowerCase()}`)
    const coverRef = await uploadThumbnail(target.id)

    await sanity('/data/mutate/production', {
      method: 'POST',
      body: JSON.stringify({
        mutations: [{
          createOrReplace: {
            // `drafts.` keeps it off the live site. The id is keyed on the video,
            // not the slug, so it can never collide with an existing article.
            _id:   `drafts.post-yt-${target.id}`,
            _type: 'post',
            title:       article.title,
            slug:        { _type: 'slug', current: slug },
            publishedAt: target.publishedAt,
            excerpt:     article.excerpt,
            category:    article.category,
            tags:        article.tags ?? [],
            featured:    false,
            readingTime: article.readingTime ?? 5,
            youtubeId:   target.id,
            author:      { name: 'Alexander Moreno', role: 'Senior UI/UX Designer · Fundador de Nexxo' },
            body:        toPortableText(article),
            ...(coverRef && { coverImage: { _type: 'image', asset: { _type: 'reference', _ref: coverRef } } }),
          },
        }],
      }),
    })

    await markHealthy(true)

    await notify(`Borrador listo: ${article.title}`, [
      'Se generó un borrador a partir de uno de tus videos.',
      '',
      `Video:     ${target.title}`,
      `           ${watchUrl(target.id)}`,
      `Artículo:  ${article.title}`,
      `Fuente:    ${SOURCE_NOTE[transcript.source]}`,
      `Portada:   ${coverRef ? 'miniatura del video' : 'sin portada, ponla a mano'}`,
      '',
      `Revísalo y publícalo desde el Studio: ${SITE_URL}/studio`,
      'Está como BORRADOR: no sale en la web hasta que lo publiques.',
    ])

    return NextResponse.json({
      ok:          true,
      creado:      slug,
      desdeVideo:  target.id,
      fuente:      transcript.source,
      portada:     !!coverRef,
      descartados: skipped,
    })
  } catch (err) {
    const message = await reportFailure(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
