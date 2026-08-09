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
  coverUrl?: string
  excerpt?: string
}

type Variant = 'pair' | 'featured'

type Props = {
  project: Project
  n: number
  variant?: Variant
}

const ASPECT: Record<Variant, string> = {
  pair:     'aspect-square',
  featured: 'aspect-[16/9]',
}


const IMG_DIM: Record<Variant, { w: number; h: number }> = {
  pair:     { w: 1000, h: 1000 },
  featured: { w: 2400, h: 1350 },
}

export function ProjectCard({ project, n, variant = 'pair' }: Props) {
  const label = String(n).padStart(2, '0')
  const { w, h } = IMG_DIM[variant]

  const imgSrc = project.coverUrl
    ?? (project.coverImage
      ? urlFor(project.coverImage).width(w).height(h).auto('format').url()
      : null)

  return (
    <Link
      href={`/proyectos/${project.slug.current}`}
      className="group block"
      aria-label={`${project.title} — ${project.client}`}
    >
      {/* ── Image ── */}
      <div className={`relative overflow-hidden bg-line ${ASPECT[variant]}`}>

        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={project.title}
            fill
            sizes={variant === 'featured' ? '(max-width: 768px) 100vw, 80vw' : '(max-width: 768px) 100vw, 50vw'}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            priority={n <= 2}
          />
        ) : (
          /* Placeholder watermark */
          <div className="absolute inset-0 flex items-end justify-end overflow-hidden">
            <span
              className="font-display font-semibold text-paper/[0.05] leading-none select-none pointer-events-none pr-4 pb-1"
              aria-hidden
              style={{ fontSize: 'clamp(4rem, 18vw, 20rem)' }}
            >
              {label}
            </span>
          </div>
        )}

        {/* Service tags — bottom-left overlay */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
          {project.services.map(s => (
            <span
              key={s}
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/85 bg-ink/65 px-2.5 py-1.5"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Number badge */}
        <span className="absolute top-4 left-4 font-mono text-[9px] text-smoke/65 tracking-widest">
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

      {/* ── Metadata ── */}
      <div className="pt-4 space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
            {project.client}
          </span>
          <span className="font-mono text-[10px] text-smoke/60">
            {project.year}
          </span>
        </div>
        <h3
          className="font-display font-semibold text-paper leading-[0.9] tracking-[-0.02em] transition-colors duration-300 group-hover:text-smoke"
          style={{ fontSize: variant === 'featured'
            ? 'clamp(1.5rem, 3vw, 2.75rem)'
            : 'clamp(1.2rem, 2vw, 1.75rem)' }}
        >
          {project.title}
        </h3>
        <p className="font-mono text-accent text-[11px] uppercase tracking-[0.15em] pt-0.5">
          {project.metric}
        </p>
      </div>
    </Link>
  )
}
