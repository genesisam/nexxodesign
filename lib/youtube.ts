/**
 * YouTube through the official Data API, authorised as the channel owner.
 *
 * The first version scraped youtube.com and wrote from the description alone,
 * because caption tracks come back empty to datacenter IPs. So the article
 * never knew what was actually said in the video. The captions API does not
 * have that problem, but downloading a track requires being the owner of the
 * video — hence an OAuth refresh token issued once by Alexander with
 * scripts/youtube-auth.mjs.
 *
 * Owning the channel buys three more things the scraper could not do reliably:
 * - the uploads playlist lists every video, not the first page a tab lazy-loads;
 * - fileDetails gives the real frame size, which is what separates a Short from
 *   a normal upload, instead of guessing from duration;
 * - status says whether a video is public, so an unlisted or private upload
 *   never turns into a public article.
 *
 * Quota: roughly 260 of the 10,000 free daily units per article.
 *
 * No path aliases and no TypeScript-only syntax in this file, so its pure
 * helpers can be exercised directly with node.
 */

const API       = 'https://www.googleapis.com/youtube/v3'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'

export const REQUIRED_YOUTUBE_ENV = ['YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET', 'YOUTUBE_REFRESH_TOKEN']

export type TranscriptSource = 'subtítulos' | 'subtítulos automáticos' | 'ninguna'

export type VideoDetail = {
  id:          string
  title:       string
  description: string
  publishedAt: string
  seconds:     number
  chapters:    { at: string; label: string }[]
  width:       number
  height:      number
  isPublic:    boolean
}

export class YouTubeAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'YouTubeAuthError'
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.YOUTUBE_CLIENT_ID ?? '',
      client_secret: process.env.YOUTUBE_CLIENT_SECRET ?? '',
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN ?? '',
      grant_type:    'refresh_token',
    }),
    cache: 'no-store',
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.access_token) {
    // invalid_grant almost always means the consent screen was left in
    // "Testing", where Google expires refresh tokens after seven days.
    throw new YouTubeAuthError(
      json.error === 'invalid_grant'
        ? 'Google rechazó el acceso a tu canal (invalid_grant): el permiso caducó o se revocó.'
        : `Google no entregó un token de acceso (${res.status} ${json.error ?? ''}).`.replace(' )', ')'),
    )
  }
  return json.access_token as string
}

async function get(path: string, token: string): Promise<Response> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache:   'no-store',
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`YouTube API ${res.status} en ${path.split('?')[0]}: ${body.slice(0, 200)}`)
  }
  return res
}

// ─── Catalogue ────────────────────────────────────────────────────────────────

/** Every upload on the authorised channel, as the uploads playlist orders them. */
export async function listUploads(token: string, maxPages = 10): Promise<string[]> {
  const channel = await (await get('/channels?part=contentDetails&mine=true', token)).json()
  const uploads = channel?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) throw new Error('La cuenta autorizada no tiene un canal de YouTube.')

  const ids: string[] = []
  let pageToken = ''
  for (let page = 0; page < maxPages; page++) {
    const query =
      `/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}` +
      (pageToken ? `&pageToken=${pageToken}` : '')
    const json = await (await get(query, token)).json()
    for (const item of json.items ?? []) {
      const id = item?.contentDetails?.videoId
      if (id) ids.push(id)
    }
    if (!json.nextPageToken) break
    pageToken = json.nextPageToken
  }
  return ids
}

/** Details for many videos, newest first. Batched at the API's limit of 50. */
export async function getDetails(token: string, ids: string[]): Promise<VideoDetail[]> {
  const out: VideoDetail[] = []

  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50).join(',')
    const json  = await (await get(`/videos?part=snippet,contentDetails,fileDetails,status&id=${batch}`, token)).json()

    for (const v of json.items ?? []) {
      const stream      = v.fileDetails?.videoStreams?.[0]
      const description = v.snippet?.description ?? ''
      out.push({
        id:          v.id,
        title:       v.snippet?.title ?? '',
        description,
        publishedAt: v.snippet?.publishedAt ?? new Date().toISOString(),
        seconds:     parseDuration(v.contentDetails?.duration ?? ''),
        chapters:    parseChapters(description),
        width:       Number(stream?.widthPixels ?? 0),
        height:      Number(stream?.heightPixels ?? 0),
        isPublic:
          v.status?.privacyStatus === 'public' &&
          v.status?.uploadStatus === 'processed' &&
          (v.snippet?.liveBroadcastContent ?? 'none') === 'none',
      })
    }
  }

  return out.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

