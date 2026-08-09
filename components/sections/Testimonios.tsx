'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

// ── Swap por URL real de Google / Clutch ──────────────────────────────────────
const REVIEWS_URL = '#'

// ── Schema Testimonial (compatible con Sanity) ────────────────────────────────
export type Testimonial = {
  _id:     string
  name:    string
  role:    string
  company: string
  avatar:  string | null
  quote:   string
  result:  string | null
}

const TESTIMONIALS: Testimonial[] = [
  {
    _id: 't1', name: 'Laura Muñoz', role: 'CEO', company: 'Tolvia',
    avatar: null,
    quote:  'Alexander transformó nuestras ideas en un producto final impresionante. Su habilidad para dar vida a nuestra visión y asegurarse de que cada detalle encajara perfectamente con la identidad de nuestra marca fue realmente extraordinaria.',
    result: 'Producto lanzado en 3 sem.',
  },
  {
    _id: 't2', name: 'Jordi Pérez', role: 'CTO', company: 'Adictic',
    avatar: null,
    quote:  'La experiencia y dedicación de Alexander marcaron toda la diferencia. Se comunicó con claridad y entregó resultados que superaron ampliamente nuestras expectativas. Un verdadero punto de inflexión para el negocio.',
    result: '+180% MRR',
  },
  {
    _id: 't3', name: 'Luis Fernando', role: 'CEO', company: 'Kontrolo',
    avatar: null,
    quote:  'El diseño de la landing page superó por completo lo que imaginábamos. Alexander captó la esencia de nuestra marca y la convirtió en una experiencia visual limpia, atractiva y orientada a resultados.',
    result: '+72% leads calificados',
  },
  {
    _id: 't4', name: 'Petar Bojkovic', role: 'CEO', company: 'Sturia',
    avatar: null,
    quote:  'Trabajar con Alexander fue un proceso eficiente y creativo. La landing page no solo refleja nuestra visión, sino que ha tenido un impacto significativo y medible en la conversión de clientes potenciales.',
    result: '2.8× conversión',
  },
  {
    _id: 't5', name: 'María Sierra', role: 'General Director', company: 'Deuslink Software',
    avatar: null,
    quote:  'Alexander entendió nuestra propuesta de valor desde el primer día y la tradujo en un diseño limpio, moderno y funcional. La landing ha mejorado enormemente la manera en que nos presentamos ante los clientes.',
    result: '+38% tasa de cierre',
  },
  {
    _id: 't6', name: 'Sonia Jiménez', role: 'Designer', company: 'Tricolors',
    avatar: null,
    quote:  'Alexander captó perfectamente la esencia de nuestra marca en un diseño visualmente atractivo y enfocado en la conversión. La landing no solo es impactante, sino también intuitiva y fácil de navegar.',
    result: '+61% CTR orgánico',
  },
  {
    _id: 't7', name: 'Diana Villamil', role: 'Project Director', company: 'Gradiweb',
    avatar: null,
    quote:  'En nuestro proyecto de eCommerce en Shopify, Alexander logró equilibrar perfectamente diseño y usabilidad. La tienda refleja nuestra identidad de marca y ofrece una experiencia de compra fluida y atractiva.',
    result: '×2.4 tasa de compra',
  },
  {
    _id: 't8', name: 'Clara Tirado', role: 'Graphic Designer', company: 'CTJ Studio',
    avatar: null,
    quote:  'La landing que Alexander diseñó superó nuestras expectativas. El resultado transmite profesionalismo y modernidad, captando de inmediato la atención de nuestra audiencia objetivo.',
    result: 'Entregado en 5 días',
  },
  {
    _id: 't9', name: 'Carlos Eduardo', role: 'CM Director', company: 'Ingenium Holding',
    avatar: null,
    quote:  'El diseño transmite profesionalismo y modernidad desde el primer scroll. Alexander tiene una capacidad única para entender el brief y convertirlo en algo que realmente comunica.',
    result: 'Lanzamiento en 2 sem.',
  },
  {
    _id: 't10', name: 'Álvaro Suárez', role: 'CEO & Founder', company: 'Tipi Solutions',
    avatar: null,
    quote:  'Alexander entregó un sitio web limpio y moderno que reflejó perfectamente nuestra marca. Su rápida comprensión de nuestras necesidades y atención al detalle hicieron que el proceso fuera sencillo y el resultado, impecable.',
    result: '+130% tráfico orgánico',
  },
]

const AVATAR_BG = ['#5B3DF5', '#1B6B5A', '#C9A88F', '#4A4A44', '#8B8B85', '#5B3DF5', '#1B6B5A', '#C9A88F', '#5B3DF5', '#1B6B5A']
const AVATAR_FG = ['#EFEBE3', '#EFEBE3', '#0E0E0E', '#EFEBE3', '#EFEBE3', '#EFEBE3', '#EFEBE3', '#0E0E0E', '#EFEBE3', '#EFEBE3']


