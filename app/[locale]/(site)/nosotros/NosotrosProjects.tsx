import { ProjectCard } from '@/components/sections/ProjectCard'
import type { Project } from '@/components/sections/ProjectCard'
import { sanityClient } from '@/sanity/lib/client'

const PROJECTS_QUERY = `
  *[_type == "project"] | order(orderRank asc, _createdAt desc)[0...2] {
    _id,
    title,
    slug,
    client,
    year,
    metric,
    "services": coalesce(services, tags),
    "coverUrl": coverImage.asset->url,
    coverImage
  }
`

const FALLBACK: Project[] = [
  {
    _id: 'solivus',
    title: 'Plataforma AI de monitoreo solar',
    slug: { current: 'solivus' },
    client: 'Solivus',
    year: 2025,
    metric: '−47% tiempo de respuesta',
    services: ['Product Design', 'Dashboard UI', 'Mobile'],
    coverUrl: '/images/projects/solivus/cover.png',
  },
  {
    _id: 'p1',
    title: 'App de ahorro e inversión',
    slug: { current: 'app-ahorro-inversion-millennials' },
    client: 'Kapital',
    year: 2025,
    metric: '+58% conversión',
    services: ['Product Design', 'Mobile App'],
  },
  {
    _id: 'p2',
    title: 'Dashboard de análisis predictivo B2B',
    slug: { current: 'dashboard-analisis-predictivo-b2b' },
    client: 'Astra IA',
    year: 2025,
    metric: '×3 retención al mes 3',
    services: ['UX Research', 'Web App'],
  },
]

async function getProjects(): Promise<Project[]> {
  try {
    const data = await sanityClient.fetch<Project[]>(PROJECTS_QUERY)
    if (data && data.length > 0) return data
  } catch {
    // Sanity not configured yet — use fallback
  }
  return FALLBACK
}

export async function NosotrosProjects() {
  const projects = await getProjects()
  const [featured, second] = projects

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-[1.4vw] items-end">
      <div className="md:col-span-8">
        {featured && <ProjectCard project={featured} n={1} variant="featured" />}
      </div>
      <div className="md:col-span-4">
        {second && <ProjectCard project={second} n={2} variant="pair" />}
      </div>
    </div>
  )
}
