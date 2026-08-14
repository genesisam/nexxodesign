'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Each figure is stored in parts so it can be counted up, but the server still
 * renders the finished string — crawlers, answer engines and anyone without JS
 * read the real number, never a zero.
 */
const STATS = [
  { prefix: '',  num: 40,  decimals: 0, suffix: '+', label: 'proyectos entregados' },
  { prefix: '+', num: 280, decimals: 0, suffix: '%', label: 'velocidad de cierre (Merxo)' },
  { prefix: '×', num: 2.8, decimals: 1, suffix: '',  label: 'conversión promedio' },
  { prefix: '',  num: 4.9, decimals: 1, suffix: '★', label: 'satisfacción de clientes' },
  { prefix: '',  num: 24,  decimals: 0, suffix: 'h', label: 'respuesta máxima' },
] as const

const format = (s: typeof STATS[number], value: number) =>
  `${s.prefix}${value.toFixed(s.decimals)}${s.suffix}`

export function StatsBar() {
  const rootRef  = useRef<HTMLElement>(null)
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start:   'top 92%',
        once:    true,
        onEnter: () => {
          STATS.forEach((stat, i) => {
            const el = valueRefs.current[i]
            if (!el) return
            const counter = { v: 0 }
            gsap.to(counter, {
              v:        stat.num,
              duration: 1.4,
              ease:     'power2.out',
              onUpdate:   () => { el.textContent = format(stat, counter.v) },
              // Belt and braces: whatever the easing leaves behind, the final
              // text is the exact figure, not a rounding artefact.
              onComplete: () => { el.textContent = format(stat, stat.num) },
            })
          })
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      aria-label="Métricas clave"
      className="border-y border-paper/8 bg-ink overflow-hidden"
    >
      <div className="flex divide-x divide-paper/8 max-md:flex-wrap">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-1 px-6 py-5 flex-1 min-w-[140px] max-md:border-b max-md:border-paper/8"
          >
            <span
              ref={el => { valueRefs.current[i] = el }}
              className="font-display font-semibold text-paper leading-none tracking-[-0.03em] tabular-nums"
              style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)' }}
            >
              {format(stat, stat.num)}
            </span>
            <span className="font-mono text-paper/60 uppercase tracking-[0.18em] text-center leading-snug"
              style={{ fontSize: 'clamp(7px, 0.65vw, 9px)' }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
