'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { markIntroDone } from '@/lib/intro'

/**
 * First-load curtain: four words, one at a time, then it lifts.
 *
 * Three rules keep this from becoming the thing that breaks the site:
 *
 * 1. The markup ships in the server HTML and an inline script in <body> decides
 *    before paint whether to skip it. Mounting the overlay after hydration
 *    would show the hero for a beat and then cover it, which is worse than no
 *    curtain at all.
 * 2. A CSS failsafe clears it at 4s with no JS involved. If this component
 *    throws, fails to hydrate, or GSAP never loads, the visitor waits four
 *    seconds — not forever. Everything below is timed to finish well inside
 *    that budget.
 * 3. It resolves the intro promise on every exit path, including the error
 *    path and the skip button, so the hero animation is never left waiting for
 *    a signal that isn't coming.
 *
 * It waits on `document.fonts.ready` rather than `window.load`: the words are
 * the whole screen, so the failure worth hiding is the type swapping mid-word,
 * not an image still streaming in below the fold.
 *
 * The skip control is a real button, and the one thing on this screen that is
 * not hidden from assistive tech. Nobody should be held behind an animation
 * they did not ask for.
 */

/** What the studio does, in the order it happens. The name lands last. */
const WORDS = ['DISEÑO', 'PRODUCTO', 'AUTOMATIZACIÓN', 'NEXXO']

export function Preloader() {
  const rootRef  = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])

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
    let done = false

    const finish = () => {
      if (done) return
      done = true
      document.body.style.overflow = ''
      root.style.display = 'none'
      try { sessionStorage.setItem('nexxo:intro', '1') } catch { /* private mode */ }
      markIntroDone()
    }

    // Exposed on the element so the button's handler cannot drift out of sync
    // with the timeline this effect owns.
    const skip = () => { tl?.kill(); finish() }
    root.addEventListener('nexxo:skip', skip)

    try {
      const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[]

      tl = gsap.timeline({ onComplete: finish })

      words.forEach((word, i) => {
        // Each word rises in, holds, and leaves upward — so the sequence reads
        // as one movement rather than four separate fades.
        tl!.fromTo(word,
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.32, ease: 'power3.out' },
          i * 0.46)

        if (i < words.length - 1) {
          tl!.to(word, { yPercent: -40, opacity: 0, duration: 0.28, ease: 'power3.in' }, i * 0.46 + 0.34)
        }
      })

      // Hold the curtain until the fonts have landed, but never past 2.4s — a
      // slow network must not trap anyone behind a loading screen.
      const fonts = document.fonts?.ready ?? Promise.resolve()
      const gate  = Promise.race([
        Promise.all([fonts, new Promise(resolve => setTimeout(resolve, WORDS.length * 460))]),
        new Promise(resolve => setTimeout(resolve, 2400)),
      ])

      gate.then(() => {
        tl?.to(root, { yPercent: -100, duration: 0.75, ease: 'power4.inOut' })
      })
    } catch {
      finish()
    }

    return () => {
      root.removeEventListener('nexxo:skip', skip)
      tl?.kill()
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div ref={rootRef} className="intro">
      {/* The words occupy one cell of a grid, stacked, so each one is centred
          on the same spot without absolute positioning doing the measuring. */}
      <div aria-hidden className="grid place-items-center px-6">
        {WORDS.map((word, i) => (
          <span
            key={word}
            ref={node => { wordsRef.current[i] = node }}
            // The first word ships visible. The rest start hidden and are
            // revealed by the timeline — but if GSAP never runs, a curtain
            // showing one word for four seconds is a pause; a curtain showing
            // nothing is a broken site.
            className={`col-start-1 row-start-1 whitespace-nowrap text-center font-display font-semibold uppercase leading-none tracking-[-0.04em] text-paper ${i === 0 ? '' : 'opacity-0'}`}
            style={{ fontSize: 'clamp(2rem, 9vw, 7rem)' }}
          >
            {word}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => rootRef.current?.dispatchEvent(new CustomEvent('nexxo:skip'))}
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 border-b border-paper/30 pb-1
                   font-mono text-[10px] uppercase tracking-[0.24em] text-paper/60
                   transition-colors duration-200 hover:border-paper hover:text-paper
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                   focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        Saltar intro
      </button>
    </div>
  )
}
