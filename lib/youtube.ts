/**
 * Reading the channel without a Google Cloud project.
 *
 * The source is the channel's own /videos tab, not the RSS feed. That choice is
 * the whole filter: YouTube lists Shorts under /shorts and long-form under
 * /videos, so sourcing from the latter excludes them by construction. The RSS
 * feed mixes both and only carries the fifteen most recent uploads — on this
 * channel that is mostly Shorts, so it would have surfaced almost nothing
 * usable. Verified against the live channel: /videos returns 15 of 15
 * horizontal, 4 to 26 minutes.
 *
 * The orientation check below stays anyway, as a second guard. A vertical video
 * is a Short whatever page it was listed on, and the cost of being wrong is an
 * article written from a 20-second clip.
 *
 * What this deliberately does NOT try to do is fetch captions. YouTube serves
 * empty caption tracks to datacenter IPs, which is what a Vercel function is —
 * verified against this channel before relying on it. Articles are written from
 * the title, description and chapter list instead; here those run 819 to 2,863
 * characters, and a chapter list is a table of contents.
 */

const UA = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
  'Accept-Language': 'es-ES,es;q=0.9',
}

export type VideoDetail = {
  id:          string
  title:       string
  description: string
  publishedAt: string
  seconds:     number
  chapters:    { at: string; label: string }[]
}

/** Every long-form upload the channel page lists, newest first. */
export async function fetchCatalogue(handle: string): Promise<string[]> {
  const res = await fetch(`https://www.youtube.com/@${handle}/videos`, {
    headers: UA,
    cache:   'no-store',
  })
  if (!res.ok) throw new Error(`canal ${res.status}`)
  const html = await res.text()
  return [...new Set([...html.matchAll(/"videoId":"([\w-]{11})"/g)].map(m => m[1]))]
}

/** Chapters are whatever the description marks with a timestamp. */
function parseChapters(description: string) {
  return [...description.matchAll(/^\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—|]?\s*(.+)$/gm)]
    .map(m => ({ at: m[1], label: m[2].trim() }))
    .filter(c => c.label.length > 2)
}

export async function fetchDetail(id: string): Promise<VideoDetail | null> {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: UA, cache: 'no-store' })
  if (!res.ok) return null
  const html = await res.text()

  const seconds = Number((html.match(/"lengthSeconds":"(\d+)"/) ?? [])[1] ?? 0)
  const width   = Number((html.match(/"width":(\d+)/) ?? [])[1] ?? 0)
  const height  = Number((html.match(/"height":(\d+)/) ?? [])[1] ?? 0)
  if (!seconds || !width) return null

  // Portrait means Short, whatever page listed it.
  if (height > width) return null

  const title = (html.match(/<meta name="title" content="([^"]+)"/) ?? [])[1] ?? ''

  let description = ''
  const raw = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/)
  if (raw) { try { description = JSON.parse(`"${raw[1]}"`) } catch { /* leave empty */ } }

  const published =
    (html.match(/<meta itemprop="datePublished" content="([^"]+)"/) ?? [])[1] ??
    (html.match(/"publishDate":"([^"]+)"/) ?? [])[1] ??
    new Date().toISOString()

  if (!title) return null

  return {
    id,
    title,
    description,
    publishedAt: new Date(published).toISOString(),
    seconds,
    chapters: parseChapters(description),
  }
}

/**
 * Enough material to write from. A minute of video with a two-line description
 * produces a padded article, and padding is what makes an automated journal
 * read like one.
 */
export function hasEnoughMaterial(v: VideoDetail): boolean {
  return v.seconds >= 180 && v.description.length >= 400
}

export const thumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
export const watchUrl     = (id: string) => `https://www.youtube.com/watch?v=${id}`
