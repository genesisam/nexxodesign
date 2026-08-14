'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

const SLOT_BG = [
  'linear-gradient(148deg,#0a0620 0%,#1e0d50 60%,#5B3DF5 100%)',
  'linear-gradient(148deg,#050d1a 0%,#0a2550 60%,#1060b0 100%)',
  'linear-gradient(148deg,#04141a 0%,#083030 60%,#0a9090 100%)',
  'linear-gradient(148deg,#140404 0%,#3a0f0f 60%,#9b1d1d 100%)',
  'linear-gradient(148deg,#0a0904 0%,#282205 60%,#806808 100%)',
  'linear-gradient(148deg,#04080a 0%,#051a14 60%,#096640 100%)',
]

// Card artwork, index-aligned with SLOT_BG: each image is lit in its slot's
// accent colour, so the gradient underneath stays a seamless fallback if the
// image is missing or still loading.
const SLOT_SRC = [
  '/images/system/transformacion-01.webp',
  '/images/system/transformacion-02.webp',
  '/images/system/transformacion-03.webp',
  '/images/system/transformacion-04.webp',
  '/images/system/transformacion-05.webp',
  '/images/system/transformacion-06.webp',
]

// Thumbnail scale relative to main frame (matches Oryzo --thumb-scale: .35)
const THUMB_SCALE = 0.35

// Thumbnails get their real px size from JS, but that runs inside a rAF — so on
// the first paint they'd measure 0×0 and every `Image fill` inside would warn
// about a zero height. A CSS-only placeholder in the right proportion keeps them
// laid out until the measured values land on top.
const THUMB_FALLBACK = { width: '15vw', aspectRatio: '3 / 4' } as const

type SlotData = { label: string; title: string; sub: string }

