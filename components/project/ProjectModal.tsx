'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLenis } from '@/components/motion/SmoothScrollProvider'

/**
 * The shell a case study opens in when you click it from the index.
 *
 * It is a real route, not a client-side trick: the URL becomes the project's
 * own, so the address bar, a copied link, a refresh and the back button all
 * behave the way they would if you had opened the page directly. Next's
 * intercepting routes do the work — this only provides the box, the scroll
 * container and the ways out.
 *
 * Three ways out, because a modal that traps you is worse than no modal:
 * Escape, the close button, and clicking the backdrop.
 */
export function ProjectModal({
  children, label,
}: {
  children: React.ReactNode
  /** Named for screen readers, which otherwise announce an unlabelled dialog. */
  label: string
}) {
  const router   = useRouter()
  const lenis    = useLenis()
  const scroller = useRef<HTMLDivElement>(null)
  const panel    = useRef<HTMLDivElement>(null)

  /**
   * Closing is both a navigation and a local fact.
   *
   * `router.back()` restores the URL and empties the slot, but it goes
   * through the router to do it. Knowing locally that it is closed means the
   * modal leaves the screen on the click rather than a frame or two later,
   * and means nothing is left over if the slot is ever slow to clear.
   */
  const [open, setOpen] = useState(true)

  const close = useCallback(() => {
    setOpen(false)
    router.back()
  }, [router])

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)

    /**
     * The page behind must not scroll while the modal is open, and stopping
     * it takes two things, because two different mechanisms move it.
     *
     * Lenis owns the wheel on this site: it listens globally and scrolls the
     * window itself, so `overflow: hidden` does not reach it — the first
     * version of this modal looked right and then scrolled the index behind
     * it. `lenis.stop()` is what actually holds the page still, and
     * `data-lenis-prevent` on the box below is what lets the wheel reach the
     * case study instead of being swallowed.
     *
     * `overflow: hidden` still matters for the readers Lenis never runs for —
     * anyone on `prefers-reduced-motion`. The scrollbar's width is handed back
     * as padding, or taking it away shifts the whole page sideways.
     */
    lenis?.stop()

    const { body } = document
    const gap = window.innerWidth - document.documentElement.clientWidth
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }

    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    panel.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      lenis?.start()
      body.style.overflow     = previous.overflow
      body.style.paddingRight = previous.paddingRight
    }
  }, [close, open, lenis])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-ink"
      // The backdrop closes, but only when it is the backdrop that was
      // clicked — not when a click inside the panel bubbles out to it.
      onMouseDown={event => { if (event.target === event.currentTarget) close() }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        // Full bleed. The case study is the thing being read; a frame around
        // it only made the page it covers peek through at the edges.
        className="relative flex h-full w-full flex-col overflow-hidden bg-ink outline-none"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar proyecto"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center
                     rounded-full border border-paper/15 bg-ink/70 text-paper/70 backdrop-blur-md
                     transition-colors duration-200 hover:border-paper/40 hover:text-paper md:right-6 md:top-6"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>

        {/* The case study scrolls in here, not in the window. ChapterNav is
            told to measure against this box by the same attribute, and
            `data-lenis-prevent` is what stops Lenis stealing the wheel on its
            way in. */}
        <div
          ref={scroller}
          data-project-scroller
          data-lenis-prevent
          className="h-full overflow-y-auto overscroll-contain"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
