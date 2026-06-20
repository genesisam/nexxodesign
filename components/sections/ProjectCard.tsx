import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

// ── Type ──────────────────────────────────────────────────────────────────
// 'services' maps to 'tags' in the GROQ query when Sanity is wired:
//   *[_type=="project"]{ ..., "services": tags }
export type Project = {
  _id: string
  title: string
  slug: { current: string }
  client: string
  year: number
  metric: string
  services: string[]
  coverImage?: { asset: { _ref: string } }
  excerpt?: string
}

type Props = {
  project: Project
  /** Sequential display number — 01, 02 … */
  n: number
}

export function ProjectCard({ project, n }: Props) {
  const label = String(n).padStart(2, '0')

  const imgSrc = project.coverImage
    ? urlFor(project.coverImage).width(1200).height(1500).auto('format').url()
    : null

  return (
    <Link
      href={`/work/${project.slug.current}`}
      className="group block"
      aria-label={`${project.title} — ${project.client}`}
    >
      {/* ── Cover image ───────────────────────────────── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-line">

        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover transition-transform duration-700 ease-in-out-expo group-hover:scale-[1.04]"
            priority={n <= 2}
          />
        ) : (
          /* Placeholder — removed once coverImage exists in Sanity */
          <div className="absolute inset-0 flex flex-col justify-end p-8 select-none">
            {/* Subtle corner mark */}
            <div className="absolute top-6 left-6 right-6 bottom-6 border border-line/20 pointer-events-none" />
            {/* Watermark number */}
            <span
              className="absolute bottom-0 right-4 font-display font-semibold text-paper/[0.05] leading-none tracking-tight pointer-events-none"
              aria-hidden
              style={{ fontSize: 'clamp(7rem, 20vw, 16rem)' }}
            >
              {label}
            </span>
          </div>
        )}

        {/* ── VIEW overlay ────────────────────────────── */}
        <div
          className="absolute inset-0 bg-ink/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper border border-paper/50 px-6 py-3">
            View
          </span>
        </div>

        {/* Project number — top-left badge */}
        <span className="absolute top-5 left-5 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke/60">
          {label}
        </span>

      </div>

      {/* ── Metadata ──────────────────────────────────── */}
      <div className="pt-5 space-y-2">

        {/* Client + year */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
            {project.client}
          </span>
          <span className="font-mono text-[10px] text-smoke/40">
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display font-semibold text-paper leading-[0.9] tracking-[-0.02em] transition-colors duration-300 group-hover:text-smoke"
          style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)' }}
        >
          {project.title}
        </h3>

        {/* Metric */}
        <p className="font-mono text-accent text-[11px] uppercase tracking-[0.18em] pt-1">
          {project.metric}
        </p>

        {/* Service tags */}
        {project.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.services.map(s => (
              <span
                key={s}
                className="font-mono text-[9px] uppercase tracking-[0.18em] text-smoke/50 border border-line px-2.5 py-1"
              >
                {s}
              </span>
            ))}
          </div>
        )}

      </div>
    </Link>
  )
}