export default function TransformacionInner() {
  const t     = useTranslations('transformacion')
  const slots = t.raw('slots') as SlotData[]
  const SLOTS = slots.map((s, i) => ({ ...s, src: SLOT_SRC[i] ?? '', bg: SLOT_BG[i] }))
  const N     = SLOTS.length
  const sectionRef     = useRef<HTMLElement>(null)
  const frameRef       = useRef<HTMLDivElement>(null)   // main frame — overflow:hidden
  const mainStripRef   = useRef<HTMLDivElement>(null)   // filmstrip inside main frame
  const leftWrapRef    = useRef<HTMLDivElement>(null)   // left thumbnail container
  const leftStripRef   = useRef<HTMLDivElement>(null)   // strip inside left container
  const rightWrapRef   = useRef<HTMLDivElement>(null)   // right thumbnail container
  const rightStripRef  = useRef<HTMLDivElement>(null)   // strip inside right container

  // Per-item thumbnail refs so we can set their dimensions in JS
  const leftItemRefs  = useRef<(HTMLDivElement | null)[]>([])
  const rightItemRefs = useRef<(HTMLDivElement | null)[]>([])

  const titleRef   = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)
  const mTitleRef  = useRef<HTMLHeadingElement>(null)   // mobile copy
  const mLabelRef  = useRef<HTMLSpanElement>(null)      // mobile copy
  const hintRef    = useRef<HTMLDivElement>(null)
  const lastStage  = useRef(-1)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    let ctx: ReturnType<typeof gsap.context> | undefined

    const rafId = requestAnimationFrame(() => {
    const section    = sectionRef.current
    const frame      = frameRef.current
    const mainStrip  = mainStripRef.current
    const leftWrap   = leftWrapRef.current
    const leftStrip  = leftStripRef.current
    const rightWrap  = rightWrapRef.current
    const rightStrip = rightStripRef.current

    if (!section || !frame || !mainStrip || !leftWrap || !leftStrip || !rightWrap || !rightStrip) return

    // ── Compute frame dimensions — mirrors the responsive CSS exactly ────────
    const vw        = window.innerWidth
    const vh        = window.innerHeight
    const isDesktop = vw >= 1024

    // Mobile:  w-[85vw] + aspect-ratio 3/4  →  w = 85vw, h = w * 4/3
    // Desktop: lg:h-[86vh] lg:max-h-[760px] →  h = min(86vh,760), w = h * 3/4
    let FW: number, FH: number
    if (isDesktop) {
      FH = Math.min(vh * 0.86, 760)
      FW = Math.round(FH * 3 / 4)
    } else {
      FW = Math.round(vw * 0.85)
      FH = Math.round(FW * 4 / 3)
    }

    const frameLeft  = (vw - FW) / 2
    const frameRight = frameLeft + FW
    const LW     = frameLeft
    const RW     = vw - frameRight
    const TW     = Math.round(FW * THUMB_SCALE)
    const TH     = Math.round(FH * THUMB_SCALE)
    const TG     = Math.round(FW * 0.08)
    const TW_gap = TW + TG

    // ── Desktop only: show + size thumbnail wrappers ─────────────────────
    if (isDesktop) {
      gsap.set(leftWrap,  { width: LW, autoAlpha: 1 })
      gsap.set(rightWrap, { width: RW, autoAlpha: 1 })
      const applyThumbSize = (refs: (HTMLDivElement | null)[]) => {
        refs.forEach(el => {
          if (!el) return
          el.style.width       = `${TW}px`
          el.style.height      = `${TH}px`
          el.style.marginRight = `${TG}px`
        })
      }
      applyThumbSize(leftItemRefs.current)
      applyThumbSize(rightItemRefs.current)
    }

    // ── Gallery update — filmstrip runs on ALL breakpoints ────────────────
    const updateGallery = (sf: number) => {
      gsap.set(mainStrip, { x: -sf * FW })

      if (isDesktop) {
        gsap.set(leftStrip,  { x: LW - (sf - 1) * TW_gap - TW, yPercent: -50 })
        gsap.set(rightStrip, { x: -(sf + 1) * TW_gap,           yPercent: -50 })
      }
    }

    // ── Discrete stage: copy text + progress dots ─────────────────────────
    const onStage = (stage: number, instant = false) => {
      if (stage === lastStage.current) return
      lastStage.current = stage

      document.querySelectorAll('[data-dot]').forEach((el, i) => {
        (el as HTMLElement).style.backgroundColor =
          i === stage ? 'rgba(91,61,245,0.9)' : 'rgba(255,255,255,0.18)'
      })

      const c = SLOTS[stage]
      const applyText = () => {
        const html = c.title.replace('\n', '<br/>')
        if (titleRef.current)  titleRef.current.innerHTML   = html
        if (subRef.current)    subRef.current.textContent   = c.sub
        if (labelRef.current)  labelRef.current.textContent = c.label
        if (mTitleRef.current) mTitleRef.current.innerHTML  = html
        if (mLabelRef.current) mLabelRef.current.textContent = c.label
      }
      if (instant) {
        applyText()
      } else {
        const textEls = [titleRef.current, subRef.current, labelRef.current, mTitleRef.current, mLabelRef.current]
          .filter((el): el is HTMLElement => el !== null)
        if (!textEls.length) { applyText(); return }
        gsap.timeline()
          .to(textEls, { opacity: 0, y: -8, duration: 0.18, ease: 'power2.in' })
          .call(applyText)
          .to(textEls, { opacity: 1, y: 0, duration: 0.26, ease: 'power2.out' })
      }
    }

    updateGallery(0)
    onStage(0, true)

    // ── ScrollTrigger ─────────────────────────────────────────────────────
    ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start:   'top top',
        end:     'bottom bottom',
        scrub:   true,
        // Snap to nearest slide when scroll inertia stops
        snap: {
          snapTo:   1 / (N - 1),
          duration: { min: 0.2, max: 0.5 },
          delay:    0.05,
          ease:     'power1.inOut',
        },
        onUpdate: ({ progress: p }) => {
          const sf = Math.min(p * (N - 1), N - 1)
          updateGallery(sf)

          if (hintRef.current)
            hintRef.current.style.opacity = String(Math.max(0, 1 - p / 0.06))

          onStage(Math.round(sf))
        },
      })
    }, section)
    }) // end requestAnimationFrame

    return () => {
      cancelAnimationFrame(rafId)
      ctx?.revert()
    }
  }, [])

  // ── Shared card content ───────────────────────────────────────────────
  const cardContent = (slot: typeof SLOTS[0], i: number, large = true) =>
    slot.src ? (
      <Image
        src={slot.src}
        alt={slot.title.replace('\n', ' ')}
        fill
        sizes={large ? '(min-width:1024px) 38vw, 90vw' : '15vw'}
        className="object-cover object-center"
        priority={i === 0}
      />
    ) : (
      <div className="absolute inset-0" style={{ background: slot.bg }}>
        {large && (
          <span
            aria-hidden
            className="absolute bottom-5 right-5 font-display font-semibold text-paper/[0.07] select-none leading-none"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
          >
            {slot.label}
          </span>
        )}
      </div>
    )

  return (
    <section ref={sectionRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full bg-ink overflow-hidden">

        {/* ── Eyebrow ── */}
        <div className="absolute top-8 gutter-l z-30 pointer-events-none">
          <span className="font-mono text-smoke/55 text-[9px] uppercase tracking-[0.25em]">
            {t('seccion')}
          </span>
        </div>

        {/* ── Mobile copy — shown above frame on small screens ── */}
        <div className="lg:hidden absolute top-14 gutter-l gutter-r z-30 pointer-events-none flex flex-col gap-1">
          <span ref={mLabelRef} className="font-mono text-smoke/65 text-[9px] uppercase tracking-[0.22em]">
            {SLOTS[0].label}
          </span>
          <h2
            ref={mTitleRef}
            className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.03em] text-[2rem]"
            dangerouslySetInnerHTML={{ __html: SLOTS[0].title.replace('\n', '<br/>') }}
          />
        </div>

        {/* ── Desktop left copy ── */}
        <div
          className="hidden lg:flex flex-col absolute z-30 gap-3 gutter-l"
          style={{ top: '18%', maxWidth: 'min(340px, 23vw)' }}
        >
          <span ref={labelRef} className="font-mono text-smoke/65 text-[9px] uppercase tracking-[0.22em]">
            {SLOTS[0].label}
          </span>
          <h2
            ref={titleRef}
            className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2rem, 2.8vw, 3.2rem)' }}
            dangerouslySetInnerHTML={{ __html: SLOTS[0].title.replace('\n', '<br/>') }}
          />
          <p
            ref={subRef}
            className="font-mono text-smoke/70 text-[13px] leading-relaxed mt-2"
            style={{ maxWidth: '28ch' }}
          >
            {SLOTS[0].sub}
          </p>
          <div className="flex flex-col gap-1.5 mt-4">
            {SLOTS.map((_, i) => (
              <div
                key={i}
                data-dot
                className="w-1 h-1 rounded-full"
                style={{
                  backgroundColor: i === 0 ? 'rgba(91,61,245,0.9)' : 'rgba(255,255,255,0.18)',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
        </div>

        {/*
          ── Left thumbnail wrapper ──
          Full-height absolute container flush to the left edge.
          Width = gap between viewport left and frame left (set in JS).
          overflow:hidden clips thumbnails to this area.
          The thumbnail strip is vertically centered (yPercent: -50 via GSAP).
        */}
        <div
          ref={leftWrapRef}
          className="hidden lg:block absolute left-0 top-0 h-full overflow-hidden z-10"
          style={{ visibility: 'hidden' }}
        >
          <div
            ref={leftStripRef}
            className="absolute top-1/2 left-0 flex flex-row"
          >
            {SLOTS.map((slot, i) => (
              <div
                key={i}
                ref={el => { leftItemRefs.current[i] = el }}
                className="relative flex-shrink-0 overflow-hidden"
                style={THUMB_FALLBACK}
              >
                {cardContent(slot, i, false)}
              </div>
            ))}
          </div>
        </div>

        {/*
          ── Main frame ──
          overflow:hidden — images ONLY visible within this rectangle.
          The dashed border sits as an overlay inside (z-20), always visible.
          The filmstrip slides left via GSAP: x = -sf * FW
        */}
        <div
          ref={frameRef}
          className="absolute left-1/2 top-[58%] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden z-20
                     w-[85vw] lg:w-auto lg:h-[86vh] lg:max-h-[760px]"
          style={{ aspectRatio: '3 / 4' }}
        >
          {/* Dashed border overlay */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ border: '1px dashed rgba(255,255,255,0.28)' }}
          />

          {/* Filmstrip — N full-size cards, each = frame width */}
          <div
            ref={mainStripRef}
            className="absolute top-0 left-0 h-full flex flex-row"
            style={{ width: `${N * 100}%` }}
          >
            {SLOTS.map((slot, i) => (
              <div
                key={i}
                className="relative h-full flex-shrink-0"
                style={{ width: `${100 / N}%` }}
              >
                {cardContent(slot, i, true)}
              </div>
            ))}
          </div>
        </div>

        {/*
          ── Right thumbnail wrapper ──
          Mirrors the left. Width = gap between frame right and viewport right.
          Thumbnail strip slides so image[sf+1] is at the left edge.
        */}
        <div
          ref={rightWrapRef}
          className="hidden lg:block absolute right-0 top-0 h-full overflow-hidden z-10"
          style={{ visibility: 'hidden' }}
        >
          <div
            ref={rightStripRef}
            className="absolute top-1/2 left-0 flex flex-row"
          >
            {SLOTS.map((slot, i) => (
              <div
                key={i}
                ref={el => { rightItemRefs.current[i] = el }}
                className="relative flex-shrink-0 overflow-hidden"
                style={THUMB_FALLBACK}
              >
                {cardContent(slot, i, false)}
              </div>
            ))}
          </div>
        </div>

        {/* Dark gradient — protects left copy text legibility over thumbnails */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 z-20 pointer-events-none"
          style={{
            width:      'min(16vw, 220px)',
            background: 'linear-gradient(to right, #0e0e0e 55%, transparent)',
          }}
        />

        {/* Dark gradient — softens right edge */}
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 z-10 pointer-events-none"
          style={{
            width:      'min(6vw, 90px)',
            background: 'linear-gradient(to left, #0e0e0e 30%, transparent)',
          }}
        />

        {/* ── Scroll hint ── */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
        >
          <div className="w-6 h-6 rounded-full border border-paper/30 flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path
                d="M4 1v6M1.5 4.5L4 7l2.5-2.5"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-mono text-smoke/65 text-[8px] uppercase tracking-[0.28em]">
            {t('scrollHint')}
          </span>
        </div>

      </div>
    </section>
  )
}
