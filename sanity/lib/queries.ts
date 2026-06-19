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
    _id, title, slug, client, year, tags, metric,
    coverImage, video, excerpt, body
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
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, coverImage, excerpt, tags
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, coverImage, excerpt, body, tags
  }
`
