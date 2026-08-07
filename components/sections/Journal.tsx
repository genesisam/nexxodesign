'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

const JOURNAL_PATH = '/journal'

// ── Schema Post (compatible con Sanity) ───────────────────────────────────────
// En producción, reemplazar POSTS por:
// const data = await sanityFetch<Post[]>({
//   query: `*[_type=="post"] | order(publishedAt desc)[0...5]{
//     _id, title, slug, excerpt, category, publishedAt,
//     "cover": cover.asset->url, "videoSrc": video.asset->url
//   }`,
// })

export type Post = {
  _id:         string
  title:       string
  slug:        { current: string }
  excerpt:     string
  category:    'Diseño' | 'IA' | 'UX' | 'Proceso'
  cover:       string | null
  videoSrc?:   string | null
  publishedAt: string
}

const POSTS: Post[] = [
  {
    _id:         'p1',
    title:       'El diseño como ventaja competitiva',
    slug:        { current: 'diseno-ventaja-competitiva' },
    excerpt:     'Cómo una interfaz premium puede ser la diferencia entre convertir o perder a un usuario en los primeros 3 segundos.',
    category:    'Diseño',
    cover:       null,
    videoSrc:    null,
    publishedAt: '2025-03-10',
  },
  {
    _id:         'p2',
    title:       'IA generativa en el workflow de producto',
    slug:        { current: 'ia-generativa-workflow-producto' },
    excerpt:     'Las herramientas de IA no reemplazan al diseñador; lo amplifican. Así integramos modelos generativos sin perder criterio de diseño.',
    category:    'IA',
    cover:       null,
    videoSrc:    null,
    publishedAt: '2025-02-28',
  },
  {
    _id:         'p3',
    title:       'Jerarquía visual: el arte de guiar la mirada',
    slug:        { current: 'jerarquia-visual-guiar-mirada' },
    excerpt:     'Sin jerarquía no hay diseño, solo ruido. Principios para estructurar pantallas que comunican instantáneamente.',
    category:    'UX',
    cover:       null,
    videoSrc:    null,
    publishedAt: '2025-02-14',
  },
  {
    _id:         'p4',
    title:       'De brief a entrega en 4 semanas',
    slug:        { current: 'proceso-brief-entrega-4-semanas' },
    excerpt:     'El sprint de diseño que desarrollamos internamente para pasar de cero a producto premium sin pérdida de calidad.',
    category:    'Proceso',
    cover:       null,
    videoSrc:    null,
    publishedAt: '2025-01-30',
  },
  {
    _id:         'p5',
    title:       'Motion que convierte: micro-interacciones',
    slug:        { current: 'motion-design-microinteracciones' },
    excerpt:     'Las animaciones decorativas son ruido. Las funcionales reducen la carga cognitiva y aumentan el deleite percibido.',
    category:    'Diseño',
    cover:       null,
    videoSrc:    null,
    publishedAt: '2025-01-15',
  },
]

// Gradientes placeholder (se reemplazan al conectar Sanity con imágenes reales)
const CARD_BG = [
  'linear-gradient(148deg, #0c0c1e 0%, #12112c 40%, #1c1050 72%, #5B3DF5 100%)',
  'linear-gradient(148deg, #091410 0%, #0e1c17 40%, #0f2e24 72%, #1B6B5A 100%)',
  'linear-gradient(148deg, #16100c 0%, #241710 40%, #3a2114 72%, #C9A88F 100%)',
  'linear-gradient(148deg, #0a0a18 0%, #10103a 40%, #16165a 72%, #3535a0 100%)',
  'linear-gradient(148deg, #140a0a 0%, #281010 40%, #3c1414 72%, #8B2020 100%)',
]

// Badge de categoría — color de acento por tipo
const CATEGORY_COLOR: Record<Post['category'], string> = {
  Diseño:  '#5B3DF5',
  IA:      '#1B6B5A',
  UX:      '#C9A88F',
  Proceso: '#8B8B85',
}

// Ancho de cards: 1 activa al 40%, resto se reparten el 60%
const ACTIVE_PCT   = 40
const getInactivePct = (n: number) => (100 - ACTIVE_PCT) / (n - 1)  // 15% cuando n=5

// ── Componente ────────────────────────────────────────────────────────────────

