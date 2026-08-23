import { sanityClient } from './client'
import { groq } from 'next-sanity'

export type ReelShot = {
  url:   string
  /** Seconds on screen. Varied on purpose — an even cadence reads as a slideshow. */
  dur:   number
  /** Camera move. The frame is never still, but it never spins either. */
  move:  'in' | 'out' | 'left' | 'right'
  label: string
}

/**
 * The reel, cut by hand.
 *
 * Picks are (project slug, index into that project's split-grid images). Reading
 * them from the CMS rather than freezing URLs means swapping a picture in Sanity
 * updates the reel too.
 *
 * Three rules decided the order, all from the brief:
 *
 * - Scale changes on every cut. Macro, then a full object, then a room, then a
 *   street. Two shots at the same distance in a row is where a reel starts
 *   feeling like a carousel.
 * - Projects hand off on colour. Greenery's magenta runs into Nexo's lime, lime
 *   into Solivus orange, orange into Mente's blue, and blue into Maison's
 *   forest green — so six identities read as one film.
 * - Screen time is not shared equally. Greenery opens because it is the loudest
 *   thing in the portfolio; Maison Oliva gets the long, quiet shots because the
 *   contrast against Greenery is the whole argument of the sequence.
 *
 * Deliberately light on interface: the case studies are full of it, and a
 * dashboard held for one second reads as a grey rectangle. The UI that survives
 * a cut this fast is the UI with one big number on it.
 */
const CUT: { slug: string; i: number; dur: number; move: ReelShot['move']; label: string }[] = [
  // Hook — loud, close, fast.
  { slug: 'greenery-420', i: 1,  dur: 1.0, move: 'in',    label: 'Greenery 420' },
  { slug: 'greenery-420', i: 10, dur: 0.6, move: 'left',  label: 'Greenery 420' },
  { slug: 'greenery-420', i: 0,  dur: 1.6, move: 'out',   label: 'Greenery 420' },

  // Magenta → lime.
  { slug: 'nexo-go',      i: 1,  dur: 1.2, move: 'in',    label: 'Nexo Go' },
  { slug: 'nexo-go',      i: 2,  dur: 0.8, move: 'right', label: 'Nexo Go' },
  { slug: 'nexo-go',      i: 7,  dur: 1.5, move: 'out',   label: 'Nexo Go' },
  { slug: 'nexo-go',      i: 4,  dur: 1.0, move: 'in',    label: 'Nexo Go' },

  // Lime → orange. The neon holds longest so far: the first real pause.
  { slug: 'solivus',      i: 13, dur: 1.8, move: 'in',    label: 'Solivus' },
  { slug: 'solivus',      i: 0,  dur: 1.1, move: 'left',  label: 'Solivus' },

  // Orange → blue, and out to the street.
  { slug: 'mente',        i: 5,  dur: 1.4, move: 'out',   label: 'Mente' },

  // Blue → forest green. The register flips: slower, quieter, closer.
  { slug: 'maison-oliva', i: 2,  dur: 1.6, move: 'right', label: 'Maison Oliva' },
  { slug: 'maison-oliva', i: 6,  dur: 1.3, move: 'in',    label: 'Maison Oliva' },
  { slug: 'maison-oliva', i: 7,  dur: 1.8, move: 'out',   label: 'Maison Oliva' },

  // Green → teal, and the last big move outward before the loop.
  { slug: 'merxo',        i: 1,  dur: 1.5, move: 'out',   label: 'Merxo' },
]

const reelQuery = groq`
  *[_type == "project" && slug.current in $slugs]{
    "slug":  slug.current,
    "urls":  story[_type == "splitShow"].items[]{
      "u": asset.asset->url + "?auto=format&q=80&w=1600"
    }.u
  }
`

export async function getReelShots(): Promise<ReelShot[]> {
  const slugs = [...new Set(CUT.map(c => c.slug))]

  let byslug: Record<string, string[]> = {}
  try {
    const rows = await sanityClient.fetch<{ slug: string; urls: string[] }[]>(reelQuery, { slugs })
    byslug = Object.fromEntries((rows ?? []).map(r => [r.slug, (r.urls ?? []).filter(Boolean)]))
  } catch {
    // Sanity unreachable — the section falls back to its poster on an empty list.
    return []
  }

  // A missing pick drops its shot rather than leaving a black hole in the cut.
  return CUT.flatMap(({ slug, i, dur, move, label }) => {
    const url = byslug[slug]?.[i]
    return url ? [{ url, dur, move, label }] : []
  })
}
