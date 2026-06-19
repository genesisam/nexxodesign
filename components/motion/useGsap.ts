'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type GsapCallback = (
  context: gsap.Context,
  scrollTrigger: typeof ScrollTrigger,
) => void

/**
 * Runs a GSAP context scoped to a container ref.
 * Cleans up animations and ScrollTriggers on unmount.
 * Use this in every section component that has scroll-driven animation.
 */
export function useGsap(callback: GsapCallback, deps: unknown[] = []) {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      callback(ctx, ScrollTrigger)
    }, containerRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return containerRef
}
