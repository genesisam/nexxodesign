import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates } from '@/lib/seo'
import { WorkIndex } from '@/components/sections/WorkIndex'
import type { Project } from '@/components/sections/WorkIndex'
import { sanityClient } from '@/sanity/lib/client'
import { MOCK_PROJECTS } from '@/sanity/mock/projects'
import { groq } from 'next-sanity'

type Props = { params: Promise<{ locale: string }> }

const projectsQuery = groq`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    vertical,
    year,
    client,
    "blurb": coalesce(excerpt, ""),
    "cover": coverImage.asset->url,
    "thumbnail": null,
    "thumbVideo": null
  }
`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'work.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  buildAlternates(locale, '/proyectos'),
  }
}

/**
 * El índice lista lo que hay en el CMS más los casos que solo viven en el
 * repositorio.
 *
 * Sin esa unión, un caso escrito en `sanity/mock/projects.ts` tenía su página,
 * quedaba pre-renderizado y entraba en el sitemap, pero nada lo enlazaba: solo
 * se llegaba escribiendo la URL. Le pasaba a Cornish Arquitectos y a Tolvia.
 */
export default async function WorkPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  let cms: Project[] = []
  try {
    cms = await sanityClient.fetch<Project[]>(projectsQuery) ?? []
  } catch {
    // Sanity inalcanzable — WorkIndex conserva su propio respaldo.
  }

  const enElCms = new Set(cms.map(p => p.slug?.current).filter(Boolean))
  const soloRepo: Project[] = MOCK_PROJECTS
    .filter(p => !enElCms.has(p.slug.current))
    .map(p => ({
      _id:        p._id,
      title:      p.title,
      slug:       p.slug,
      vertical:   p.vertical as Project['vertical'],
      cover:      p.cover ?? null,
      logo:       null,
      thumbnail:  null,
      thumbVideo: null,
      blurb:      p.excerpt ?? '',
      year:       p.year,
      client:     p.client,
    }))

  const projects = [...cms, ...soloRepo]

  return <WorkIndex projects={projects.length ? projects : undefined} />
}
