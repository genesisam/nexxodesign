import Link from 'next/link'
import { sanityClient } from '@/sanity/lib/client'
import { projectsQuery } from '@/sanity/lib/queries'
import { ProjectCard, type ProjectCardData } from './ProjectCard'

// ── Placeholder data ───────────────────────────────────────────────────────
// Shown when Sanity isn't configured yet (no NEXT_PUBLIC_SANITY_PROJECT_ID).
// Replace with real projects in /studio once Sanity is set up.
const PLACEHOLDER_PROJECTS: ProjectCardData[] = [
  {
    _id: 'p1',
    title: 'Plataforma de inversión retail',
    slug: { current: 'plataforma-inversion-retail' },
    client: 'Fintech · Colombia',
    year: 2025,
    tags: ['SaaS', 'Fintech'],
    metric: '+58% conversión',
    excerpt: 'Rediseño del flujo de onboarding e inversión para una plataforma con 200k usuarios.',
  },
  {
    _id: 'p2',
    title: 'Dashboard de análisis predictivo',
    slug: { current: 'dashboard-analisis-predictivo' },
    client: 'IA · México',
    year: 2025,
    tags: ['IA', 'Dashboard'],
    metric: '×3 retención mes 3',
    excerpt: 'Interfaz de visualización para modelo ML de predicción de demanda.',
  },
  {
    _id: 'p3',
    title: 'App de gestión inmobiliaria',
    slug: { current: 'app-gestion-inmobiliaria' },
    client: 'Proptech · Bogotá',
    year: 2025,
    tags: ['Proptech', 'Mobile'],
    metric: '+41% leads calificados',
    excerpt: 'Gestión de portafolio para brokers y fondos de inversión inmobiliaria.',
  },
  {
    _id: 'p4',
    title: 'Web de fundraising Serie A',
    slug: { current: 'web-fundraising-serie-a' },
    client: 'SaaS · Argentina',
    year: 2024,
    tags: ['SaaS', 'Web'],
    metric: 'Ronda cerrada en 60 días',
    excerpt: 'Sitio de captación de inversores para startup de SaaS B2B.',
  },
  {
    _id: 'p5',
    title: 'Sistema de diseño enterprise',
    slug: { current: 'sistema-diseno-enterprise' },
    client: 'Fintech · Chile',
    year: 2024,
    tags: ['Fintech', 'Design System'],
    metric: '−70% tiempo de entrega UI',
    excerpt: 'Design system con 50+ componentes para banco digital.',
  },
  {
    _id: 'p6',
    title: 'Plataforma educativa con IA',
    slug: { current: 'plataforma-educativa-ia' },
    client: 'EdTech · LatAm',
    year: 2024,
    tags: ['IA', 'EdTech'],
    metric: '+89% completion rate',
    excerpt: 'Aprendizaje adaptativo con IA para el mercado hispanohablante.',
  },
]

async function getProjects(): Promise<ProjectCardData[]> {
  try {
    const data = await sanityClient.fetch<ProjectCardData[]>(projectsQuery)
    // Fall back to placeholders if Sanity returns empty (project not set up yet)
    return data?.length ? data.slice(0, 6) : PLACEHOLDER_PROJECTS
  } catch {
    return PLACEHOLDER_PROJECTS
  }
}

// ── Fusión image slot ──────────────────────────────────────────────────────
// Stage 1: styled placeholder.
// Stage 2: this becomes a <video> showreel or R3F WebGL composition.
function FusionPlaceholder() {
  return (
    <div className="relative w-full aspect-[21/9] bg-ink overflow-hidden border-b border-line">
      {/* Blueprint grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-line) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          opacity: 0.5,
        }}
        aria-hidden
      />

      {/* Inner frame */}
      <div className="absolute inset-6 md:inset-12 border border-line/40 pointer-events-none" aria-hidden />

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
        <span className="font-mono text-smoke/30 text-[9px] md:text-[10px] uppercase tracking-[0.3em]">
          Imagen de fusión · Etapa 2
        </span>
        <p
          className="font-display font-semibold text-paper/[0.07] leading-none tracking-tight pointer-events-none select-none"
          aria-hidden
          style={{ fontSize: 'clamp(2rem, 8vw, 6rem)' }}
        >
          Showreel / WebGL
        </p>
      </div>

      {/* Corner metadata — technical framing */}
      <span className="absolute top-4 left-4 md:top-6 md:left-6 font-mono text-smoke/25 text-[9px] uppercase tracking-widest">
        §5.3 Selected Work
      </span>
      <span className="absolute top-4 right-4 md:top-6 md:right-6 font-mono text-smoke/25 text-[9px] uppercase tracking-widest">
        21 : 9
      </span>
      <span className="absolute bottom-4 left-4 md:bottom-6 md:left-6 font-mono text-smoke/25 text-[9px]">
        1920 × 823
      </span>
      <span className="absolute bottom-4 right-4 md:bottom-6 md:right-6 font-mono text-smoke/25 text-[9px] uppercase tracking-widest">
        Nexxo · 2026
      </span>
    </div>
  )
}

// ── Section ────────────────────────────────────────────────────────────────
export async function SelectedWork() {
  const projects = await getProjects()

  // Distribute: 1 featured · 4 grid · 1 featured close
  const [first, ...rest] = projects
  const gridProjects = rest.slice(0, 4)   // projects 2–5
  const last = rest[4]                     // project 6

  return (
    <section aria-label="Trabajo seleccionado">

      {/* ── Section header ── */}
      <div className="flex items-end justify-between px-6 md:px-16 lg:px-24 py-16 md:py-24 border-b border-line">
        <div>
          <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-4">
            02 — Trabajo
          </span>
          <h2
            className="font-display font-semibold text-paper leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 5rem)' }}
          >
            Trabajo seleccionado
          </h2>
        </div>
        <Link
          href="/work"
          className="hidden md:inline-flex items-center gap-2 font-mono text-smoke text-[10px] uppercase tracking-[0.22em] hover:text-paper transition-colors duration-200"
        >
          Ver todo →
        </Link>
      </div>

      {/* ── Fusión hero image slot ── */}
      <FusionPlaceholder />

      {/* ── Project reel ── */}

      {/* 01 — Featured full-width */}
      {first && (
        <div className="border-b border-line">
          <ProjectCard project={first} n={1} featured />
        </div>
      )}

      {/* 02–05 — 2×2 grid */}
      {gridProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-line">
          {gridProjects.map((project, i) => (
            <div
              key={project._id}
              className={[
                // Right column gets left border on md+
                i % 2 === 0 ? 'md:border-r md:border-line' : '',
                // Bottom border except last row on md
                i < gridProjects.length - 2 ? 'border-b border-line md:border-b-0' : '',
                // Last two need bottom border back on mobile
                i >= gridProjects.length - 2 ? 'max-md:border-b max-md:border-line' : '',
              ].join(' ')}
            >
              <ProjectCard project={project} n={i + 2} />
            </div>
          ))}
        </div>
      )}

      {/* 06 — Closing full-width */}
      {last && (
        <ProjectCard project={last} n={6} featured />
      )}

    </section>
  )
}