export function Journal() {
  const [activeIdx,  setActiveIdx]  = useState(0)
  const [isMobile,   setIsMobile]   = useState(false)
  const videoRefs    = useRef<(HTMLVideoElement | null)[]>([])
  const prefersRef   = useRef(false)

  useEffect(() => {
    prefersRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Solo reproduce el video de la card activa
  useEffect(() => {
    if (isMobile) return
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === activeIdx) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [activeIdx, isMobile])

  const activate = useCallback((i: number) => setActiveIdx(i), [])

  const N          = POSTS.length
  const inactivePct = getInactivePct(N)

  return (
    <section aria-label="Journal" className="py-20 md:py-28 bg-ink">

      {/* ── Cabecera ─────────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 lg:px-24 flex items-end justify-between mb-10 md:mb-14">
        <div>
          <span className="block font-mono text-smoke/30 text-[9px] uppercase tracking-[0.25em] mb-3">
            07 — Journal
          </span>
          <h2
            className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5.8rem)' }}
          >
            Ideas sobre diseño,
            <br />producto e IA.
          </h2>
        </div>

        <Link
          href={JOURNAL_PATH}
          className="hidden md:block font-mono text-smoke/40 hover:text-paper text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 shrink-0 mb-1.5"
        >
          Ver todos los artículos →
        </Link>
      </div>

      {/* ── Galería ──────────────────────────────────────────────────────────── */}
      {/*
        Desktop:  flex sin overflow → acordeón con width transition.
        Mobile:   overflow-x-auto snap-x → carrusel de cards fijas.
        La altura usa clamp para adaptarse a viewports cortos.
      */}
      <div
        className={[
          'flex px-6 md:px-16 lg:px-24',
          isMobile
            ? 'overflow-x-auto snap-x snap-mandatory gap-3 [&::-webkit-scrollbar]:hidden'
            : 'overflow-hidden',
        ].join(' ')}
        style={{
          height:        'clamp(340px, 68vh, 680px)',
          scrollbarWidth: 'none',
        }}
      >
        {POSTS.map((post, i) => {
          const isActive = !isMobile && activeIdx === i
          const bg       = CARD_BG[i % CARD_BG.length]
          const noAnim   = prefersRef.current

          // Ancho: fijo en mobile, dinámico en desktop
          const cardWidth = isMobile
            ? '82vw'
            : `${isActive ? ACTIVE_PCT : inactivePct}%`

          return (
            <div
              key={post._id}
              role="button"
              tabIndex={0}
              aria-label={post.title}
              aria-expanded={isActive}
              className="relative flex-shrink-0 overflow-hidden cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
              style={{
                width:      cardWidth,
                transition: !isMobile && !noAnim
                  ? 'width 0.65s cubic-bezier(0.76, 0, 0.24, 1)'
                  : 'none',
              }}
              onMouseEnter={() => !isMobile && activate(i)}
              onClick={() => activate(i)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && activate(i)}
            >

              {/* ── Fondo: imagen cover o gradiente placeholder ─────────────── */}
              {post.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0" style={{ background: bg }} />
              )}

              {/* ── Video background (desktop + card activa únicamente) ──────── */}
              {post.videoSrc && !isMobile && (
                <video
                  ref={el => { videoRefs.current[i] = el }}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="none"
                  src={post.videoSrc}
                />
              )}

              {/* ── Gradiente de legibilidad (siempre) ──────────────────────── */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(14,14,14,0.95) 0%, rgba(14,14,14,0.45) 40%, rgba(14,14,14,0.1) 70%, transparent 100%)',
                }}
              />

              {/* ── Overlay tintado en ink: cards inactivas ─────────────────── */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'rgba(14,14,14,0.7)',
                  opacity:    isActive ? 0 : 1,
                  transition: !noAnim ? 'opacity 0.5s ease' : 'none',
                }}
              />

              {/* ── Contenido ───────────────────────────────────────────────── */}
              <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7">

                {/* ── TOP: badge de categoría ────────────────────────────────── */}
                <div>
                  <span
                    className="inline-block font-mono text-paper uppercase tracking-[0.2em]"
                    style={{
                      fontSize:        '8px',
                      padding:         '4px 9px',
                      background:      CATEGORY_COLOR[post.category],
                      letterSpacing:   '0.2em',
                    }}
                  >
                    {post.category}
                  </span>
                </div>

                {/* ── BOTTOM: zona inferior ──────────────────────────────────── */}
                <div className="relative">

                  {/* Título vertical — cards inactivas en desktop ──────────── */}
                  {!isMobile && (
                    <div
                      className="absolute bottom-0 left-0"
                      aria-hidden={isActive}
                      style={{
                        opacity:       isActive ? 0 : 1,
                        transition:    !noAnim ? 'opacity 0.3s ease' : 'none',
                        pointerEvents: 'none',
                        // Altura máxima igual al ~60% de la galería para no salir del card
                        maxHeight:     'clamp(180px, 38vh, 380px)',
                        overflow:      'hidden',
                      }}
                    >
                      <span
                        className="font-display font-semibold text-paper/50 leading-none block"
                        style={{
                          fontSize:    'clamp(0.7rem, 0.85vw, 0.9rem)',
                          writingMode: 'vertical-rl',
                          transform:   'rotate(180deg)',
                          whiteSpace:  'nowrap',
                          overflow:    'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {post.title}
                      </span>
                    </div>
                  )}

                  {/* Contenido activo (desktop) o siempre visible (mobile) ─── */}
                  <div
                    style={{
                      opacity:       isActive || isMobile ? 1 : 0,
                      transition:    !noAnim ? 'opacity 0.4s ease 0.18s' : 'none',
                      pointerEvents: isActive || isMobile ? 'auto' : 'none',
                    }}
                  >
                    {/* Título */}
                    <h3
                      className="font-display font-semibold text-paper leading-[1.05] tracking-[-0.025em] mb-3"
                      style={{ fontSize: 'clamp(1.1rem, 2vw, 1.85rem)' }}
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className="font-mono text-paper/60 leading-relaxed mb-5"
                      style={{ fontSize: isMobile ? '0.78rem' : 'clamp(0.65rem, 0.82vw, 0.78rem)' }}
                    >
                      {post.excerpt}
                    </p>

                    {/* Link "Leer más" */}
                    <Link
                      href={`/journal/${post.slug.current}`}
                      className="inline-flex items-center gap-2 font-mono text-paper text-[9px] uppercase tracking-[0.22em] border-b border-paper/30 pb-px hover:border-paper transition-colors duration-200"
                      onClick={e => e.stopPropagation()}
                      tabIndex={isActive || isMobile ? 0 : -1}
                    >
                      Leer más →
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )
        })}

        {/* Spacer de cola — mobile únicamente */}
        {isMobile && (
          <div aria-hidden className="flex-shrink-0 w-6" />
        )}
      </div>

      {/* ── Link "Ver todos" — mobile ──────────────────────────────────────── */}
      <div className="mt-8 px-6 md:hidden">
        <Link
          href={JOURNAL_PATH}
          className="font-mono text-smoke/40 text-[9px] uppercase tracking-[0.22em]"
        >
          Ver todos los artículos →
        </Link>
      </div>

    </section>
  )
}
