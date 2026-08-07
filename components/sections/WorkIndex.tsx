'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

// ─── Types ───────────────────────────────────────────────────────────────────

export type Vertical = 'SaaS' | 'Fintech' | 'Web' | 'Branding' | 'IA'

// Schema shape — reemplaza el array mock por una query GROQ en page.tsx:
//   const projects = await sanityClient.fetch<Project[]>(`
//     *[_type=="project"] | order(orderRank) {
//       _id, title, slug, vertical, year, client, blurb,
//       "cover":      cover.asset->url,
//       "thumbnail":  thumbnail.asset->url,
//       "thumbVideo": thumbVideo.asset->url,
//     }
//   `)
export type Project = {
  _id:        string
  title:      string
  slug:       { current: string }
  vertical:   Vertical
  cover:      string | null
  logo:       string | null
  thumbnail:  string | null
  thumbVideo: string | null
  blurb:      string
  year:       number
  client?:    string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    _id: 'solivus', title: 'Solivus', slug: { current: 'solivus' }, vertical: 'SaaS',
    cover: '/images/projects/solivus/cover.png', logo: '/images/projects/solivus/logo.png',
    thumbnail: null, thumbVideo: null,
    blurb: 'Plataforma AI de monitoreo solar — dashboard, mobile y brand', year: 2025, client: 'Solivus',
  },
  {
    _id: 'merxo', title: 'Merxo', slug: { current: 'merxo' }, vertical: 'SaaS',
    cover: null, logo: '/images/projects/merxo/logo.png',
    thumbnail: null, thumbVideo: null,
    blurb: 'CRM que convierte caos comercial en pipeline predecible', year: 2025, client: 'Merxo',
  },
  {
    _id: 'nexo-go', title: 'Nexo Go', slug: { current: 'nexo-go' }, vertical: 'SaaS',
    cover: '/images/projects/nexo-go/cover.webp', logo: '/images/projects/nexo-go/logo.png',
    thumbnail: '/images/projects/nexo-go/story-2.webp', thumbVideo: null,
    blurb: 'App móvil de tracking y seguridad para bicicletas eléctricas', year: 2025, client: 'Nexo Go',
  },
  {
    _id: 'greenery-420', title: 'Greenery 420', slug: { current: 'greenery-420' }, vertical: 'Web',
    cover: null, logo: '/images/projects/greenery-420/logo.png',
    thumbnail: null, thumbVideo: null,
    blurb: 'E-commerce CBD premium — flores, aceites, hachís y wellness. Madrid.', year: 2025, client: 'Greenery 420 CBD',
  },
  {
    _id: 'maison-oliva', title: 'Maison Oliva', slug: { current: 'maison-oliva' }, vertical: 'Web',
    cover: null, logo: '/images/projects/maison-oliva/logo.png',
    thumbnail: null, thumbVideo: null,
    blurb: 'E-commerce de alta costura en Shopify — diseño editorial desktop y móvil', year: 2025, client: 'Maison Oliva',
  },
  {
    _id: 'tolvia', title: 'Tolvia', slug: { current: 'tolvia' }, vertical: 'IA',
    cover: null, logo: '/images/projects/tolvia/logo.png',
    thumbnail: null, thumbVideo: null,
    blurb: 'IA conversacional con voz natural — marca, web, app desktop y audiovisual', year: 2025, client: 'Tolvia',
  },
]

// ─── Design constants ─────────────────────────────────────────────────────────

const FILTER_TABS: Array<'Todos' | Vertical> = ['Todos', 'SaaS', 'Fintech', 'Web', 'Branding', 'IA']

