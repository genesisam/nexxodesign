import { NextResponse } from 'next/server'
import { fetchFeed, fetchDetail, isLongForm, thumbnailUrl, watchUrl, LONG_FORM_SECONDS } from '@/lib/youtube'
import { writeArticle, toPortableText, slugify } from '@/lib/article-writer'
import { SITE_URL } from '@/lib/constants'

export const runtime     = 'nodejs'
export const dynamic     = 'force-dynamic'
export const maxDuration = 60

const SANITY = 'https://h169b4gl.api.sanity.io/v2024-01-01'

/**
 * Turns a new long-form upload into a draft article, once a day.
 *
 * Three decisions worth stating, because each one is a failure mode avoided:
 *
 * 1. It writes a DRAFT, never a published post. Sanity treats `drafts.<id>` as
 *    unpublished, so the article waits in the Studio and never reaches the site
 *    until Alexander presses publish. A portfolio that sells design judgement
 *    cannot afford to auto-publish text nobody read, and an article generated
 *    from a description will occasionally get something wrong.
 * 2. One video per run. The function has 60 seconds and a model call is most of
 *    it; a backlog drains a day at a time rather than timing out halfway and
 *    leaving a half-written document behind.
 * 3. Shorts are excluded by duration read from the video itself, not by
 *    guessing from the title. Eleven of the fifteen videos on this channel are
 *    Shorts, so getting that filter wrong would mean mostly noise.
 */

type SanityPost = { youtubeId?: string }

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

/** Everything already turned into a post, published or still a draft. */
async function processedIds(): Promise<Set<string>> {
  const q = encodeURIComponent(`*[_type == "post" && defined(youtubeId)]{ youtubeId }`)
  const { result } = await sanity(`/data/query/production?query=${q}`)
  return new Set((result as SanityPost[]).map(r => r.youtubeId).filter(Boolean) as string[])
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
    // A failed notification must not fail the run — the draft is already saved.
  }
}

export async function GET(request: Request) {
  // Vercel signs cron invocations with this. Without the check the endpoint is
  // an open door to anyone who guesses the path and can spend API credits.
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 })
  }

  const channelId = process.env.YOUTUBE_CHANNEL_ID
  if (!channelId) {
    return NextResponse.json({ error: 'YOUTUBE_CHANNEL_ID no configurado' }, { status: 500 })
  }

  try {
    const [feed, done] = await Promise.all([fetchFeed(channelId), processedIds()])
    const pending = feed.filter(v => !done.has(v.id))

    if (!pending.length) {
      return NextResponse.json({ ok: true, revisados: feed.length, nuevos: 0 })
    }

    // Newest first, and stop at the first long-form one.
    let target = null
    const skipped: string[] = []
    for (const item of pending) {
      const detail = await fetchDetail(item)
      if (!detail) continue
      if (!isLongForm(detail)) { skipped.push(`${detail.title} (${detail.seconds}s)`); continue }
      target = detail
      break
    }

    if (!target) {
      return NextResponse.json({ ok: true, nuevos: pending.length, largos: 0, descartados: skipped })
    }

    const article  = await writeArticle(target)
    const slug     = slugify(article.title)
    const coverRef = await uploadThumbnail(target.id)

    await sanity('/data/mutate/production', {
      method: 'POST',
      body: JSON.stringify({
        mutations: [{
          createOrReplace: {
            // The `drafts.` prefix is what keeps this off the live site.
            _id:   `drafts.post-${slug}`,
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

    await notify(`Borrador listo: ${article.title}`, [
      `Se generó un borrador a partir de tu último video largo.`,
      ``,
      `Video:    ${target.title}`,
      `          ${watchUrl(target.id)}`,
      `Artículo: ${article.title}`,
      `Portada:  ${coverRef ? 'miniatura de YouTube subida' : 'sin portada, ponla a mano'}`,
      ``,
      `Revísalo y publícalo desde el Studio:`,
      `${SITE_URL}/studio/desk/post`,
      ``,
      `Está como BORRADOR. No sale en la web hasta que le des a publicar.`,
    ])

    return NextResponse.json({
      ok: true,
      creado:      slug,
      desdeVideo:  target.id,
      duracion:    target.seconds,
      portada:     !!coverRef,
      descartados: skipped,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await notify('Falló la automatización de YouTube', [message])
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
