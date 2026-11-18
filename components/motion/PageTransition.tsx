'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { spring, MOTION } from '@/lib/spring'

/**
 * Curtain between pages, in brick columns.
 *
 * On an internal link click the columns close from the height of the click,
 * each one a beat after its neighbour nearer the pointer, so the cover spreads
 * out from where you clicked. Only then does the route change; once the new
 * pathname has committed they open upward in the same order.
 *
 * A link with `data-tone` (the rows on /proyectos) paints the columns in its
 * project's colour; everything else uses the Nexxo purple.
 *
 * The click is taken in the capture phase with `preventDefault()` only — not
 * `stopPropagation()` — so React handlers on the link still run (a menu still
 * closes) while next/link, which skips prevented clicks, leaves the navigation
 * to us. Opt a link out with `data-no-transition`.
 */

const COLS = 8          // gutter + 6 + gutter on desktop
const STAGGER = 0.04
const SAFETY_MS = 4000

export function PageTransition() {
  const router   = useRouter()
  const pathname = usePathname()
  const root     = useRef<HTMLDivElement>(null)
  const state    = useRef<{ busy: boolean; waiting: boolean; origin: number; timer?: ReturnType<typeof setTimeout> }>({
    busy: false, waiting: false, origin: 0,
  })

  const columns = () => {
    const el = root.current
    if (!el) return []
    return [...el.children].filter(c => (c as HTMLElement).offsetParent !== null) as HTMLElement[]
  }

  const open = () => {
    const s = state.current
    clearTimeout(s.timer)
    s.waiting = false
    const cols = columns()
    const page = spring(MOTION.page)
    const h = window.innerHeight
    gsap.killTweensOf(cols)
    Promise.all(cols.map((c, i) => gsap.to(c, {
      clipPath: `inset(0px 0px ${h}px 0px)`,
      delay: Math.abs(i - s.origin) * STAGGER,
      duration: page.duration,
      ease: page.ease,
    }).then())).then(() => {
      if (root.current) root.current.style.visibility = 'hidden'
      s.busy = false
    })
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || !a.href) return
      if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return
      const raw = a.getAttribute('href') ?? ''
      if (!raw || raw.startsWith('#') || /^(mailto|tel|javascript):/i.test(raw)) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      if (/^\/(studio|api|_next)(\/|$)/.test(url.pathname)) return
      if (url.pathname === location.pathname) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const s = state.current
      e.preventDefault()
      if (s.busy) return
      s.busy = true

      const el = root.current
      const cols = columns()
      if (!el || !cols.length) { router.push(url.pathname + url.search + url.hash); s.busy = false; return }

      el.style.setProperty('--pt-tone', a.dataset.tone || 'rgb(var(--color-accent-rgb))')
      el.style.visibility = 'visible'

      const x = e.clientX, y = e.clientY, h = window.innerHeight
      const at = cols.findIndex(c => { const r = c.getBoundingClientRect(); return x >= r.left && x < r.right })
      s.origin = at < 0 ? Math.floor(cols.length / 2) : at

      const page = spring(MOTION.page)
      gsap.killTweensOf(cols)
      gsap.set(cols, { clipPath: `inset(${y}px 0px ${h - y}px 0px)` })
      Promise.all(cols.map((c, i) => gsap.to(c, {
        clipPath: 'inset(0px 0px 0px 0px)',
        delay: Math.abs(i - s.origin) * STAGGER,
        duration: page.duration,
        ease: page.ease,
      }).then())).then(() => {
        s.waiting = true
        router.push(url.pathname + url.search + url.hash)
        // Never leave the site covered if the route never commits.
        s.timer = setTimeout(open, SAFETY_MS)
      })
    }

    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [router])

  useEffect(() => {
    if (!state.current.waiting) return
    // Give the incoming page a frame to paint before lifting the cover.
    const id = requestAnimationFrame(() => requestAnimationFrame(open))
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <div ref={root} aria-hidden className="pt-cols">
      {Array.from({ length: COLS }, (_, i) => <i key={i} />)}
    </div>
  )
}
