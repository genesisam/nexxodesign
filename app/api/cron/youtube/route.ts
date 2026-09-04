import { NextResponse } from 'next/server'
import { fetchCatalogue, fetchDetail, hasEnoughMaterial, thumbnailUrl, watchUrl } from '@/lib/youtube'
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
 * 3. Shorts are excluded by where the list comes from, not by a rule about
 *    length. The channel's /videos tab holds long-form and /shorts holds the
 *    rest, so reading the former filters them at the source. A duration
 *    threshold looked equivalent and was not: it would have let a long vertical
 *    Short through and thrown out a short horizontal upload.
 *
 * Run daily it does double duty — it picks up new uploads, and until it catches
 * up it walks the back catalogue one article a day.
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

  // The handle, not the channel id: the /videos tab is addressed by handle and
  // is what keeps Shorts out of the catalogue in the first place.
  const handle = process.env.YOUTUBE_HANDLE ?? 'ALEXUI-UX'

  try {
    const [catalogue, done] = await Promise.all([fetchCatalogue(handle), processedIds()])
    const pending = catalogue.filter(id => !done.has(id))

    if (!pending.length) {
      return NextResponse.json({ ok: true, catalogo: catalogue.length, pendientes: 0 })
    }

    // Newest first, stopping at the first one there is enough to write from.
    // Running daily, this also walks the back catalogue one article at a time
    // and then idles once it has caught up.
    let target = null
    const skipped: string[] = []
    for (const id of pending) {
      const detail = await fetchDetail(id)
      if (!detail) { skipped.push(`${id} (vertical o ilegible)`); continue }
      if (!hasEnoughMaterial(detail)) {
        skipped.push(`${detail.title.slice(0, 40)} (${detail.seconds}s, desc ${detail.description.length})`)
        continue
      }
      target = detail
      break
    }

    if (!target) {
      return NextResponse.json({ ok: true, pendientes: pending.length, aptos: 0, descartados: skipped })
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
      pendientes:  pending.length - 1,
      descartados: skipped,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await notify('Falló la automatización de YouTube', [message])
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