// Gradient placeholder por vertical — se reemplaza con cover real en Sanity
const COVER_BG: Record<Vertical, string> = {
  SaaS:     'linear-gradient(148deg, #0c0c1e 0%, #12112c 40%, #1c1050 72%, #5B3DF5 100%)',
  Fintech:  'linear-gradient(148deg, #091410 0%, #0e1c17 40%, #0f2e24 72%, #1B6B5A 100%)',
  Web:      'linear-gradient(148deg, #16100c 0%, #241710 40%, #3a2114 72%, #C9A88F 100%)',
  Branding: 'linear-gradient(148deg, #0a0a0a 0%, #141414 40%, #222222 72%, #484848 100%)',
  IA:       'linear-gradient(148deg, #0d0814 0%, #1e0f38 40%, #2e1268 72%, #6B35C8 100%)',
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────

export function ProjectCard({
  project,
  prefersReduced,
  isMobile,
  aspectRatio = '3 / 4',
  verLabel = 'Ver proyecto →',
}: {
  project:        Project
  prefersReduced: boolean
  isMobile:       boolean
  aspectRatio?:   string
  verLabel?:      string
}) {
  const [cardHover,  setCardHover]  = useState(false)
  const [thumbHover, setThumbHover] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v || prefersReduced || isMobile || !project.thumbVideo) return
    if (thumbHover) { v.play().catch(() => {}) }
    else            { v.pause(); v.currentTime = 0 }
  }, [thumbHover, prefersReduced, isMobile, project.thumbVideo])

  const bg = COVER_BG[project.vertical]
  // Helper: returns 'none' when user prefers reduced motion
  const tr = (val: string) => (prefersReduced ? 'none' : val)

  return (
    <Link
      href={`/proyectos/${project.slug.current}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => { setCardHover(false); setThumbHover(false) }}
    >
      {/* ── Cover ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ aspectRatio }}>

        {/* Background: scaleable on hover */}
        <div
          className="absolute inset-0"
          style={{
            transform:  cardHover ? 'scale(1.06)' : 'scale(1)',
            transition: tr('transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)'),
          }}
        >
          {project.cover ? (
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full relative" style={{ background: bg }}>
              {project.logo && (
                <div className="absolute inset-0 flex items-center justify-center p-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.logo}
                    alt={project.title}
                    className="w-auto max-h-[38%] max-w-[55%] object-contain"
                    style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                    draggable={false}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom vignette — legibilidad del copy inferior */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to top, rgba(14,14,14,0.85), transparent)' }}
        />

        {/* Vertical badge — top left, siempre visible */}
        <div className="absolute top-3 left-3 z-20">
          <span
            className="font-mono text-paper/70 uppercase tracking-[0.2em]"
            style={{
              fontSize:            '7.5px',
              padding:             '4px 9px',
              background:          'rgba(14,14,14,0.6)',
              backdropFilter:      'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {project.vertical}
          </span>
        </div>

        {/* Year — bottom left */}
        <div className="absolute bottom-3.5 left-3.5 z-20">
          <span className="font-mono text-paper/35 tracking-[0.12em]" style={{ fontSize: '8px' }}>
            {project.year}
          </span>
        </div>

        {/* Glass overlay + "Ver proyecto →" — visible on hover */}
        <div
          aria-hidden
          className="absolute inset-0 z-20 pointer-events-none flex items-end justify-end"
          style={{
            background:           'rgba(14,14,14,0.5)',
            backdropFilter:       'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            opacity:    cardHover ? 1 : 0,
            transition: tr('opacity 0.35s ease'),
          }}
        >
          <span
            className="font-mono text-paper/90 uppercase tracking-[0.22em] m-4"
            style={{ fontSize: '9px' }}
          >
            {verLabel}
          </span>
        </div>
      </div>

      {/* ── Footer row: thumb + text ──────────────────────────────────────── */}
      <div className="flex items-start gap-3 mt-3">

        {/* Thumbnail 85×85 — imagen → video en hover (solo desktop) */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{ width: 85, height: 85 }}
          onMouseEnter={!isMobile ? () => setThumbHover(true) : undefined}
          onMouseLeave={!isMobile ? () => setThumbHover(false) : undefined}
        >
          {/* Imagen estática */}
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt=""
              fill
              sizes="85px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full" style={{ background: bg }} />
          )}

          {/* Video loop (desktop + video disponible) */}
          {project.thumbVideo && !isMobile && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={project.thumbVideo}
              muted
              loop
              playsInline
              preload="none"
              style={{
                opacity:    thumbHover && !prefersReduced ? 1 : 0,
                transition: tr('opacity 0.3s ease'),
              }}
            />
          )}

          {/* Subtle hover darkening */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'rgba(14,14,14,0.25)',
              opacity:    thumbHover ? 1 : 0,
              transition: tr('opacity 0.25s ease'),
            }}
          />
        </div>

        {/* Metadata */}
        <div className="min-w-0 pt-0.5">
          <h3
            className="font-display font-semibold text-paper leading-tight"
            style={{ fontSize: 'clamp(0.88rem, 1.05vw, 1.1rem)' }}
          >
            {project.title}
          </h3>
          {project.client && (
            <p
              className="font-mono text-smoke/35 uppercase tracking-[0.14em] mt-0.5 truncate"
              style={{ fontSize: '7.5px' }}
            >
              {project.client}
            </p>
          )}
          <p
            className="font-sans text-smoke/55 leading-snug mt-1.5 line-clamp-2"
            style={{ fontSize: '0.75rem' }}
          >
            {project.blurb}
          </p>
        </div>
      </div>
    </Link>
  )
}

// ─── WorkIndex ────────────────────────────────────────────────────────────────

export function WorkIndex({ projects: initialProjects }: { projects?: Project[] } = {}) {
  const t       = useTranslations('work')
  const projects = initialProjects ?? PROJECTS

  const todosLabel = t('filtros.todos')

  const [activeFilter, setFilter]  = useState<string>(todosLabel)
  const [prefersReduced, setReduced] = useState(false)
  const [isMobile, setMobile]      = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  const isAll    = activeFilter === todosLabel
  const filtered = isAll
    ? projects
    : projects.filter(p => p.vertical === activeFilter)

  return (
    <main className="bg-ink min-h-screen">

      {/* ── Hero editorial ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 pt-32 md:pt-40 pb-14 md:pb-20">

        <span className="font-mono text-smoke/30 text-[9px] uppercase tracking-[0.25em] block mb-7 md:mb-9">
          {t('hero.eyebrow')}
        </span>

        <h1
          className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(2.8rem, 7.5vw, 8rem)' }}
        >
          {t('hero.line1')}<br />
          <span className="text-accent">premium</span> {t('hero.para')}<br />
          SaaS, fintech {t('hero.conector')}{' '}
          <span className="text-accent">{t('hero.acento2')}</span>
        </h1>

        {/* Contador + filtro activo */}
        <div className="flex items-center gap-3 mt-7 md:mt-10">
          <span className="font-mono text-smoke/30 text-[9px] uppercase tracking-[0.2em]">
            {t('counter', { count: filtered.length })}
          </span>
          {!isAll && (
            <>
              <span className="text-smoke/20 text-[9px]">·</span>
              <span className="font-mono text-accent text-[9px] uppercase tracking-[0.2em]">
                {activeFilter}
              </span>
              <button
                onClick={() => setFilter(todosLabel)}
                className="font-mono text-smoke/30 hover:text-smoke/60 text-[9px] uppercase tracking-[0.2em] transition-colors duration-200"
              >
                {t('filtros.limpiar')}
              </button>
            </>
          )}
        </div>
      </section>

      {/* ── Filter tabs ──────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 pb-10 md:pb-12">
        <div
          role="tablist"
          aria-label={t('filtros.aria')}
          className="flex items-center gap-2 flex-wrap"
        >
          {[todosLabel, ...FILTER_TABS.slice(1)].map(v => {
            const active = activeFilter === v
            return (
              <button
                key={v}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(v)}
                className="font-mono text-[9px] uppercase tracking-[0.22em] px-4 py-2 border transition-colors duration-200"
                style={{
                  borderColor: active ? 'rgb(239 235 227)' : 'rgba(139,139,133,0.25)',
                  background:  active ? 'rgb(239 235 227)' : 'transparent',
                  color:       active ? '#0E0E0E'          : 'rgba(139,139,133,0.55)',
                }}
              >
                {v}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Project grid ─────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 pb-28 md:pb-36">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 md:gap-x-6 xl:gap-x-8 gap-y-12 md:gap-y-16">
            {filtered.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                prefersReduced={prefersReduced}
                isMobile={isMobile}
                verLabel={t('card.ver')}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 flex items-center justify-center">
            <span className="font-mono text-smoke/25 text-[9px] uppercase tracking-[0.25em]">
              {t('empty')}
            </span>
          </div>
        )}
      </section>

    </main>
  )
}
