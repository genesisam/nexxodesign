'use client'

/**
 * Sección "Built by ideas" de /nosotros: estudio 3D explorable + historias en HTML.
 *
 * - Se monta solo cuando la sección entra en pantalla (póster mientras tanto).
 * - Desktop: GLB completo con intro de montaje (una vez por sesión) y clips.
 * - Móvil / prefers-reduced-motion: GLB estático fusionado, sin intro, cortes de cámara.
 * - Textos 100 % HTML (accesibles e indexables) y botones equivalentes a los objetos 3D.
 */
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Link } from '@/lib/navigation'
import type { EstudioId, EstudioPhase } from './EstudioScene'

const EstudioScene = dynamic(() => import('./EstudioScene'), { ssr: false })

export type EstudioCopy = {
  label: string
  hint: string
  loading: string
  replay: string
  back: string
  start: string
  drag: string
  next: string
  objects: Record<EstudioId, string>
  stories: Record<EstudioId, { eyebrow: string; title: string; subtitle?: string; body: string; cta?: string }>
}

const ORDER: EstudioId[] = ['notebook', 'computer', 'bricks', 'lamp']
const SEEN_KEY = 'nexxo:estudio-intro'
const eyebrow = 'font-mono text-[9px] uppercase tracking-[0.28em]'

