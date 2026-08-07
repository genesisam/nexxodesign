'use client'

// §5.2 Confían en Nexxo
// GSAP ticker → marquee siempre en movimiento.
// window 'wheel' → ambas direcciones de scroll aceleran la pista.
// No depende de ScrollTrigger.getVelocity (no disponible en esta versión de GSAP).

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const LOGOS = [
  {
    name: 'Kapital',
    mark: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="5" y1="3" x2="5" y2="17" /><line x1="5" y1="10" x2="14" y2="3" /><line x1="5" y1="10" x2="14" y2="17" />
      </svg>
    ),
  },
  {
    name: 'Astra',
    mark: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="10" y1="3" x2="10" y2="17" /><line x1="3" y1="10" x2="17" y2="10" />
        <line x1="5.5" y1="5.5" x2="14.5" y2="14.5" /><line x1="14.5" y1="5.5" x2="5.5" y2="14.5" />
      </svg>
    ),
  },
  {
    name: 'Nodo',
    mark: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="7" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
  },
  {
    name: 'Ciclo',
    mark: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 10a7 7 0 1 1-3.5-6.06" /><polyline points="13.5,1 13.5,4.5 17,4.5" />
      </svg>
    ),
  },
  {
    name: 'Forma',
    mark: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M3 3h9l5 5v9H3z" /><path d="M12 3v5h5" />
      </svg>
    ),
  },
  {
    name: 'Klave',
    mark: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M10 2l7 4v8l-7 4-7-4V6z" />
      </svg>
    ),
  },
  {
    name: 'Vivid',
    mark: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="10" cy="10" rx="8" ry="5" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
  },
  {
    name: 'Merge',
    mark: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="7.5" cy="10" r="5.5" /><circle cx="12.5" cy="10" r="5.5" />
      </svg>
    ),
  },
]

// 16 logos = 2 sets idénticos → loop seamless
const TRACK = [...LOGOS, ...LOGOS]

export function ClientLogos() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const track = trackRef.current
    if (!track) return

    // Ancho exacto de un set: distancia del inicio de la card 0 al inicio de la card 8
    const card0 = track.children[0]            as HTMLElement
    const card8 = track.children[LOGOS.length] as HTMLElement
    const singleSetWidth = card8.offsetLeft - card0.offsetLeft

    let x          = 0
    let speedBoost = 0
    const BASE     = -1.5 // px / frame @ 60 fps ≈ 90 px/s, loop cada ~16 s

    // Wheel en cualquier dirección → acelera el marquee temporalmente
    const onWheel = (e: WheelEvent) => {
      // deltaMode 0 = px, 1 = líneas, 2 = páginas
      const raw   = e.deltaMode === 0 ? e.deltaY : e.deltaY * 40
      speedBoost  = Math.max(speedBoost - Math.abs(raw) * 0.05, BASE * 5)
    }

    const tick = () => {
      speedBoost *= 0.93          // decae suavemente de vuelta a 0
      x += BASE + speedBoost
      if (x <= -singleSetWidth) x += singleSetWidth   // salto seamless
      gsap.set(track, { x, force3D: true })
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('wheel', onWheel)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Clientes que confían en Nexxo"
      className="border-t border-line overflow-hidden py-10 md:py-14"
    >
      {/* Label */}
      <div className="px-6 md:px-16 lg:px-24 mb-6 flex items-center justify-between">
        <span className="font-mono text-smoke/50 text-[10px] uppercase tracking-[0.25em]">
          Confían en Nexxo
        </span>
        <span className="hidden md:inline font-mono text-smoke/20 text-[9px] uppercase tracking-[0.2em] border border-smoke/15 px-3 py-1.5">
          {LOGOS.length} clientes
        </span>
      </div>

      {/* ── Pista edge-to-edge ──────────────────────────────────────────────
           Sin padding → cards arrancan desde el borde izquierdo del viewport.
           overflow-hidden en <section> corta ambos extremos.
           will-change-transform → GPU layer, sin jank.
           ─────────────────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        className="flex gap-4 w-max will-change-transform"
      >
        {TRACK.map((logo, i) => (
          <div
            key={i}
            aria-hidden={i >= LOGOS.length}
            className="
              w-[180px] h-[160px] md:h-[180px] shrink-0
              border border-white/[0.05] bg-[#131313]
              flex flex-col items-center justify-center gap-3
              group cursor-default
            "
          >
            <span className="w-11 h-11 text-smoke/35 transition-colors duration-300 group-hover:text-smoke/65">
              {logo.mark}
            </span>
            <span className="font-mono text-[9px] text-smoke/25 uppercase tracking-[0.22em] transition-colors duration-300 group-hover:text-smoke/50">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
