import type { StoryBlock, SectionHeaderBlock } from '@/types/project'

/**
 * The chapters of a case study, as the floating nav lists them.
 *
 * A case study is written in the CMS, so its chapters are whatever section
 * headings the editor wrote — "El desafío", "Enfoque de diseño". They are read
 * from the story rather than hardcoded, so a project with a different shape
 * gets a nav that matches it instead of a nav that lies.
 */
export type Chapter = {
  id: string
  /** One or two words, for the bar. */
  label: string
  /** The heading as written, kept for the tooltip and for screen readers. */
  full: string
}

/** Words that carry no meaning on their own, so a label never starts or ends on one. */
const CONNECTORS = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'que', 'para', 'con', 'sin', 'por', 'y', 'e', 'o', 'u', 'en', 'a', 'al',
  'su', 'sus', 'lo', 'se', 'más', 'cuando', 'como', 'donde', 'si', 'no',
  'ya', 'sí', 'es', 'son', 'desde', 'hasta', 'ante', 'tras', 'entre',
])

/**
 * A heading cut down to what fits on a button.
 *
 * Case-study headings are written as sentences — "Alertas que activan, no que
 * informan" — and a bar of those is a paragraph with rounded corners. The
 * first clause carries the subject, so the text is cut at the first strong
 * punctuation and then trimmed to two words, dropping a trailing connector
 * that would leave the label hanging ("Arquitectura del" → "Arquitectura").
 *
 * The full heading is kept alongside, so nothing is actually lost: it is the
 * tooltip, and it is what a screen reader announces.
 */
export function shortLabel(heading: string): string {
  const head  = heading.split(/[:—–,.;(]/)[0].trim()
  const words = head.split(/\s+/).filter(Boolean)
  if (!words.length) return head

  // Drop the articles and conjunctions a sentence opens on. "El CRM que el
  // equipo sí usa" should put CRM on the button, not "El CRM".
  let start = 0
  while (start < words.length - 1 && CONNECTORS.has(words[start].toLowerCase())) start++

  const rest = words.slice(start)

  // Dropping the article leaves the next word lowercase — "La tienda" became
  // "tienda". It is the start of the label now, so it reads like one.
  const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

  if (rest.length === 1) return capitalise(rest[0])

  const two = rest.slice(0, 2)
  if (CONNECTORS.has(two[1].toLowerCase())) return capitalise(two[0])
  return capitalise(two.join(' '))
}

/**
 * A heading turned into an id that survives a URL.
 *
 * Accents are stripped rather than escaped: `#el-desafío` works, but it is
 * percent-encoded the moment it is copied out of the address bar, and a
 * shareable link to a chapter is the point of having ids at all.
 */
export function chapterId(heading: string, index: number): string {
  const slug = heading
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  // An editor can write the same heading twice, and a duplicate id would send
  // both nav entries to the first one.
  return slug ? `${slug}-${index}` : `capitulo-${index}`
}

/** `true` when a block is a section heading — the only thing the nav lists. */
function isSectionHeader(block: StoryBlock): block is SectionHeaderBlock {
  return block._type === 'sectionHeader'
}

/**
 * At most this many buttons.
 *
 * The bar is a way to move around a case study, not a table of contents. Past
 * five it stops being scannable and starts being a second navigation — and it
 * would be a different length on every project, which is the opposite of what
 * a fixed element should be.
 */
const MAX_CHAPTERS = 5

/**
 * `true` when this heading introduces the client's own words.
 *
 * That section closes a case study rather than being a part of it you would
 * navigate to, and its heading is usually a sentence about the client rather
 * than a label — "Madrid ya tiene su tienda CBD de referencia" arrived in the
 * bar as "Madrid", which tells a reader nothing.
 *
 * The section stays on the page. It is only left out of the bar.
 */
function introducesFeedback(story: StoryBlock[], index: number): boolean {
  for (let i = index + 1; i < story.length; i++) {
    if (isSectionHeader(story[i])) return false
    if (story[i]._type === 'feedback') return true
  }
  return false
}

/**
 * Builds the chapter list: the opening, the figures if the project has any,
 * then every section heading in the story.
 */
export function buildChapters(
  story: StoryBlock[],
  { overviewLabel, resultsLabel, hasResults }:
  { overviewLabel: string; resultsLabel: string; hasResults: boolean },
): Chapter[] {
  const chapters: Chapter[] = [
    { id: 'resumen', label: overviewLabel, full: overviewLabel },
  ]

  if (hasResults) {
    chapters.push({ id: 'resultados', label: resultsLabel, full: resultsLabel })
  }

  story.forEach((block, i) => {
    if (!isSectionHeader(block) || !block.heading) return
    if (introducesFeedback(story, i)) return

    let label = shortLabel(block.heading)

    // Two chapters cut down to the same word would be two buttons that read
    // identically and lead somewhere different. The second one is shortened
    // again from what comes after that word — "Resultados a 90 días" next to
    // "Resultados" becomes "90 días", which is the part that distinguishes it.
    if (chapters.some(c => c.label.toLowerCase() === label.toLowerCase())) {
      const rest = block.heading.trim().split(/\s+/).slice(1).join(' ')
      if (rest) label = shortLabel(rest)
    }

    chapters.push({ id: chapterId(block.heading, i), label, full: block.heading })
  })

  // Every section keeps its heading and its id on the page — this only
  // decides how many of them the bar offers.
  return chapters.slice(0, MAX_CHAPTERS)
}
