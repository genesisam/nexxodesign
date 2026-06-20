import Link from 'next/link'
import { ProjectCard, type Project } from './ProjectCard'

// ── Mock data ──────────────────────────────────────────────────────────────
// To wire Sanity, replace with:
//   const projects = await sanityClient.fetch<Project[]>(`
//     *[_type=="project"] | order(order asc)[0...4] {
//       _id, title, slug, client, year, metric, coverImage, excerpt,
//       "services": tags
//     }
//   `)
const MOCK_PROJECTS: Project[] = [
  {
    _id: 'p1',
    title: 'App de ahorro e inversión para millennials',
    slug: { current: 'app-ahorro-inversion-millennials' },
    client: 'Kapital',
    year: 2025,
    metric: '+58% conversión',
    services: ['Product Design', 'Mobile App', 'Design System'],
  },
  {
    _id: 'p2',
    title: 'Dashboard de análisis predictivo B2B',
    slug: { current: 'dashboard-analisis-predictivo-b2b' },
    client: 'Astra IA',
    year: 2025,
    metric: '×3 retención al mes 3',
    services: ['UX Research', 'Web App', 'Data Viz'],
  },
  {
    _id: 'p3',
    title: 'Plataforma de portafolio inmobiliario',
    slug: { current: 'plataforma-portafolio-inmobiliario' },
    client: 'Raíces',
    year: 2025,
    metric: '+41% leads calificados',
    services: ['Product Design', 'Web App'],
  },
  {
    _id: 'p4',
    title: 'Sitio de fundraising Serie A',
    slug: { current: 'sitio-fundraising-serie-a' },
    client: 'Ciclo',
    year: 2024,
    metric: 'Ronda cerrada en 60 días',
    services: ['Web Design', 'Motion'],
  },
]

export function SelectedWork() {
  // col A = projects 0, 2  |  col B (offset) = projects 1, 3
  const colA = [MOCK_PROJECTS[0], MOCK_PROJECTS[2]]
  const colB = [MOCK_PROJECTS[1], MOCK_PROJECTS[3]]

  return (
    <section aria-label="Trabajo seleccionado" className="border-t border-line">

      {/* ── Heading ── */}
      <div className="flex items-end justify-between px-6 md:px-16 lg:px-24 pt-20 md:pt-28 pb-12 md:pb-16">
        <div>
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-4">
            02 — Work
          </span>
          <h2
            className="font-display font-semibold text-paper leading-[0.9] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
          >
            Trabajo<br className="hidden sm:block" /> seleccionado
          </h2>
        </div>

        <Link
          href="/work"
          className="hidden md:inline-flex items-center gap-2 font-mono text-smoke text-[10px] uppercase tracking-[0.22em] hover:text-paper transition-colors duration-200"
        >
          Ver todo el trabajo <span aria-hidden>→</span>
        </Link>
      </div>

      {/* ── Staggered grid — col A wider (3fr), col B narrower (2fr) ── */}
      {/*    Right col starts mt-20 md / mt-28 lg to create the offset   */}
      <div className="px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-x-4 lg:gap-x-6">

          {/* Column A — larger cards */}
          <div className="flex flex-col gap-10 md:gap-12">
            {colA.map((p, i) => (
              <ProjectCard key={p._id} project={p} n={i * 2 + 1} colSize="large" />
            ))}
          </div>

          {/* Column B — smaller cards, pushed down */}
          <div className="flex flex-col gap-10 md:gap-12 md:mt-20 lg:mt-28">
            {colB.map((p, i) => (
              <ProjectCard key={p._id} project={p} n={i * 2 + 2} colSize="small" />
            ))}
          </div>

        </div>

        {/* Mobile CTA */}
        <div className="mt-12 md:hidden">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-smoke text-[10px] uppercase tracking-[0.22em] hover:text-paper transition-colors duration-200"
          >
            Ver todo el trabajo <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

    </section>
  )
}