/**
 * Portrait means Short. The frame size comes from fileDetails; when it is
 * missing (still processing, or not readable) YouTube itself is asked, since
 * /shorts/<id> only answers 200 for videos it files as Shorts.
 */
export async function isShort(v: VideoDetail): Promise<boolean> {
  if (v.width && v.height) return v.height > v.width
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${v.id}`, {
      method: 'HEAD', redirect: 'manual', cache: 'no-store',
    })
    return res.status === 200
  } catch {
    return v.seconds <= 60
  }
}

// ─── Captions ─────────────────────────────────────────────────────────────────

type CaptionItem = {
  id: string
  snippet?: { language?: string; trackKind?: string; isDraft?: boolean; status?: string }
}

/**
 * The words spoken in the video. Prefers a track Alexander uploaded over the
 * automatic one, and Spanish over anything else. Never throws: a video without
 * usable captions still gets written, just from the description.
 */
export async function getTranscript(
  token: string,
  videoId: string,
): Promise<{ text: string; source: TranscriptSource }> {
  const none = { text: '', source: 'ninguna' as TranscriptSource }

  let items: CaptionItem[] = []
  try {
    const json = await (await get(`/captions?part=snippet&videoId=${videoId}`, token)).json()
    items = json.items ?? []
  } catch {
    return none
  }

  const usable = items.filter(c => !c.snippet?.isDraft && c.snippet?.status !== 'failed')
  const isEs   = (c: CaptionItem) => String(c.snippet?.language ?? '').toLowerCase().startsWith('es')
  const kind   = (c: CaptionItem) => c.snippet?.trackKind

  const pick =
    usable.find(c => kind(c) === 'standard' && isEs(c)) ??
    usable.find(c => kind(c) === 'asr' && isEs(c)) ??
    usable.find(c => kind(c) === 'standard') ??
    usable.find(c => kind(c) === 'asr')

  if (!pick) return none

  try {
    const res  = await get(`/captions/${pick.id}?tfmt=srt`, token)
    const text = parseSrt(await res.text())
    if (!text) return none
    return { text, source: kind(pick) === 'asr' ? 'subtítulos automáticos' : 'subtítulos' }
  } catch {
    return none
  }
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/** ISO 8601 duration (PT1H2M3S) to seconds. */
export function parseDuration(iso: string): number {
  const m = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/)
  if (!m) return 0
  const n = (s: string | undefined) => Number(s ?? 0)
  return n(m[1]) * 86400 + n(m[2]) * 3600 + n(m[3]) * 60 + n(m[4])
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/**
 * SRT to running text. Automatic captions repeat the previous line as the next
 * cue scrolls in, so consecutive duplicates are dropped along with the cue
 * numbers, timestamps, styling tags and sound annotations.
 */
export function parseSrt(srt: string): string {
  const kept: string[] = []
  for (const raw of srt.replace(/\r/g, '').split('\n')) {
    const line = decodeEntities(raw.replace(/<[^>]+>/g, '').replace(/\{[^}]*\}/g, '')).trim()
    if (!line) continue
    if (/^\d+$/.test(line)) continue
    if (line.includes('-->')) continue
    if (/^\[[^\]]+\]$/.test(line)) continue
    if (kept.length && kept[kept.length - 1] === line) continue
    kept.push(line)
  }
  return kept.join(' ').replace(/\[[^\]]+\]/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Chapters are whatever the description marks with a timestamp. */
export function parseChapters(description: string): { at: string; label: string }[] {
  return [...description.matchAll(/^\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—|]?\s*(.+)$/gm)]
    .map(m => ({ at: m[1], label: m[2].trim() }))
    .filter(c => c.label.length > 2)
}

/**
 * Enough to write from without padding. With a transcript the description can
 * be thin; without one it has to carry the article on its own.
 */
export function hasEnoughMaterial(v: VideoDetail, transcript: string): boolean {
  if (v.seconds < 180) return false
  return transcript.length >= 1500 || v.description.length >= 400
}

export const thumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
export const watchUrl     = (id: string) => `https://www.youtube.com/watch?v=${id}`
