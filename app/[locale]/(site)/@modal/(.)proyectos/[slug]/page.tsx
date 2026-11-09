import { ProjectModal } from '@/components/project/ProjectModal'
import { ProjectView }  from '../../../proyectos/[slug]/ProjectView'

/**
 * A case study opened from inside the site.
 *
 * `(.)` intercepts `/proyectos/[slug]` when it is reached by a link from this
 * same segment, and shows it over whatever page you were on. Arrive at the
 * URL directly — typed, refreshed, shared, crawled — and this never runs: the
 * real page renders instead, with its own metadata. That is the whole point of
 * doing it as a route rather than as a client-side overlay.
 */

export const revalidate = 60

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function ProjectModalPage({ params }: Props) {
  const { locale, slug } = await params

  return (
    <ProjectModal label={`Proyecto ${slug}`}>
      <ProjectView slug={slug} locale={locale} inModal />
    </ProjectModal>
  )
}
