'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    setActive(true)
  }, [])

  useEffect(() => {
    if (!active) return
    const dot   = dotRef.current
    const ring  = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.body.classList.add('cursor-none')

    let px = -100, py = -100
    let rx = -100, ry = -100
    let showingLabel = false

    // Center both elements around the cursor point
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

    const tick = () => {
      gsap.set(dot,  { x: px, y: py })
      rx += (px - rx) * 0.11
      ry += (py - ry) * 0.11
      gsap.set(ring, { x: rx, y: ry })
    }
    gsap.ticker.add(tick)

    const onMove = (e: MouseEvent) => { px = e.clientX; py = e.clientY }
    window.addEventListener('pointermove', onMove)

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const isProject     = !!t.closest('[data-cursor="project"]')
      const isInteractive = !!t.closest('a, button, [role="button"]')

      if (isProject && !showingLabel) {
        showingLabel = true
        gsap.to(ring,  { scale: 2.8, duration: 0.4, ease: 'power3.out' })
        gsap.to(label, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot,   { opacity: 0, duration: 0.2 })
      } else if (isInteractive && !showingLabel) {
        gsap.to(ring, { scale: 1.7, duration: 0.35, ease: 'power2.out' })
      }
    }

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const isProject     = !!t.closest('[data-cursor="project"]')
      const isInteractive = !!t.closest('a, button, [role="button"]')

      if (isProject && showingLabel) {
        showingLabel = false
        gsap.to(ring,  { scale: 1, duration: 0.4, ease: 'power3.out' })
        gsap.to(label, { opacity: 0, duration: 0.2 })
        gsap.to(dot,   { opacity: 1, duration: 0.2 })
      } else if (isInteractive && !showingLabel) {
        gsap.to(ring, { scale: 1, duration: 0.35, ease: 'power2.out' })
      }
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)

    return () => {
      document.body.classList.remove('cursor-none')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
      gsap.ticker.remove(tick)
    }
  }, [active])

  if (!active) return null

  return (
    <>
      {/* Dot — sharp, snaps to cursor */}
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{ mixBlendMode: 'difference' }}
      >
        <div className="w-2 h-2 rounded-full bg-paper" />
      </div>

      {/* Ring — lags behind for visual interest */}
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{ mixBlendMode: 'difference' }}
      >
        <div className="w-10 h-10 rounded-full border border-paper/70 flex items-center justify-center origin-center">
          <span
            ref={labelRef}
            className="font-mono text-[7px] uppercase tracking-[0.22em] text-paper opacity-0 select-none whitespace-nowrap"
          >
            Ver →
          </span>
        </div>
      </div>
    </>
  )
}
