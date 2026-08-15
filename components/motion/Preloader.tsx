'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { NexxoLogo } from '@/components/ui/NexxoLogo'
import { markIntroDone } from '@/lib/intro'

/**
 * First-load curtain.
 *
 * Three rules keep this from becoming the thing that breaks the site:
 *
 * 1. The markup ships in the server HTML and an inline script in <body> decides
 *    before paint whether to skip it. Mounting the overlay after hydration
 *    would show the hero for a beat and then cover it, which is worse than no
 *    curtain at all.
 * 2. A CSS failsafe clears it at 4s with no JS involved. If this component
 *    throws, fails to hydrate, or GSAP never loads, the visitor waits four
 *    seconds — not forever.
 * 3. It resolves the intro promise on every exit path, including the error
 *    path, so the hero animation is never left waiting for a signal that
 *    isn't coming.
 *
 * It waits on `document.fonts.ready` rather than `window.load`: the identity
 * here is typographic, so the failure worth hiding is the headline swapping
 * fonts mid-reveal, not an image still streaming in below the fold.
 */
export function Preloader() {
  const rootRef    = useRef<HTMLDivElement>(null)
  const markRef    = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) { markIntroDone(); return }

    // The inline script already decided. Honour it and get out of the way.
    if (document.documentElement.dataset.intro === 'skip') {
      root.style.display = 'none'
      markIntroDone()
      return
    }

    document.body.style.overflow = 'hidden'

    let tl: gsap.core.Timeline | undefined

    const finish = () => {
      document.body.style.overflow = ''
      if (root) root.style.display = 'none'
      try { sessionStorage.setItem('nexxo:intro', '1') } catch { /* private mode */ }
      markIntroDone()
    }

    try {
      const counter = { v: 0 }

      tl = gsap.timeline({ onComplete: finish })

      // Filled paths can't be stroke-drawn, so the mark wipes up behind a
      // clip instead — same reveal, honest to the asset.
      tl.fromTo(markRef.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 1 },
        { clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'power3.inOut' })
        .to(counter, {
          v:        100,
          duration: 0.9,
          ease:     'power2.out',
          onUpdate: () => {
            if (counterRef.current)
              counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
          },
        }, 0)

      // Hold the curtain until the fonts have landed, but never past 2.5s —
      // a slow network must not trap anyone behind a loading screen.
      const fonts = document.fonts?.ready ?? Promise.resolve()
      const gate  = Promise.race([
        Promise.all([fonts, new Promise(r => setTimeout(r, 900))]),
        new Promise(r => setTimeout(r, 2500)),
      ])

      gate.then(() => {
        tl?.to(root, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' })
      })
    } catch {
      finish()
    }

    return () => {
      tl?.kill()
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div ref={rootRef} className="intro" aria-hidden>
      <div ref={markRef} className="intro-mark">
        <NexxoLogo markOnly className="h-full w-auto text-paper" />
      </div>

      <span ref={counterRef} className="intro-count">000</span>
    </div>
  )
}
