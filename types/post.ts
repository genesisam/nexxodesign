import type { PTContent } from '@/types/project'

export type PostCategory = 'Diseño' | 'IA' | 'UX' | 'Proceso' | 'Producto' | 'E-commerce'

// Gradient placeholder por categoría — se reemplaza con cover real desde Sanity
export const COVER_GRADIENT: Record<PostCategory, string> = {
  Diseño:      'linear-gradient(148deg, #0c0c1e 0%, #12112c 40%, #1c1050 72%, #5B3DF5 100%)',
  IA:          'linear-gradient(148deg, #0d0814 0%, #1e0f38 40%, #2e1268 72%, #6B35C8 100%)',
  UX:          'linear-gradient(148deg, #0a1018 0%, #101828 40%, #182840 72%, #2A5F8B 100%)',
  Proceso:     'linear-gradient(148deg, #0a0a0a 0%, #141414 40%, #222222 72%, #484848 100%)',
  Producto:    'linear-gradient(148deg, #0c1410 0%, #122018 40%, #1a3825 72%, #2B7A4A 100%)',
  'E-commerce':'linear-gradient(148deg, #160a08 0%, #251210 40%, #3d1c18 72%, #C94B38 100%)',
}

export type PostAuthor = {
  name:   string
  role:   string
  avatar: string | null
}

// Shape mirrors what the GROQ postBySlugQuery returns after URL flattening.
export type Post = {
  _id:         string
  title:       string
  slug:        { current: string }
  excerpt:     string
  cover:       string | null
  publishedAt: string
  category:    PostCategory
  tags:        string[]
  featured:    boolean
  readingTime: number
  author:      PostAuthor
  body:        PTContent[]
}

// List view — omits heavy fields not needed for index rendering
export type PostSummary = Omit<Post, 'body' | 'author'>
