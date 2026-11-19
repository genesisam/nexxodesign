import type { Metadata } from 'next'
import { buildAlternates, SITE_URL } from '@/lib/seo'
import { coverFor } from '@/lib/covers'
import { getProjectBySlug, getAllProjectSlugs } from '@/sanity/lib/project-data'
import { ProjectView, SEO_META } from './ProjectView'

/**
 * La página de un caso.
 *
 * Antes existía ademas una ruta que la interceptaba y la abria en un pop up
 * sobre la página anterior. Se quito: un caso es una página y se comporta
 * como tal —se comparte, se imprime, se vuelve atras— sin dos maneras de
 * verse que mantener a la vez.
 */

// ─── ISR ─────────────────────────────────────────────────────────────────────
export const revalidate = 60

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const project          = await getProjectBySlug(slug)
  if (!project) return { title: 'Proyecto no encontrado' }

  const meta = SEO_META[slug]

  // Sin « | Nexxo »: la plantilla del layout raíz lo añade una sola vez.
  const title       = meta?.title       ?? `${project.title} — Diseño de Producto`
  const description = meta?.description ?? project.excerpt

  // La imagen para compartir: la portada compuesta primero, absoluta, porque
  // una red social no resuelve rutas relativas. Los casos que nacieron en el
  // repositorio no tienen `coverImage`, así que se compartían sin imagen.
  const compuesta = coverFor(slug, '16x9')
  const social    = compuesta ? `${SITE_URL}${compuesta}` : project.cover

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/proyectos/${slug}`),
    openGraph: {
      title,
      description,
      type:   'website',
      images: social ? [{ url: social, alt: project.title }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      social ? [social] : undefined,
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug, locale } = await params
  return <ProjectView slug={slug} locale={locale} />
}
