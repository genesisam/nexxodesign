import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export type ProjectCardData = {
  _id: string
  title: string
  slug: { current: string }
  client?: string
  year?: number
  tags?: string[]
  metric?: string
  excerpt?: string
  coverImage?: { asset: { _ref: string } }
}

type Props = {
  project: ProjectCardData
  /** Display number (01, 02 …) */
  n: number
  /** Spans full section width; taller image ratio */
  featured?: boolean
}

export function ProjectCard({ project, n, featured = false }: Props) {
  const label = String(n).padStart(2, '0')

  // Sanity image URL — only computed when coverImage exists
  const imgSrc = project.coverImage
    ? urlFor(project.coverImage)
        .width(featured ? 2400 : 1200)
        .height(featured ? 840 : 800)
        .auto('format')
        .url()
    : null

  return (
    <Link
      href={`/work/${project.slug.current}`}
      className="group block border-b border-line"
      aria-label={project.title}
    >
      {/* ── Image ── */}
      <div
        className={[
          'relative overflow-hidden bg-line',
          featured ? 'aspect-[16/7]' : 'aspect-[3/2]',
        ].join(' ')}
      >
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={project.title}
            fill
            sizes={featured ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
            className="object-cover transition-transform duration-700 ease-in-out-expo group-hover:scale-[1.03]"
            priority={n <= 2}
          />
        ) : (
          /* Placeholder — replaced once Sanity has real images */
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 select-none">
            {/* Hairline frame */}
            <div className="absolute inset-4 md:inset-8 border border-line/30 pointer-events-none" />

            {/* Number — large watermark */}
            <span
              className="font-display font-semibold text-paper/[0.06] leading-none tracking-tight pointer-events-none self-end mt-auto"
              aria-hidden
              style={{ fontSize: 'clamp(6rem, 22vw, 18rem)' }}
            >
              {label}
            </span>

            {/* Bottom meta */}
            <div className="relative flex items-end justify-between mt-auto pt-4">
              <span className="font-mono text-smoke/30 text-[9px] uppercase tracking-[0.25em]">
                {project.client}
              </span>
              <span className="font-mono text-smoke/20 text-[9px]">
                Imagen pendiente
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Metadata ── */}
      <div
        className={[
          'grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 py-6',
          featured ? 'px-6 md:px-16 lg:px-24' : 'px-6 md:px-8',
        ].join(' ')}
      >
        {/* Label row */}
        <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.22em] col-start-1">
          {[project.client, project.year].filter(Boolean).join(' · ')}
        </span>
        <span className="font-mono text-smoke/30 text-[10px] col-start-2 self-start">
          {label}
        </span>

        {/* Title */}
        <h3
          className={[
            'font-display font-semibold text-paper leading-[0.88] tracking-[-0.02em] col-span-2',
            'transition-colors duration-300 group-hover:text-smoke',
            featured ? 'text-4xl md:text-6xl lg:text-7xl mt-2' : 'text-2xl md:text-3xl mt-1',
          ].join(' ')}
        >
          {project.title}
        </h3>

        {/* Metric */}
        {project.metric && (
          <p className="font-mono text-accent text-xs mt-1 col-span-2">
            {project.metric}
          </p>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 col-span-2">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-[0.18em] text-smoke/50 border border-line px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
