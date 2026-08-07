'use client'

/**
 * <ImageDisplace> — cubo-grid hover effect sobre imagen
 *
 * Renderiza la imagen como textura sobre un plano subdividido (64×64 segmentos)
 * con ShaderMaterial custom. El vertex shader desplaza Z por celdas según la
 * distancia al cursor (3 niveles discretos = aspecto de cubos). El fragment
 * shader hace UV-snap a la grilla y añade sombra en borde inferior de cada
 * cubo desplazado.
 *
 * Performance:
 *  - frameloop="demand": RAF solo corre cuando hay movimiento o hover animando
 *  - Canvas montado una vez que el elemento entra en viewport (no se desmonta)
 *  - Mobile / prefers-reduced-motion: solo <img> estático, sin WebGL
 *
 * Fallback accesible: <img> siempre en el DOM bajo el canvas.
 */

import { useRef, useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'

export type ImageDisplaceProps = {
  src: string
  alt: string
  /** Número de celdas-cubo por eje (default 32) */
  cells?: number
  /** Radio de influencia del cursor en UV-space (default 0.28) */
  radius?: number
  /** Extrusión máxima en Z, en unidades Three.js (default 0.12) */
  strength?: number
  className?: string
}

// Carga dinámica — sin SSR para evitar acceso a APIs del navegador en servidor
const DisplaceCanvas = dynamic(
  () => import('./ImageDisplaceInner'),
  { ssr: false }
)

export function ImageDisplace({
  src,
  alt,
  cells    = 32,
  radius   = 0.28,
  strength = 0.12,
  className = '',
}: ImageDisplaceProps) {
  const wrapRef    = useRef<HTMLDivElement>(null)
  // Refs compartidos con la escena R3F (sin re-renders por cambios de mouse)
  const mouseRef   = useRef({ x: 0.5, y: 0.5 })
  const hoveredRef = useRef(false)
  // La escena actualiza esto con la función invalidate() de R3F
  const invalidRef = useRef<() => void>(() => {})

  const [skip,       setSkip]       = useState(true)  // true en SSR/mobile/reduced-motion
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const [mounted,    setMounted]    = useState(false)

  // ── Verificaciones de cliente ──────────────────────────────────────────
  useEffect(() => {
    const mobile  = window.matchMedia('(max-width: 767px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!mobile && !reduced) setSkip(false)
    setMounted(true)
  }, [])

  // ── Montar canvas al entrar en viewport, no desmontar después ─────────
  useEffect(() => {
    if (skip || !wrapRef.current) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHasBeenVisible(true); io.disconnect() } },
      { rootMargin: '80px' }
    )
    io.observe(wrapRef.current)
    return () => io.disconnect()
  }, [skip])

  // ── Mouse tracking (refs = sin re-render) ──────────────────────────────
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = wrapRef.current!.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top)  / r.height,
    }
    invalidRef.current()
  }
  const handleEnter = () => { hoveredRef.current = true;  invalidRef.current() }
  const handleLeave = () => { hoveredRef.current = false; invalidRef.current() }

  const showGL = mounted && !skip && hasBeenVisible

  return (
    <div
      ref={wrapRef}
      className={`relative w-full h-full ${className}`}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── Fallback accesible — siempre en DOM ───────────────────────── */}
      {/* Visible en mobile/reduced-motion; oculto visualmente cuando WebGL activo */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          showGL ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden={showGL || undefined}
      />

      {/* ── WebGL canvas — solo desktop, solo cuando ha entrado en viewport ── */}
      {showGL && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <Suspense fallback={null}>
            <DisplaceCanvas
              src={src}
              mouseRef={mouseRef}
              hoveredRef={hoveredRef}
              invalidRef={invalidRef}
              cells={cells}
              radius={radius}
              strength={strength}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}