/**
 * Ten attributed client reviews existed only as visual markup — invisible to
 * search and to answer engines. Emitted as Review nodes on the organisation.
 *
 * No `reviewRating` and no AggregateRating: we hold no star scores, and
 * inventing them would be fabricating data. Self-hosted reviews about your own
 * business are also not eligible for Google rich results — this is here for
 * semantic understanding and citability, not for stars in the SERP.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexxodesign.com'

function reviewsJsonLd(items: Testimonial[]) {
  return {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    '@id':      `${SITE_URL}/#organization`,
    review: items.map(t => ({
      '@type':      'Review',
      reviewBody:   t.quote,
      author:       { '@type': 'Person', name: t.name, jobTitle: t.role, worksFor: { '@type': 'Organization', name: t.company } },
      itemReviewed: { '@id': `${SITE_URL}/#organization` },
    })),
  }
}

// ── Card ──────────────────────────────────────────────────────────────────────

function TestimonialCard({
  t, idx, isActive, onEnter, onLeave,
}: {
  t:        Testimonial
  idx:      number
  isActive: boolean
  onEnter:  () => void
  onLeave:  () => void
}) {
  const bg = AVATAR_BG[idx % AVATAR_BG.length]
  const fg = AVATAR_FG[idx % AVATAR_FG.length]

  return (
    <div
      role="article"
      aria-label={`Testimonio de ${t.name}, ${t.company}`}
      // Raised dark surface rather than a light card: a paper panel broke the
      // dark language of the page. #232323 reads as elevated against the ink
      // ground, and the hairline keeps the edge defined at that low separation.
      className="flex-shrink-0 bg-line border border-paper/10 flex flex-col justify-between"
      style={{
        width:       'clamp(280px, 28vw, 480px)',
        aspectRatio: '0.95 / 1',
        padding:     'clamp(1.25rem, 1.85vw, 2.1rem)',
        opacity:     isActive ? 1 : 0.3,
        filter:      isActive ? 'none' : 'blur(3px)',
        transition:  'opacity 0.35s ease, filter 0.35s ease',
        cursor:      'default',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* ── TOP: avatar + nombre + empresa ───────────────────────────────── */}
      <div className="flex items-center" style={{ gap: 'clamp(10px, 1.1vw, 18px)' }}>
        <div
          className="rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{
            width:      'clamp(46px, 3.5vw, 62px)',
            height:     'clamp(46px, 3.5vw, 62px)',
            background: bg,
          }}
        >
          {t.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" draggable={false} />
          ) : (
            <span
              className="font-display font-semibold leading-none select-none"
              style={{ color: fg, fontSize: 'clamp(15px, 1.4vw, 22px)' }}
            >
              {t.name[0]}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p
            className="font-display font-semibold text-paper leading-tight truncate"
            style={{ fontSize: 'clamp(13px, 1.05vw, 17px)' }}
          >
            {t.name}
          </p>
          <p
            className="font-mono text-smoke/70 uppercase tracking-[0.16em] mt-0.5 truncate"
            style={{ fontSize: 'clamp(8px, 0.72vw, 11px)' }}
          >
            {t.company}
          </p>
        </div>
      </div>

      {/* ── BOTTOM: cita + badge de resultado ────────────────────────────── */}
      <div>
        <p
          className="font-sans text-paper/75 leading-snug"
          style={{ fontSize: 'clamp(0.92rem, 1.55vw, 1.45rem)' }}
        >
          {t.quote}
        </p>
        {t.result && (
          <div className="mt-4 pt-4 border-t border-paper/10">
            <span
              className="inline-block font-mono text-paper uppercase tracking-[0.22em] bg-accent"
              style={{ fontSize: 'clamp(7px, 0.62vw, 10px)', padding: '5px 10px' }}
            >
              {t.result}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sección ───────────────────────────────────────────────────────────────────

export function Testimonios() {
  const [activeIdx, setActive] = useState<number | null>(null)
  const [isPaused,  setIsPaused] = useState(false)
  const t = useTranslations('testimonios')

  // Duplicamos el array para que el marquee sea seamless:
  // la animación mueve la pista un -50% de su propio ancho (= una copia)
  // y al reiniciar queda igual — sin salto visible.
  const cards = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section aria-label="Testimonios" className="relative bg-ink py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd(TESTIMONIALS)) }}
      />

      {/* ── Cabecera ─────────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 lg:px-24 shrink-0 flex items-start justify-between mb-6 md:mb-8">
        <div>
          <span className="font-mono text-smoke/55 text-[9px] uppercase tracking-[0.25em] block mb-2.5">
            {t('seccion')}
          </span>
          <h2
            className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4.8rem)' }}
          >
            {t('headline1')}
            <br />{t('headline2')}
          </h2>
        </div>

        <Link
          href={REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block font-mono text-smoke/65 hover:text-paper text-[9px] md:text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 mt-1.5 shrink-0"
        >
          {t('leerResenas')}
        </Link>
      </div>

      {/* ── Marquee ──────────────────────────────────────────────────────────── */}
      {/*
        overflow-x-hidden oculta el scroll horizontal del marquee sin
        recortar verticalmente las cards de la cascada diagonal.
        paddingBottom da aire debajo de la última card.
      */}
      <div className="overflow-x-hidden">
        <div
          className="flex items-center w-max"
          style={{
            gap:                'clamp(10px, 2.2vw, 36px)',
            paddingBottom:      'clamp(24px, 3vw, 48px)',
            animation:          'testimonios-scroll 48s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
            willChange:         'transform',
          }}
        >
          {cards.map((t, i) => (
            <TestimonialCard
              key={`${t._id}-${i}`}
              t={t}
              idx={i % TESTIMONIALS.length}
              isActive={activeIdx === null || activeIdx === i}
              onEnter={() => { setIsPaused(true);  setActive(i) }}
              onLeave={() => { setIsPaused(false); setActive(null) }}
            />
          ))}
        </div>
      </div>

      {/* ── Link — solo mobile ────────────────────────────────────────────────── */}
      <div className="mt-5 px-6 md:hidden">
        <Link
          href={REVIEWS_URL}
          className="font-mono text-smoke/65 text-[9px] uppercase tracking-[0.22em]"
        >
          {t('leerResenas')}
        </Link>
      </div>

    </section>
  )
}
