import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

// 'services' → 'tags' in GROQ: *[_type=="project"]{ ..., "services": tags }
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
  n: number
  /** Drives image size hint for next/image */
  colSize: 'large' | 'small'
}

export function ProjectCard({ project, n, colSize }: Props) {
  const label = String(n).padStart(2, '0')

  const imgSrc = project.coverImage
    ? urlFor(project.coverImage)
        .width(colSize === 'large' ? 1400 : 900)
        .height(colSize === 'large' ? 1400 : 900)
        .auto('format')
        .url()
    : null

  return (
    <Link
      href={`/work/${project.slug.current}`}
      className="group block"
      aria-label={`${project.title} — ${project.client}`}
    >
      {/* ── Cover — square ───────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-line">

        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={project.title}
            fill
            sizes={colSize === 'large'
              ? '(max-width: 768px) 100vw, 60vw'
              : '(max-width: 768px) 100vw, 40vw'}
            className="object-cover transition-transform duration-700 ease-in-out-expo group-hover:scale-[1.04]"
            priority={n <= 2}
          />
        ) : (
          /* Placeholder — swapped for real image via Sanity */
          <div className="absolute inset-0 flex items-end justify-end overflow-hidden">
            <span
              className="font-display font-semibold text-paper/[0.055] leading-none tracking-tight select-none pointer-events-none pr-4 pb-2"
              aria-hidden
              style={{ fontSize: 'clamp(8rem, 25vw, 22rem)' }}
            >
              {label}
            </span>
          </div>
        )}

        {/* Service tags — overlaid bottom-left, como referencia */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
          {project.services.map(s => (
            <span
              key={s}
              className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/90 bg-ink/65 px-2.5 py-1.5"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Number badge top-left */}
        <span className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke/50">
          {label}
        </span>

        {/* VIEW overlay */}
        <div
          className="absolute inset-0 bg-ink/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper border border-paper/50 px-6 py-3">
            View
          </span>
        </div>

      </div>

      {/* ── Metadata ──────────────────────────────────── */}
      <div className="pt-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-smoke">
            {project.client}
          </span>
          <span className="font-mono text-[10px] text-smoke/35">
            {project.year}
          </span>
        </div>

        <h3
          className="font-display font-semibold text-paper leading-[0.9] tracking-[-0.02em] transition-colors duration-300 group-hover:text-smoke"
          style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.875rem)' }}
        >
          {project.title}
        </h3>

        <p className="font-mono text-accent text-[11px] uppercase tracking-[0.16em] pt-0.5">
          {project.metric}
        </p>
      </div>
    </Link>
  )
}
