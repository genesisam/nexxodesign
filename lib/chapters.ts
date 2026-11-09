import type { StoryBlock, SectionHeaderBlock } from '@/types/project'

/**
 * The chapters of a case study, as the floating nav lists them.
 *
 * A case study is written in the CMS, so its chapters are whatever section
 * headings the editor wrote — "El desafío", "Enfoque de diseño". They are read
 * from the story rather than hardcoded, so a project with a different shape
 * gets a nav that matches it instead of a nav that lies.
 */
export type Chapter = { id: string; label: string }

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
 * Builds the chapter list: the opening, the figures if the project has any,
 * then every section heading in the story.
 */
export function buildChapters(
  story: StoryBlock[],
  { overviewLabel, resultsLabel, hasResults }:
  { overviewLabel: string; resultsLabel: string; hasResults: boolean },
): Chapter[] {
  const chapters: Chapter[] = [{ id: 'resumen', label: overviewLabel }]

  if (hasResults) chapters.push({ id: 'resultados', label: resultsLabel })

  story.forEach((block, i) => {
    if (!isSectionHeader(block) || !block.heading) return
    chapters.push({ id: chapterId(block.heading, i), label: block.heading })
  })

  return chapters
}
