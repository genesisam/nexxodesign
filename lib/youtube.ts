/**
 * Reading the channel without a Google Cloud project.
 *
 * The RSS feed lists new uploads for free and without quota, and the watch page
 * carries the duration in its player payload — so Shorts can be filtered out
 * with no API key at all. That matters: the alternative is a Cloud project, an
 * OAuth consent screen and a key to rotate, for two numbers.
 *
 * What this deliberately does NOT try to do is fetch captions. YouTube serves
 * empty caption tracks to datacenter IPs, which is exactly what a Vercel
 * function is — verified against this channel before relying on it. The article
 * is written from the title, the description and the chapter list instead, and
 * on this channel those run 1,250 to 2,900 characters with 7 to 23 timestamps.
 * A chapter list is a table of contents, which is most of what an article needs
 * to be structured rather than rambling.
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

/** Shorts top out at three minutes, so this is the line between the two. */
export const LONG_FORM_SECONDS = 180

export type FeedItem = {
  id:          string
  title:       string
  description: string
  publishedAt: string
}

export type VideoDetail = FeedItem & {
  seconds:  number
  chapters: { at: string; label: string }[]
}

function decode(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

export async function fetchFeed(channelId: string): Promise<FeedItem[]> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    { headers: { 'User-Agent': UA }, cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`RSS ${res.status}`)
  const xml = await res.text()

  const entries = xml.split('<entry>').slice(1)
  return entries.map(e => ({
    id:          (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) ?? [])[1] ?? '',
    title:       decode((e.match(/<media:title>([\s\S]*?)<\/media:title>/) ?? [])[1] ?? ''),
    description: decode((e.match(/<media:description>([\s\S]*?)<\/media:description>/) ?? [])[1] ?? ''),
    publishedAt: (e.match(/<published>([^<]+)<\/published>/) ?? [])[1] ?? new Date().toISOString(),
  })).filter(v => v.id)
}

/** Chapters are whatever the description marks with a timestamp. */
function parseChapters(description: string) {
  return [...description.matchAll(/^\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—|]?\s*(.+)$/gm)]
    .map(m => ({ at: m[1], label: m[2].trim() }))
    .filter(c => c.label.length > 2)
}

export async function fetchDetail(item: FeedItem): Promise<VideoDetail | null> {
  const res = await fetch(`https://www.youtube.com/watch?v=${item.id}`, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'es-ES,es;q=0.9' },
    cache:   'no-store',
  })
  if (!res.ok) return null
  const html = await res.text()

  const seconds = Number((html.match(/"lengthSeconds":"(\d+)"/) ?? [])[1] ?? 0)
  if (!seconds) return null

  return { ...item, seconds, chapters: parseChapters(item.description) }
}

export const isLongForm = (v: VideoDetail) => v.seconds >= LONG_FORM_SECONDS

export const thumbnailUrl = (id: string) =>
  `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`
