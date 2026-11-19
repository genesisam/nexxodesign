import { getTranslations } from 'next-intl/server'
import { getProjectCards } from '@/sanity/lib/project-data'
import type { Project } from './ProjectCard'
import { WorkShowcase } from './WorkShowcase'

/** Used only when Sanity is unreachable — the CMS is the source of truth. */
const MOCK: Project[] = [
  {
    _id: 'solivus',
    title: 'Solivus',
    slug: { current: 'solivus' },
    client: 'Solivus',
    year: 2025,
    metric: '48 métricas auditadas, 9 en primer plano',
    services: ['Product Design', 'Dashboard UI', 'Mobile', 'Branding'],
    coverUrl: '/images/projects/solivus/cover.webp',
  },
  {
    _id: 'merxo',
    title: 'Merxo',
    slug: { current: 'merxo' },
    client: 'Merxo',
    year: 2025,
    metric: 'Un pipeline de cinco etapas y workflows en tres clics',
    services: ['Brand Design', 'Product Design', 'Web App'],
  },
  {
    _id: 'nexo-go',
    title: 'Nexo Go',
    slug: { current: 'nexo-go' },
    client: 'Nexo Go',
    year: 2025,
    metric: 'Una capa digital donde solo había hardware',
    services: ['Brand Design', 'Mobile Design', 'IoT UX'],
  },
  {
    _id: 'greenery-420',
    title: 'Greenery 420',
    slug: { current: 'greenery-420' },
    client: 'Greenery 420 CBD',
    year: 2025,
    metric: 'Cinco líneas ordenadas por beneficio, no por formato',
    services: ['Brand Design', 'E-commerce', 'Shopify'],
  },
  {
    _id: 'maison-oliva',
    title: 'Maison Oliva',
    slug: { current: 'maison-oliva' },
    client: 'Maison Oliva',
    year: 2025,
    metric: 'Un tema Shopify a medida, sin una sola plantilla',
    services: ['Art Direction', 'E-commerce', 'Shopify'],
  },
]

export async function SelectedWork() {
  const t = await getTranslations('selectedWork')
  // Covers live in the CMS; the static list is only a fallback so the section
  // still renders if Sanity is down.
  const cms = await getProjectCards()
  const projects: Project[] = cms?.length ? cms : MOCK

  return (
    <WorkShowcase
      projects={projects.slice(0, 5)}
      headline={t('headline')}
      cta={t('ctaTodo')}
      ctaHref="/proyectos"
    />
  )
}
