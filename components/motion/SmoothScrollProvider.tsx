'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Register GSAP plugins once — client-only guard prevents SSR errors
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

const LenisContext = createContext<Lenis | null>(null)

// useLenis() returns the Lenis instance once it's initialized, null before that.
// Components that depend on Lenis (e.g. GSAP ScrollTrigger) should check for null.
export function useLenis() {
  return useContext(LenisContext)
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion — static fallback per §3
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
    })

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    instance.on('scroll', ScrollTrigger.update)

    // Drive Lenis via GSAP ticker so both share the same RAF loop
    const onTick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Expose instance via context — triggers re-render in consumers (e.g. Testimonios)
    // so they can set up ScrollTrigger animations only after Lenis is ready.
    setLenis(instance)

    return () => {
      gsap.ticker.remove(onTick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
