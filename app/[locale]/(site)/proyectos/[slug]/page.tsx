import type { Metadata } from 'next'
import { buildAlternates, SITE_URL } from '@/lib/seo'
import { coverFor } from '@/lib/covers'
import { getProjectBySlug, getAllProjectSlugs } from '@/sanity/lib/project-data'
import { ProjectView, SEO_META } from './ProjectView'

/**
 * The case study at its own URL.
 *
 * The body lives in `ProjectView` because the modal shows the same thing; what
 * stays here is what belongs to a route and nothing else — metadata, static
 * params, revalidation. Arrive here directly, refresh, or follow a link from
 * outside the site and this is what renders; click a project from inside the
 * site and the intercepting route in `@modal` shows the same view over the
 * page you were on.
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
