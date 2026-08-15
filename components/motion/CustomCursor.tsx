'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * Custom cursor, built to fail safe.
 *
 * Everything that usually breaks one of these is handled explicitly:
 *
 * - The native cursor is hidden by a `data-cursor="on"` attribute this
 *   component sets *after* it has mounted and confirmed a fine pointer. If the
 *   script never runs, throws, or is blocked, the attribute is absent and the
 *   real cursor stays. Hiding it from a stylesheet is how sites end up with no
 *   cursor at all.
 * - Position is written straight to the element through gsap.quickTo. Routing
 *   pointer coordinates through React state re-renders the tree on every mouse
 *   move and is the usual cause of a laggy dot.
 * - Touch and coarse pointers never mount it, so no phone gets a dot frozen in
 *   a corner. The media query is watched, not just read once, because hybrid
 *   laptops switch modes mid-session.
 * - Leaving the window fades it out and coming back fades it in, so it doesn't
 *   sit stranded at the last known position.
 * - `pointer-events: none` on both layers: the cursor must never eat a click.
 * - The Studio is excluded — a CMS is a tool, and tools keep their I-beam.
 */
export function CustomCursor() {
  useEffect(() => {
    if (window.location.pathname.startsWith('/studio')) return

    const fine   = window.matchMedia('(pointer: fine)')
    const still  = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root   = document.documentElement

    let dot:  HTMLDivElement | null = null
    let ring: HTMLDivElement | null = null
    let cleanupPointer: (() => void) | null = null

    const teardown = () => {
      cleanupPointer?.()
      cleanupPointer = null
      dot?.remove(); ring?.remove()
      dot = null; ring = null
      delete root.dataset.cursor
    }

    const build = () => {
      if (dot) return

      dot  = document.createElement('div')
      ring = document.createElement('div')
      dot.className  = 'cursor-dot'
      ring.className = 'cursor-ring'
      dot.setAttribute('aria-hidden', 'true')
      ring.setAttribute('aria-hidden', 'true')
      document.body.append(dot, ring)

      // The ring trails; the dot is exact. Reduced motion removes the lag
      // rather than the cursor — the lag is the part that reads as motion.
      const speed = still.matches ? 0.001 : 0.16
      const dx = gsap.quickTo(dot,  'x', { duration: 0.001, ease: 'none' })
      const dy = gsap.quickTo(dot,  'y', { duration: 0.001, ease: 'none' })
      const rx = gsap.quickTo(ring, 'x', { duration: speed, ease: 'power3.out' })
      const ry = gsap.quickTo(ring, 'y', { duration: speed, ease: 'power3.out' })

      let seen = false
      const onMove = (e: PointerEvent) => {
        if (!seen) {
          seen = true
          gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 })
        }
        dx(e.clientX); dy(e.clientY)
        rx(e.clientX); ry(e.clientY)
      }

      // Delegated once, not recomputed on every move: asking `closest()` at
      // pointer-move rate is what makes these feel heavy on long pages.
      const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor-hover]'
      const onOver = (e: Event) => {
        const hit = (e.target as Element)?.closest?.(INTERACTIVE)
        gsap.to(ring, { scale: hit ? 1.9 : 1, duration: 0.28, ease: 'power3.out' })
        gsap.to(dot,  { scale: hit ? 0 : 1,   duration: 0.28, ease: 'power3.out' })
      }

      const onLeave = () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 })
      const onEnter = () => gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 })
      const onDown  = () => gsap.to(ring, { scale: 0.8, duration: 0.18 })
      const onUp    = () => gsap.to(ring, { scale: 1,   duration: 0.18 })

      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerover', onOver, { passive: true })
      document.addEventListener('pointerleave', onLeave)
      document.addEventListener('pointerenter', onEnter)
      window.addEventListener('pointerdown', onDown, { passive: true })
      window.addEventListener('pointerup', onUp, { passive: true })
      window.addEventListener('blur', onLeave)

      root.dataset.cursor = 'on'

      cleanupPointer = () => {
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerover', onOver)
        document.removeEventListener('pointerleave', onLeave)
        document.removeEventListener('pointerenter', onEnter)
        window.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('blur', onLeave)
        gsap.killTweensOf([dot, ring])
      }
    }

    const sync = () => (fine.matches ? build() : teardown())

    sync()
    fine.addEventListener('change', sync)

    return () => {
      fine.removeEventListener('change', sync)
      teardown()
    }
  }, [])

  return null
}
