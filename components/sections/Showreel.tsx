'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { ReelShot } from '@/sanity/lib/reel-data'

/**
 * The showreel, cut in the browser instead of encoded to a file.
 *
 * Why not an mp4: the work in it is interface. Video compression is tuned for
 * photography and eats exactly what a UI is made of — 1px rules, small type,
 * flat colour fields — so a reel of these screens would look worse than the
 * screens themselves. Rendering the originals keeps them sharp at any viewport,
 * costs about 2.3 MB against 8-15 MB for the equivalent clip, needs no codec or
 * autoplay negotiation, and stays editable: reordering the cut is a line in
 * reel-data, not a re-export.
 *
 * Failure behaviour: the first frame is painted by inline style, not by the
 * timeline. If GSAP throws or never runs, the section shows a still from the
 * reel rather than a black rectangle.
 */

const MOVE: Record<ReelShot['move'], { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  in:    { from: { scale: 1.0,  xPercent: 0 },  to: { scale: 1.12, xPercent: 0 } },
  out:   { from: { scale: 1.12, xPercent: 0 },  to: { scale: 1.0,  xPercent: 0 } },
  left:  { from: { scale: 1.08, xPercent: 2 },  to: { scale: 1.08, xPercent: -2 } },
  right: { from: { scale: 1.08, xPercent: -2 }, to: { scale: 1.08, xPercent: 2 } },
}

export function Showreel({ shots }: { shots: ReelShot[] }) {
  const frames   = useRef<(HTMLDivElement | null)[]>([])
  const barRef   = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!shots.length) return
    const els = frames.current.filter(Boolean) as HTMLDivElement[]
    if (els.length !== shots.length) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tl: gsap.core.Timeline | undefined

    try {
      const total = shots.reduce((n, s) => n + s.dur, 0)

      tl = gsap.timeline({ repeat: -1 })
      gsap.set(els, { autoAlpha: 0 })

      let at = 0
      shots.forEach((shot, i) => {
        const el = els[i]
        const img = el.firstElementChild

        // A hard cut, not a crossfade. Two dissolving images read as a
        // slideshow; a cut reads as an edit.
        tl!.set(el, { autoAlpha: 1 }, at)
        tl!.set(els.filter((_, j) => j !== i), { autoAlpha: 0 }, at)

        if (!still && img) {
          const { from, to } = MOVE[shot.move]
          tl!.fromTo(img, from, { ...to, duration: shot.dur, ease: 'none' }, at)
        }

        if (labelRef.current) {
          tl!.call(() => {
            if (labelRef.current) labelRef.current.textContent = shot.label
          }, undefined, at)
        }

        at += shot.dur
      })

      if (barRef.current) {
        tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: total, ease: 'none' }, 0)
      }
    } catch {
      tl?.kill()
      // Leave the poster frame showing rather than an empty stage.
      gsap.set(els.slice(1), { autoAlpha: 0 })
      gsap.set(els[0], { autoAlpha: 1 })
    }

    return () => { tl?.kill() }
  }, [shots])

  if (!shots.length) {
    return (
      <div className="w-full aspect-video bg-line flex items-center justify-center">
        <span className="font-mono text-smoke text-[11px] uppercase tracking-[0.2em]">
          Reel no disponible
        </span>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-ink">
      {shots.map((shot, i) => (
        <div
          key={shot.url + i}
          ref={el => { frames.current[i] = el }}
          className="absolute inset-0 overflow-hidden"
          // The first frame is visible without JavaScript. Everything after it
          // is hidden here and revealed by the timeline.
          style={i === 0 ? undefined : { visibility: 'hidden', opacity: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot.url}
            alt=""
            className="w-full h-full object-cover will-change-transform"
            loading={i < 3 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            draggable={false}
          />
        </div>
      ))}

      {/* Which studio's work you are looking at, and how far through. */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gutter-x pb-5 pointer-events-none">
        <span
          ref={labelRef}
          className="font-mono text-paper/80 text-[10px] uppercase tracking-[0.25em]"
        >
          {shots[0].label}
        </span>
        <span className="font-mono text-paper/45 text-[10px] uppercase tracking-[0.25em]">
          Nexxo · Showreel
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-paper/15">
        <div ref={barRef} className="h-full bg-accent origin-left scale-x-0" />
      </div>
    </div>
  )
}
