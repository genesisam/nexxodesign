'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Every section of every page settles into place as it comes into view.
 *
 * It is mounted once in the site layout and finds the sections itself rather
 * than asking each page to wrap its own. Twelve pages wrapping their sections
 * by hand would be twelve chances to forget one, and a wrapper element around
 * a section changes the DOM a page's own layout may depend on. This touches
 * nothing but transform and opacity.
 *
 * ScrollTrigger is already synced to Lenis in SmoothScrollProvider, so these
 * fire against the smoothed scroll position rather than the native one.
 */

/** Travel distance. Small on purpose — this should read as settling, not sliding. */
const RISE = 22

export function RevealSections() {
  // Re-runs per route: the next page has its own sections, and the triggers
  // built for the last one are gone with it.
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx   = gsap.context(() => {})
    const stops: (() => void)[] = []
    const seen  = new WeakSet<HTMLElement>()

    /** Hide a section and give it an entrance. */
    const reveal = (section: HTMLElement) => ctx.add(() => {
      gsap.set(section, { y: RISE, opacity: 0 })

      /** The finished state, reachable from the tween or from the watchdog. */
      const settle = () => {
        // Back to no transform at all. A lingering `translate(0px, 0px)` is
        // still a containing block, which would quietly break any sticky or
        // fixed child the section happens to hold.
        gsap.set(section, { opacity: 1, clearProps: 'transform' })
      }

      const tween = gsap.to(section, {
        y:          0,
        opacity:    1,
        duration:   0.8,
        ease:       'power3.out',
        onComplete: settle,
        scrollTrigger: {
          trigger: section,
          // Just below the fold: the movement is over by the time the section
          // is comfortably in view, so nothing reads as late.
          start: 'top 88%',
          once:  true,
        },
      })

      /**
       * The watchdog, and the reason it exists.
       *
       * The hidden state is applied the moment a section is found, and only
       * ScrollTrigger undoes it. If it never fires — a refresh that lands
       * wrong, a measurement taken before the fonts settle, a throttled rAF in
       * a background tab — the section stays invisible and takes the page's
       * content with it. So once a section is genuinely on screen it gets a
       * second and a half to animate itself in; after that, whatever happened,
       * it is shown.
       *
       * A fifth of the section, not a sliver: the trigger only fires at
       * `top 88%`, and a 1px threshold would start the clock before the
       * animation was ever due.
       */
      let timer = 0

      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        timer = window.setTimeout(() => {
          if (tween.progress() === 0) {
            tween.kill()
            settle()
          }
        }, 1500)
        io.disconnect()
      }, { threshold: 0.2 })

      io.observe(section)
      stops.push(() => { io.disconnect(); window.clearTimeout(timer) })
    })

    /**
     * Sections are looked up fresh every time, never captured.
     *
     * Two things make a single pass at mount wrong, and this failed both ways
     * before it worked. The sections are not all there yet — the work section
     * is an async server component that streams in after hydration, so a mount
     * pass found three on a home that ends up with four. And React replaces
     * the whole `<main>` once hydration settles, which left the first version
     * holding a detached element: it dutifully hid two nodes that were no
     * longer in the document, so nothing animated and nothing looked broken
     * either, which is the hardest kind of failure to spot.
     *
     * So: `<main>` is read on every pass, and the observer watches `body`,
     * which is the only node here that outlives a render.
     */
    const collect = () => {
      const main = document.querySelector('main')
      if (!main) return

      const all = Array.from(main.querySelectorAll('section')) as HTMLElement[]

      const roots = all.filter(section =>
        // A section inside another section is part of its parent's entrance,
        // not an entrance of its own.
        !all.some(other => other !== section && other.contains(section)) &&
        // An escape hatch for anything that cannot be moved — a pinned block,
        // a section built around a sticky child.
        !section.closest('[data-no-reveal]'),
      )

      let added = false

      roots.forEach((section, i) => {
        if (seen.has(section)) return
        seen.add(section)

        // The section the page opens on is the hero or the page header: it is
        // on screen before anyone scrolls and usually has an entrance of its
        // own. Hiding it would be a flash, not a reveal.
        if (i === 0) return

        reveal(section)
        added = true
      })

      // New blocks mean every trigger below them now starts somewhere else.
      if (added) ScrollTrigger.refresh()
    }

    collect()

    const mo = new MutationObserver(collect)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      stops.forEach(stop => stop())
      ctx.revert()
    }
  }, [pathname])

  return null
}
