import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'
import { getProjectCards } from '@/sanity/lib/project-data'
import { ProjectCard, type Project } from './ProjectCard'

/** Used only when Sanity is unreachable — the CMS is the source of truth. */
const MOCK: Project[] = [
  {
    _id: 'solivus',
    title: 'Solivus',
    slug: { current: 'solivus' },
    client: 'Solivus',
    year: 2025,
    metric: '−47% tiempo de respuesta a alertas',
    services: ['Product Design', 'Dashboard UI', 'Mobile', 'Branding'],
    coverUrl: '/images/projects/solivus/cover.png',
  },
  {
    _id: 'merxo',
    title: 'Merxo',
    slug: { current: 'merxo' },
    client: 'Merxo',
    year: 2025,
    metric: '+280% velocidad de cierre',
    services: ['Brand Design', 'Product Design', 'Web App'],
  },
  {
    _id: 'nexo-go',
    title: 'Nexo Go',
    slug: { current: 'nexo-go' },
    client: 'Nexo Go',
    year: 2025,
    metric: '0 robos entre usuarios activos',
    services: ['Brand Design', 'Mobile Design', 'IoT UX'],
  },
  {
    _id: 'greenery-420',
    title: 'Greenery 420',
    slug: { current: 'greenery-420' },
    client: 'Greenery 420 CBD',
    year: 2025,
    metric: '+185% conversión vs benchmark wellness',
    services: ['Brand Design', 'E-commerce', 'Shopify'],
  },
  {
    _id: 'maison-oliva',
    title: 'Maison Oliva',
    slug: { current: 'maison-oliva' },
    client: 'Maison Oliva',
    year: 2025,
    metric: '+240% tiempo en sitio vs benchmark moda',
    services: ['Art Direction', 'E-commerce', 'Shopify'],
  },
]

export async function SelectedWork() {
  const t = await getTranslations('selectedWork')
  // Covers live in the CMS; the static list is only a fallback so the section
  // still renders if Sanity is down.
  const cms = await getProjectCards()
  const projects: Project[] = cms?.length ? cms : MOCK
  const [p1, p2, p3, p4, p5] = projects

  return (
    <section aria-label={t('headline')} className="border-t border-line">

      <div className="flex items-end justify-between gutter-x pt-20 md:pt-28 pb-14 md:pb-20">
        <div>
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-4">
            {t('seccion')}
          </span>
          <h2
            className="font-display font-semibold text-paper leading-[0.9] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
          >
            {t('headline')}
          </h2>
        </div>
        <Link
          href="/proyectos"
          className="hidden md:inline-flex items-center gap-2 font-mono text-smoke text-[10px] uppercase tracking-[0.22em] hover:text-paper transition-colors duration-200"
        >
          {t('ctaTodo')} <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="gutter-x pb-24 md:pb-36 flex flex-col gap-6 md:gap-[11vh]">

        {/* Fila 1: Solivus (grande) + Merxo (pequeño, alineado abajo) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-[1.4vw]">
          <div className="md:col-span-7">
            <ProjectCard project={p1} n={1} variant="pair" />
          </div>
          <div className="md:col-span-4 md:col-start-9 md:self-end">
            <ProjectCard project={p2} n={2} variant="pair" />
          </div>
        </div>

        {/* Fila 2: Nexo Go (featured, ancho editorial) */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-10 md:col-start-2">
            <ProjectCard project={p3} n={3} variant="featured" />
          </div>
        </div>

        {/* Fila 3: Greenery 420 (pequeño, alineado abajo) + Maison Oliva (grande) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-[1.4vw]">
          <div className="md:col-span-4 md:self-end">
            <ProjectCard project={p4} n={4} variant="pair" />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ProjectCard project={p5} n={5} variant="pair" />
          </div>
        </div>

        <div className="md:hidden mt-4">
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 font-mono text-smoke text-[10px] uppercase tracking-[0.22em] hover:text-paper transition-colors duration-200"
          >
            {t('ctaTodo')} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

    </section>
  )
}