export function NexxoEstudio({ copy }: { copy: EstudioCopy }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)     // la sección ya se acercó al viewport
  const [visible, setVisible] = useState(false)     // está en pantalla (pausa el render fuera)
  const [env, setEnv] = useState<{ lowPower: boolean; veryLow: boolean; reduced: boolean } | null>(null)
  const [data, setData] = useState<{ manifest: unknown; intro: unknown } | null>(null)
  const [phase, setPhase] = useState<EstudioPhase>('loading')
  const [active, setActive] = useState<EstudioId | null>(null)
  const [hover, setHover] = useState<EstudioId | null>(null)
  const [request, setRequest] = useState<{ id: EstudioId | null; n: number }>({ id: null, n: 0 })
  const [replay, setReplay] = useState(0)
  const [visited, setVisited] = useState<EstudioId[]>([])

  // entorno: potencia y movimiento reducido
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const lowPower = coarse || window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4
    // equipos con muy poca memoria: reposo fusionado (sin clips, solo viajes de cámara)
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
    setEnv({ lowPower, veryLow: mem <= 2, reduced })
  }, [])

  // carga perezosa + pausa fuera de pantalla
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) setMounted(true) }, { rootMargin: '400px' })
    const on = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
    near.observe(el)
    on.observe(el)
    return () => { near.disconnect(); on.disconnect() }
  }, [])

  // datos (manifiesto + pistas de intro)
  useEffect(() => {
    if (!mounted || !env) return
    const skipIntro = env.lowPower || env.reduced || sessionStorage.getItem(SEEN_KEY) === '1'
    Promise.all([
      fetch('/3d/nexxo_manifest.json').then((r) => r.json()),
      skipIntro ? Promise.resolve(null) : fetch('/3d/nexxo_intro_tracks.json').then((r) => r.json()),
    ]).then(([manifest, intro]) => setData({ manifest, intro }))
  }, [mounted, env])

  const onPhase = useCallback((p: EstudioPhase, id: EstudioId | null) => {
    setPhase(p)
    setActive(p === 'home' ? null : id)
    if (id && (p === 'opening' || p === 'open')) setVisited((v) => (v.includes(id) ? v : [...v, id]))
    if (p === 'home') sessionStorage.setItem(SEEN_KEY, '1')
  }, [])

  const select = (id: EstudioId) => {
    if (phase !== 'home' && phase !== 'open') return
    setRequest((r) => ({ id, n: r.n + 1 }))
  }
  const back = () => setRequest((r) => ({ id: null, n: r.n + 1 }))

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && (phase === 'open' || phase === 'opening')) back() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [phase])

  const story = active ? copy.stories[active] : null
  const ready = phase !== 'loading'
  const busy = phase === 'intro' || phase === 'opening' || phase === 'returning'

  return (
    <div
      ref={wrap}
      className="relative w-full overflow-hidden bg-ink aspect-[9/14] md:aspect-[21/9] md:min-h-[520px]"
      aria-label={copy.label}
      role="region"
    >
      {/* póster: se ve hasta que la escena 3D está lista */}
      <picture className={clsx('absolute inset-0 transition-opacity duration-700', ready ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
        <source media="(max-width: 767px)" srcSet="/3d/estudio-poster-mobile.webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/3d/estudio-poster.webp" alt="" className="w-full h-full object-cover" draggable={false} />
      </picture>

      {mounted && env && data && (
        <div className="absolute inset-0">
          <EstudioScene
            src={env.veryLow ? '/3d/nexxo_studio_static.glb' : '/3d/nexxo_studio.glb'}
            manifest={data.manifest as never}
            intro={data.intro as never}
            request={request}
            replay={replay}
            reducedMotion={env.reduced}
            active={visible}
            lowPower={env.lowPower}
            onPhase={onPhase}
            onHover={setHover}
            phase={phase}
            hoverExternal={hover}
            visited={visited}
            hint={visited.length ? null : copy.start}
            labels={copy.objects}
            freeLook={!env.lowPower && !env.reduced}
          />
        </div>
      )}

      {/* cabecera de la sección */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 gutter-x pt-6 md:pt-8 flex items-start justify-between gap-6">
        <p className={`${eyebrow} text-paper/65`}>{copy.label}</p>
        {!ready && <p className={`${eyebrow} text-paper/50`} aria-live="polite">{copy.loading}</p>}
      </div>

      {/* degradado inferior: legibilidad de la navegación sobre la escena */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-32 bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      {/* navegación accesible equivalente a los objetos 3D */}
      <nav
        aria-label={copy.hint}
        className={clsx(
          'absolute left-0 right-0 bottom-0 gutter-x pb-5 md:pb-7 flex flex-wrap items-center gap-2 transition-opacity duration-500',
          phase === 'home' ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        <span className={`${eyebrow} text-paper/55 mr-2 max-sm:w-full max-sm:mb-1`}>{copy.hint}</span>
        {ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => select(id)}
            onMouseEnter={() => setHover(id)}
            onMouseLeave={() => setHover(null)}
            className={clsx(
              'font-mono text-[10px] uppercase tracking-[0.22em] px-3 py-2 border transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              hover === id ? 'border-paper text-paper' : 'border-paper/25 text-paper/70 hover:border-paper hover:text-paper',
            )}
          >
            <span className="text-paper/60 mr-2">{String(ORDER.indexOf(id) + 1).padStart(2, '0')}</span>
            {copy.objects[id]}
            {visited.includes(id) && <span className="ml-2 text-paper/60" aria-hidden>✓</span>}
          </button>
        ))}
        {env && !env.lowPower && !env.reduced && (
          <span className={`${eyebrow} text-paper/60 ml-auto max-md:hidden`} aria-hidden>
            ⟷ {copy.drag}
          </span>
        )}
        {ready && !busy && (
          <button
            type="button"
            onClick={() => { sessionStorage.removeItem(SEEN_KEY); setReplay((r) => r + 1) }}
            className="ml-4 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/60 hover:text-paper transition-colors max-md:ml-auto max-sm:ml-0"
          >
            {copy.replay}
          </button>
        )}
      </nav>

      {/* historia activa */}
      <article
        aria-live="polite"
        className={clsx(
          'absolute gutter-x transition-all duration-700 ease-out-expo',
          'max-md:left-0 max-md:right-0 max-md:bottom-4',
          'md:left-0 md:top-1/2 md:-translate-y-1/2 md:max-w-[34vw]',
          story && (phase === 'open' || phase === 'opening') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none',
        )}
      >
        {story && (
          <div className="bg-ink/70 md:bg-ink/55 backdrop-blur-sm p-5 md:p-7 border border-paper/10">
            <p className={`${eyebrow} text-paper/60 mb-4`}>{story.eyebrow}</p>
            <h3
              className="font-display font-semibold text-paper leading-[1.02] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.6rem)' }}
            >
              {story.title}
            </h3>
            {story.subtitle && (
              <p className="font-display text-paper/70 mt-2" style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.5rem)' }}>
                {story.subtitle}
              </p>
            )}
            <p className="font-mono text-paper/70 leading-relaxed mt-5" style={{ fontSize: 'clamp(0.8rem, 0.95vw, 0.95rem)' }}>
              {story.body}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="button"
                onClick={back}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper border-b border-paper/40 pb-1 hover:border-paper transition-colors"
              >
                ← {copy.back}
              </button>
              {active && ORDER.indexOf(active) < ORDER.length - 1 && (
                <button
                  type="button"
                  onClick={() => select(ORDER[ORDER.indexOf(active) + 1])}
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/80 hover:text-paper transition-colors"
                >
                  {copy.next}: {String(ORDER.indexOf(active) + 2).padStart(2, '0')} {copy.objects[ORDER[ORDER.indexOf(active) + 1]]} →
                </button>
              )}
              {story.cta && (
                <Link href="/proyectos" className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-soft hover:text-paper transition-colors">
                  {story.cta}
                </Link>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
