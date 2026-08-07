import type { Project } from '@/types/project'
import { sanityClient } from './client'
import { groq } from 'next-sanity'
import { MOCK_PROJECTS } from '../mock/projects'

const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, subtitle, slug, client, year, timeline, excerpt, metric, liveUrl,
    "services": coalesce(services, []),
    "vertical": vertical,
    "cover":    coverImage.asset->url,
    "heroMedia": heroMedia,
    "metrics":  metrics[]{ _key, label, value },
    "story": story[]{
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
    },
    "nextProject": *[_type == "project" && order > ^.order] | order(order asc)[0] {
      title, slug, "cover": coverImage.asset->url, "vertical": vertical
    }
  }
`

const allSlugsQuery = groq`*[_type == "project"]{ "slug": slug.current }`

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const result = await sanityClient.fetch<Project | null>(projectBySlugQuery, { slug })
    if (result) return result
  } catch {
    // Sanity unreachable in dev (SSL proxy) — fall through to mock
  }
  return MOCK_PROJECTS.find(p => p.slug.current === slug) ?? null
}

export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const rows = await sanityClient.fetch<{ slug: string }[]>(allSlugsQuery)
    if (rows?.length) return rows.map(r => r.slug)
  } catch {
    // fall through to mock slugs
  }
  return MOCK_PROJECTS.map(p => p.slug.current)
}
