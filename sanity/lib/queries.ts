import { groq } from 'next-sanity'

// ── Projects ──────────────────────────────────────
export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id, title, slug, client, year, tags, metric,
    coverImage, excerpt, featured
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc) {
    _id, title, slug, client, year, tags, metric, coverImage, excerpt
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, subtitle, slug, client, year, excerpt, metric, liveUrl,
    "services": coalesce(services, tags),
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
      _type == "media" => {
        "url": coalesce(asset->url, videoUrl)
      },
      _type == "splitShow" => {
        "items": items[]{
          _key, mediaType, size, caption,
          "url": coalesce(asset->url, videoUrl)
        }
      }
    },
    "nextProject": *[_type == "project" && order > ^.order] | order(order)[0] {
      title, slug,
      "cover":    coverImage.asset->url,
      "vertical": vertical
    }
  }
`

// ── Testimonials ──────────────────────────────────
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id, quote, author, role, company, metric, avatar
  }
`

// ── Clients / Logos ───────────────────────────────
export const clientsQuery = groq`
  *[_type == "client"] | order(order asc) {
    _id, name, logo, logoLight, url
  }
`

// ── Journal ───────────────────────────────────────
// Returns PostSummary shape (no body, no author)
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt,
    "cover": coverImage.asset->url,
    category, tags, featured, readingTime
  }
`

// Returns full Post shape with body image URLs flattened
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, excerpt,
    "cover": coverImage.asset->url,
    category, tags, featured, readingTime,
    "author": {
      "name":   author.name,
      "role":   author.role,
      "avatar": author.avatar.asset->url
    },
    "body": body[]{
      ...,
      _type == "image" => {
        _type, _key, alt, caption, fullBleed,
        "url": asset->url
      }
    }
  }
`

// Used by generateStaticParams
export const allPostSlugsQuery = groq`
  *[_type == "post"]{ "slug": slug.current }
`
