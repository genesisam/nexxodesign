'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Props = {
  children:   React.ReactNode
  className?: string
  /** Reveal each direct child in sequence instead of the block as a whole. */
  stagger?:   boolean
  /** Travel distance in px. Small on purpose — this reads as settling, not sliding. */
  y?:         number
  delay?:     number
}

/**
 * Fades a block in as it enters the viewport.
 *
 * The hidden state is applied from JS, never from CSS: if this component ever
 * fails to run — no JS, an exception, a plugin that didn't register — the
 * content stays visible instead of disappearing. Nothing here is allowed to
 * cost the page its text.
 *
 * ScrollTrigger is already synced to Lenis in SmoothScrollProvider, so these
 * fire against the smoothed scroll position rather than the native one.
 */
export function ScrollReveal({ children, className, stagger = false, y = 24, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets: Element[] = stagger ? Array.from(el.children) : [el]
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.set(targets, { y, opacity: 0 })

      gsap.to(targets, {
        y:        0,
        opacity:  1,
        duration: 0.8,
        delay,
        ease:     'power3.out',
        stagger:  stagger ? 0.09 : 0,
        scrollTrigger: {
          trigger: el,
          // 88% keeps the reveal just below the fold: it has finished by the
          // time the block is comfortably in view, so nothing reads as late.
          start: 'top 88%',
          once:  true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [stagger, y, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
