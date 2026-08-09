import type { Project } from '@/types/project'
import { sanityClient } from './client'
import { groq } from 'next-sanity'
import { MOCK_PROJECTS } from '../mock/projects'

/** Story-block projection, shared by the ES and EN narratives. */
const storyProjection = `{
  _type, _key,
  label, heading, text, divider, caption, size, mediaType,
  name, role, company, link,
  _type == "overview" => {
    "body": body[]{
      ...,
      _type == "image" => {
        _type, _key, alt, caption, fullBleed,
        "url": asset->url
      }
    }
  },
  _type == "media" => { "url": asset.asset->url },
  _type == "splitShow" => {
    "items": items[]{ _key, mediaType, size, caption, "url": asset.asset->url }
  }
}`

const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, subtitle, slug, client, year, timeline, excerpt, metric, liveUrl,
    "services": coalesce(services, []),
    "vertical": vertical,
    "cover":    coverImage.asset->url,
    "heroMedia": heroMedia,
    "metrics":  metrics[]{ _key, label, value },
    "story": story[]${storyProjection},
    subtitle_en, excerpt_en, metric_en,
    "metrics_en": metrics_en[]{ _key, label, value },
    "story_en": story_en[]${storyProjection},
    "nextProject": *[_type == "project" && order > ^.order] | order(order asc)[0] {
      title, slug, "cover": coverImage.asset->url, "vertical": vertical
    }
  }
`

const allSlugsQuery = groq`*[_type == "project"]{ "slug": slug.current }`

/** Card-sized projection for the home grid — same cover field the index uses. */
const projectCardsQuery = groq`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    _id, title, slug, client, year,
    "metric":   coalesce(metric, ""),
    "services": coalesce(services, []),
    "coverUrl": coverImage.asset->url
  }
`

export type ProjectCardData = {
  _id: string
  title: string
  slug: { current: string }
  client: string
  year: number
  metric: string
  services: string[]
  coverUrl?: string
}

/**
 * Projects for the home selection. The home used to carry its own hardcoded
 * array in which only one entry had a cover, so covers uploaded through the
 * CMS appeared on /proyectos and nowhere else. Falls back to the caller's
 * static list when Sanity is unreachable.
 */
export async function getProjectCards(): Promise<ProjectCardData[] | null> {
  try {
    const rows = await sanityClient.fetch<ProjectCardData[]>(projectCardsQuery)
    if (rows?.length) return rows
  } catch {
    // Sanity unreachable — caller keeps its static fallback
  }
  return null
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const result = await sanityClient.fetch<Project | null>(projectBySlugQuery, { slug })
    if (result) return result
  } catch {
    // Sanity unreachable in dev (SSL proxy) — fall through to mock
  }
  return MOCK_PROJECTS.find(p => p.slug.current === slug) ?? null
}

/**
 * Union of the CMS slugs and the mock slugs, deduped.
 *
 * `getProjectBySlug` falls back to the mocks when Sanity has no matching
 * document, so a mock-only project (currently `tolvia`) still renders a real
 * 200 page. Returning only the CMS slugs would leave those pages out of the
 * sitemap and unprerendered — reachable but never advertised.
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const mockSlugs = MOCK_PROJECTS.map(p => p.slug.current)

  let cmsSlugs: string[] = []
  try {
    const rows = await sanityClient.fetch<{ slug: string }[]>(allSlugsQuery)
    cmsSlugs = rows?.map(r => r.slug).filter(Boolean) ?? []
  } catch {
    // Sanity unreachable — the mocks alone still cover every renderable page.
  }

  return [...new Set([...cmsSlugs, ...mockSlugs])]
}
