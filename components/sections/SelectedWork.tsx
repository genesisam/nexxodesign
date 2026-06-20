import Link from 'next/link'
import { ProjectCard, type Project } from './ProjectCard'

// ── Mock data ──────────────────────────────────────────────────────────────
// Shape mirrors the Sanity 'project' schema.
// To wire Sanity: replace with sanityClient.fetch(projectsQuery) and map
//   tags → services in the GROQ projection:
//   *[_type=="project"] | order(order asc)[0...4] {
//     _id, title, slug, client, year, metric, coverImage, excerpt,
//     "services": tags
//   }
const MOCK_PROJECTS: Project[] = [
  {
    _id: 'p1',
    title: 'App de ahorro e inversión para millennials',
    slug: { current: 'app-ahorro-inversion-millennials' },
    client: 'Kapital',
    year: 2025,
    metric: '+58% tasa de conversión',
    services: ['Product Design', 'Mobile App', 'Design System'],
    excerpt: 'Rediseño del onboarding e inversión para una plataforma fintech colombiana con 200k usuarios activos.',
  },
  {
    _id: 'p2',
    title: 'Dashboard de análisis predictivo B2B',
    slug: { current: 'dashboard-analisis-predictivo-b2b' },
    client: 'Astra IA',
    year: 2025,
    metric: '×3 retención al mes 3',
    services: ['UX Research', 'Web App', 'Data Viz'],
    excerpt: 'Interfaz de visualización de datos para un modelo ML de predicción de demanda en logística.',
  },
  {
    _id: 'p3',
    title: 'Plataforma de gestión de portafolio inmobiliario',
    slug: { current: 'plataforma-gestion-portafolio-inmobiliario' },
    client: 'Raíces',
    year: 2025,
    metric: '+41% leads calificados',
    services: ['Product Design', 'Web App'],
    excerpt: 'Plataforma de gestión y análisis de portafolio para fondos de inversión inmobiliaria en LatAm.',
  },
  {
    _id: 'p4',
    title: 'Sitio de fundraising para Serie A',
    slug: { current: 'sitio-fundraising-serie-a' },
    client: 'Ciclo',
    year: 2024,
    metric: 'Ronda cerrada en 60 días',
    services: ['Web Design', 'Framer', 'Motion'],
    excerpt: 'Sitio de captación y storytelling para una startup SaaS B2B en proceso de levantamiento Serie A.',
  },
]

// ── Section ────────────────────────────────────────────────────────────────
export function SelectedWork() {
  const left  = [MOCK_PROJECTS[0], MOCK_PROJECTS[2]] // col A — projects 1 & 3
  const right = [MOCK_PROJECTS[1], MOCK_PROJECTS[3]] // col B — projects 2 & 4 (offset)

  return (
    <section
      aria-label="Trabajo seleccionado"
      className="border-t border-line"
    >
      {/* ── Heading row ── */}
      <div className="flex items-end justify-between px-6 md:px-16 lg:px-24 pt-20 md:pt-28 pb-14 md:pb-20">
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
          className="hidden md:inline-flex items-center gap-2 font-mono text-smoke text-[10px] uppercase tracking-[0.22em] hover:text-paper transition-colors duration-200 pb-1"
        >
          Ver todo el trabajo
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* ── Staggered 2-column grid ── */}
      <div className="px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 lg:gap-x-7">

          {/* Column A — starts at baseline */}
          <div className="flex flex-col gap-14 md:gap-16">
            {left.map((project, i) => (
              <ProjectCard key={project._id} project={project} n={i * 2 + 1} />
            ))}
          </div>

          {/* Column B — pushed down to create the stagger */}
          <div className="flex flex-col gap-14 md:gap-16 md:mt-20 lg:mt-28">
            {right.map((project, i) => (
              <ProjectCard key={project._id} project={project} n={i * 2 + 2} />
            ))}
          </div>

        </div>

        {/* Mobile CTA — visible only below md */}
        <div className="mt-14 md:hidden">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-smoke text-[10px] uppercase tracking-[0.22em] hover:text-paper transition-colors duration-200"
          >
            Ver todo el trabajo
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

    </section>
  )
}
