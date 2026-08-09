'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const COLS = 7
const ROWS = 4
const TILES = COLS * ROWS // 28

const HERO_IMAGE        = '/images/hero-bg.png'
const HERO_IMAGE_MOBILE = '/images/hero-bg-mobile.png'
const SHOWREEL_SRC      = '' // '/video/showreel.mp4'  ← sube tu video aquí

function sr(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function FusionReel() {
  const sectionRef    = useRef<HTMLElement>(null)
  const gridRef       = useRef<HTMLDivElement>(null)
  const tilesRef      = useRef<(HTMLDivElement | null)[]>([])
  const videoLayerRef = useRef<HTMLDivElement>(null)
  const videoRef      = useRef<HTMLVideoElement>(null)
  const playBtnRef    = useRef<HTMLButtonElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)

  const [reelOpen,  setReelOpen]  = useState(false)
  const [isMobileRender, setIsMobileRender] = useState(false)

  useEffect(() => {
    const check = () => setIsMobileRender(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  const openReel = useCallback(() => {
    setReelOpen(true)
    requestAnimationFrame(() => {
      modalVideoRef.current?.play().catch(() => {})
    })
  }, [])

  const closeReel = useCallback(() => {
    setReelOpen(false)
    if (modalVideoRef.current) {
      modalVideoRef.current.pause()
      modalVideoRef.current.currentTime = 0
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    if (!reelOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeReel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reelOpen, closeReel])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    const grid    = gridRef.current
    const tiles   = tilesRef.current.filter((t): t is HTMLDivElement => !!t)
    const vLayer  = videoLayerRef.current
    const video   = videoRef.current
    const playBtn = playBtnRef.current

    if (!section || !grid || tiles.length < TILES) return

    if (video && SHOWREEL_SRC) {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          video.src = SHOWREEL_SRC
          video.load()
          io.disconnect()
        }
      }, { rootMargin: '400px' })
      io.observe(section)
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    if (prefersReduced) {
      if (vLayer && SHOWREEL_SRC) gsap.set(vLayer, { opacity: 1 })
      if (video && SHOWREEL_SRC) video.play().catch(() => {})
      if (playBtn) gsap.set(playBtn, { opacity: 1, scale: 1 })
      return
    }

    if (isMobile) {
      // Mobile: skip 3D scatter — just fade tiles in from center as user scrolls
      gsap.set(tiles, { opacity: 0 })
      if (playBtn) gsap.set(playBtn, { opacity: 0, scale: 0.88 })

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        })
        tl.to(tiles, {
          opacity: 1,
          duration: 0.6,
          stagger: { amount: 0.5, from: 'center', ease: 'power1.inOut' },
          ease: 'power2.out',
        }, 0)
        if (playBtn) {
          tl.to(playBtn, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.45)
        }
      }, section)

      return () => { ctx.revert() }
    }

    // ── Desktop: full 3D tile assembly ──────────────────────────────────────
    tiles.forEach((tile, i) => {
      gsap.set(tile, {
        x:          (sr(i, 0) - 0.5) * 600,
        y:          (sr(i, 1) - 0.5) * 380,
        z:           sr(i, 2) * -900,
        rotationX: (sr(i, 3) - 0.5) * 70,
        rotationY: (sr(i, 4) - 0.5) * 70,
        rotationZ: (sr(i, 5) - 0.5) * 30,
        scale:       sr(i, 6) * 0.5 + 0.2,
        opacity:     sr(i, 7) * 0.25,
        filter:     `blur(${sr(i, 8) * 12 + 4}px)`,
        force3D: true,
      })
    })

    if (playBtn) gsap.set(playBtn, { opacity: 0, scale: 0.88 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      })

      // 0.00 → 0.50 — tiles ensamblan (listo al 50% del scroll, margen amplio)
      tl.to(tiles, {
        x: 0, y: 0, z: 0,
        rotationX: 0, rotationY: 0, rotationZ: 0,
        scale: 1, opacity: 1,
        filter: 'blur(0px)',
        stagger: { amount: 0.3, from: 'center', ease: 'power1.inOut' },
        ease: 'power2.inOut',
        duration: 0.50,
        force3D: true,
      }, 0)

      // 0.42 → 0.57 — botón PLAY aparece cuando imagen casi ensamblada
      if (playBtn) {
        tl.to(playBtn, {
          opacity: 1,
          scale: 1,
          duration: 0.15,
          ease: 'power2.out',
        }, 0.42)
      }

      // 0.55 → 0.75 — fade grid → video de fondo (si hay video)
      tl.to(grid, {
        opacity: 0,
        duration: 0.18,
        ease: 'power1.in',
      }, 0.55)

      if (vLayer && SHOWREEL_SRC) {
        tl.to(vLayer, {
          opacity: 1,
          duration: 0.18,
          ease: 'power1.out',
          onStart: () => video?.play().catch(() => {}),
        }, 0.55)
      }
    }, section)

    return () => { ctx.revert() }
  }, [])

  const activeBgImage = isMobileRender
    ? (HERO_IMAGE_MOBILE || HERO_IMAGE)
    : HERO_IMAGE

  const tileEls = Array.from({ length: TILES }, (_, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)

    // Mobile: vw-based positioning avoids subpixel rounding gaps in 7-column grid.
    // Grid = 100vw × 100vw (aspect-square), so background-size = 100vw × 100vw
    // and position offsets are exact vw multiples — no integer pixel rounding.
    const bgSize = isMobileRender
      ? '100vw 100vw'
      : `${COLS * 100}% ${ROWS * 100}%`

    const bgPos = isMobileRender
      ? `${-(col / COLS) * 100}vw ${-(row / ROWS) * 100}vw`
      : `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`

    return (
      <div
        key={i}
        ref={el => { tilesRef.current[i] = el }}
        style={{
          backgroundImage: activeBgImage
            ? `url(${activeBgImage})`
            : 'linear-gradient(155deg, #08080f 0%, #10102a 25%, #1e0d50 50%, #5B3DF5 68%, #110c2e 85%, #080810 100%)',
          backgroundSize:     bgSize,
          backgroundPosition: bgPos,
        }}
      />
    )
  })

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="Showreel"
        className="relative h-[108vh] md:h-[200vh]"
      >
        <div className="sticky top-0 h-screen w-full bg-ink overflow-hidden">

          {/* Perspectiva — full screen on desktop, flex-center on mobile */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: '1200px' }}
          >
            {/* Layer A — grid de tiles
                Mobile:  relative w-full + aspect-square → 1:1, no stretch con imagen cuadrada
                Desktop: md:absolute md:inset-0 → fills viewport (overrides aspect-ratio) */}
            <div
              ref={gridRef}
              aria-hidden
              className="relative w-full aspect-square md:aspect-auto md:absolute md:inset-0"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gridTemplateRows:    `repeat(${ROWS}, 1fr)`,
                transformStyle: 'preserve-3d',
                overflow: isMobileRender ? 'hidden' : 'visible',
              }}
            >
              {tileEls}
            </div>

            {/* Layer B — video de fondo (muted, loop, sin controles) */}
            <div
              ref={videoLayerRef}
              aria-hidden
              className="absolute inset-0 z-10"
              style={{ opacity: 0 }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                poster={HERO_IMAGE || undefined}
                preload="none"
              />
            </div>
          </div>

          {/* ── Botón PLAY REEL ── */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <button
              ref={playBtnRef}
              onClick={openReel}
              aria-label="Reproducir showreel"
              className="pointer-events-auto flex items-center gap-3 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/90 border border-paper/25 backdrop-blur-md bg-ink/30 hover:bg-ink/50 hover:border-paper/50 transition-all duration-300"
              style={{ opacity: 0 }}
            >
              <span className="text-accent text-[13px]">▶</span>
              Play reel
            </button>
          </div>

          {/* Label de sección */}
          <div
            aria-hidden
            className="absolute top-8 md:top-10 left-6 md:left-16 lg:left-24 z-20"
          >
            <span className="font-mono text-smoke/55 text-[9px] uppercase tracking-[0.25em]">
              02 — Showreel
            </span>
          </div>

        </div>
      </section>

      {/* ── Modal lightbox ── */}
      {reelOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
          className="fixed inset-0 z-[100] bg-ink/96 flex items-center justify-center"
          onClick={closeReel}
        >
          {/* Cerrar */}
          <button
            onClick={closeReel}
            aria-label="Cerrar"
            className="absolute top-6 right-6 md:top-8 md:right-8 font-mono text-[10px] uppercase tracking-[0.22em] text-smoke hover:text-paper transition-colors duration-200 flex items-center gap-2"
          >
            <span className="text-lg leading-none">×</span> Cerrar
          </button>

          {/* Video con sonido y controles nativos */}
          <div
            className="relative w-full max-w-5xl mx-6"
            onClick={e => e.stopPropagation()}
          >
            {SHOWREEL_SRC ? (
              <video
                ref={modalVideoRef}
                src={SHOWREEL_SRC}
                className="w-full aspect-video"
                controls
                playsInline
                autoPlay
              />
            ) : (
              /* Placeholder mientras no hay video */
              <div className="w-full aspect-video bg-line flex flex-col items-center justify-center gap-4">
                <span className="font-mono text-smoke text-[11px] uppercase tracking-[0.2em]">
                  Video próximamente
                </span>
                <p className="font-mono text-smoke/65 text-[10px] text-center max-w-[32ch] leading-relaxed">
                  Sube tu showreel a{' '}
                  <code className="text-accent">/public/video/showreel.mp4</code>
                  {' '}y actualiza{' '}
                  <code className="text-accent">SHOWREEL_SRC</code>
                  {' '}en FusionReel.tsx
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
