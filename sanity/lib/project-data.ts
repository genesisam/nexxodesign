import type { Project } from '@/types/project'
import { sanityClient } from './client'
import { groq } from 'next-sanity'
import { MOCK_PROJECTS } from '../mock/projects'

/** Story-block projection, shared by the ES and EN narratives. */
/*
 * Sanity's CDN transforms on request, so the app asks for the format and size
 * it actually renders instead of downloading the master file.
 *
 * `auto=format` negotiates WebP or AVIF from the browser's Accept header, and
 * `w` caps the pixels near twice the slot's CSS width. The originals stay
 * untouched in the dataset — nothing is re-uploaded and nothing is destroyed,
 * so these numbers can be retuned later without re-processing a single asset.
 *
 * Measured on the heaviest PNGs in the library: 3,700 KB became 72 KB.
 */

const storyProjection = `{
  _type, _key,
  label, heading, text, divider, caption, size, mediaType,
  // "text" belongs to the pull-quote block, "quote" to the client-feedback one.
  // Selecting only the first left every feedback block rendering a bare pair of
  // quotation marks above the client name, on every case study.
  quote, name, role, company, link,
  _type == "overview" => {
    "body": body[]{
      ...,
      _type == "image" => {
        _type, _key, alt, caption, fullBleed,
        "url": asset->url + "?auto=format&q=75&w=1400"
      }
    }
  },
  _type == "media" => { "url": asset.asset->url + "?auto=format&q=75&w=1800" },
  _type == "splitShow" => {
    "items": items[]{ _key, mediaType, size, caption, "url": asset.asset->url + "?auto=format&q=75&w=1200" }
  }
}`

const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, subtitle, slug, client, year, timeline, excerpt, metric, liveUrl,
    "services": coalesce(services, []),
    "vertical": vertical,
    "cover":    coverImage.asset->url + "?auto=format&q=75&w=1800",
    "heroMedia": heroMedia,
    "metrics":  metrics[]{ _key, label, value },
    "story": story[]${storyProjection},
    "nextProject": *[_type == "project" && order > ^.order] | order(order asc)[0] {
      title, slug, "cover": coverImage.asset->url + "?auto=format&q=75&w=400", "vertical": vertical
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
    "coverUrl": coverImage.asset->url + "?auto=format&q=75&w=1000"
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
/** Un proyecto de los mocks, con la forma que espera una tarjeta. */
function mockCard(project: (typeof MOCK_PROJECTS)[number]): ProjectCardData {
  return {
    _id:      project._id,
    title:    project.title,
    slug:     project.slug,
    client:   project.client,
    year:     project.year,
    metric:   project.metric ?? '',
    services: project.services,
    coverUrl: project.cover ?? undefined,
  }
}

/**
 * Las tarjetas del índice y del home: lo que hay en el CMS, más los proyectos
 * que solo viven en el repositorio.
 *
 * La unión no es un capricho. `getProjectBySlug` ya cae a los mocks y
 * `getAllProjectSlugs` ya devuelve la unión, así que un caso escrito en el
 * repositorio tenía página, estaba pre-renderizado y entraba en el sitemap
 * — pero esta función solo miraba el CMS, de modo que ni el índice ni el home
 * lo enlazaban nunca. Existía y no se podía llegar a él salvo escribiendo la
 * URL. Le pasaba a Cornish Arquitectos y también a Tolvia.
 */
export async function getProjectCards(): Promise<ProjectCardData[] | null> {
  let cms: ProjectCardData[] = []
  try {
    cms = await sanityClient.fetch<ProjectCardData[]>(projectCardsQuery) ?? []
  } catch {
    // Sanity inalcanzable — seguimos con lo que haya en el repositorio.
  }

  const enElCms = new Set(cms.map(card => card.slug?.current).filter(Boolean))
  const soloRepo = MOCK_PROJECTS.filter(p => !enElCms.has(p.slug.current)).map(mockCard)

  const todos = [...cms, ...soloRepo]
  // `null` sigue significando «no hay nada»: quien llama conserva su respaldo.
  return todos.length ? todos : null
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
