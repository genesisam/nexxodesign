'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from '@/components/motion/SmoothScrollProvider'
import type { Chapter } from '@/lib/chapters'

/**
 * A floating bar that says where in a case study you are.
 *
 * A project page is long — the longest runs sixteen thousand pixels — and
 * until now the only way to know how much was left was to keep scrolling.
 * This names the chapter you are in, marks how far through you are, and lets
 * you jump.
 *
 * Two things it deliberately does not do: it does not hide the page's own
 * content behind it (the page gets bottom padding instead), and it never
 * becomes the only way to reach a chapter — every chapter is a real heading
 * with a real id, so the links work with JS off and can be shared.
 */
export function ChapterNav({
  chapters, visitLabel, liveUrl, scrollerSelector,
}: {
  chapters:   Chapter[]
  visitLabel: string
  liveUrl?:   string | null
  /**
   * What is actually scrolling. The page scrolls the window; the modal scrolls
   * a box inside it. Without this the bar would read the window's position
   * while the reader moved through a container that never moved it, and the
   * active chapter would never change.
   */
  scrollerSelector?: string
}) {
  const [active,   setActive]   = useState(chapters[0]?.id ?? '')
  const [progress, setProgress] = useState(0)
  const [shown,    setShown]    = useState(false)

  const listRef = useRef<HTMLUListElement>(null)
  const lenis   = useLenis()

  /**
   * Which chapter is being read, and how far down the page we are.
   *
   * The reading line sits a third of the way down the viewport rather than at
   * the very top: a heading is "current" from the moment it is comfortably on
   * screen, not the instant its first pixel crosses the top edge.
   */
  const measure = useCallback(() => {
    const box = scrollerSelector
      ? document.querySelector<HTMLElement>(scrollerSelector)
      : null

    const scrolled   = box ? box.scrollTop    : window.scrollY
    const viewport   = box ? box.clientHeight : window.innerHeight
    const scrollable = box
      ? box.scrollHeight - box.clientHeight
      : document.documentElement.scrollHeight - window.innerHeight

    // Where a chapter sits inside whatever is scrolling.
    const offsetOf = (el: HTMLElement) =>
      box
        ? el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop
        : el.getBoundingClientRect().top + window.scrollY

    const line = scrolled + viewport * 0.33

    let current = chapters[0]?.id ?? ''
    for (const chapter of chapters) {
      const el = document.getElementById(chapter.id)
      if (!el) continue
      if (offsetOf(el) <= line) current = chapter.id
    }
    setActive(current)

    setProgress(scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0)

    // Out of the way at the very top, where the title is doing the work.
    setShown(scrolled > viewport * 0.6)
  }, [chapters, scrollerSelector])

  // Lenis swallows the native scroll event, so the page's scroll position has
  // to be read from Lenis itself. A `window.addEventListener('scroll')` here
  // would simply never fire.
  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)

    const box = scrollerSelector
      ? document.querySelector<HTMLElement>(scrollerSelector)
      : null

    // A box scrolls natively; Lenis is not driving it.
    if (box) {
      box.addEventListener('scroll', measure, { passive: true })
      return () => {
        box.removeEventListener('scroll', measure)
        window.removeEventListener('resize', measure)
      }
    }

    if (lenis) {
      lenis.on('scroll', measure)
      return () => {
        lenis.off('scroll', measure)
        window.removeEventListener('resize', measure)
      }
    }

    // Lenis may not have mounted yet, and on a reduced-motion machine it never
    // will. Either way the bar still has to work.
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [lenis, measure, scrollerSelector])

  /** Keep the active chapter in view in a bar that scrolls sideways. */
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const item = list.querySelector<HTMLElement>(`[data-for="${CSS.escape(active)}"]`)
    if (!item) return

    const target = item.offsetLeft - list.clientWidth / 2 + item.clientWidth / 2
    list.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [active])

  const jump = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return // Let the browser follow the href; it knows what to do.

    event.preventDefault()

    const box = scrollerSelector
      ? document.querySelector<HTMLElement>(scrollerSelector)
      : null

    if (box) {
      const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 24
      box.scrollTo({ top, behavior: 'smooth' })
      return // No hash: the modal's URL belongs to the project, not a chapter.
    }

    const top = el.getBoundingClientRect().top + window.scrollY - 80
    if (lenis) lenis.scrollTo(top)
    else window.scrollTo({ top, behavior: 'smooth' })

    // The URL should still name the chapter, so it can be copied — but
    // without the jump a plain hash change would cause.
    history.replaceState(null, '', `#${id}`)
  }, [lenis, scrollerSelector])

  if (chapters.length < 2) return null

  return (
    <nav
      aria-label="Secciones del proyecto"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-4 md:pb-6"
    >
      <div className="gutter-x flex justify-center">
        <div
          className={`pointer-events-auto relative flex max-w-full items-stretch overflow-hidden rounded-full
                      border border-paper/12 bg-ink/85 backdrop-blur-xl transition-all duration-500
                      ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
          // Hidden from the pointer as well when it is out, so an invisible
          // bar cannot swallow a click meant for the page.
          style={{ visibility: shown ? 'visible' : 'hidden' }}
        >
          {/* How far down the page you are, drawn along the top edge. */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-paper/10">
            <div
              className="h-full bg-accent transition-[width] duration-150 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <ul
            ref={listRef}
            className="flex items-center gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {chapters.map(chapter => {
              const isActive = chapter.id === active
              return (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    data-for={chapter.id}
                    onClick={event => jump(event, chapter.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`block whitespace-nowrap rounded-full px-4 py-2 font-mono text-[9px]
                                uppercase tracking-[0.18em] transition-colors duration-200
                                ${isActive
                                  ? 'bg-paper text-ink'
                                  : 'text-paper/55 hover:text-paper'}`}
                  >
                    {chapter.label}
                  </a>
                </li>
              )
            })}
          </ul>

          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="my-2 mr-2 hidden shrink-0 items-center whitespace-nowrap rounded-full bg-accent
                         px-5 font-mono text-[9px] uppercase tracking-[0.18em] text-paper
                         transition-colors duration-200 hover:bg-accent/85 sm:flex"
            >
              {visitLabel}
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
