'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { CONTACT_CALENDLY } from '@/lib/constants'
import { PhysicsStickerWall } from './PhysicsStickerWall'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText)
}

/**
 * Real client work, one sticker per project. The wall draws eleven on desktop,
 * so the list is eleven long and nothing repeats. Served at 420px square —
 * they render at 142px, and the originals were 3.4 MB together.
 */
const HERO_STICKERS = [
  '/images/hero/virtualpits.webp',
  '/images/hero/solivus.webp',
  '/images/hero/greenery.webp',
  '/images/hero/hanara.webp',
  '/images/hero/mente.webp',
  '/images/hero/merxo.webp',
  '/images/hero/maison-oliva.webp',
  '/images/hero/nexo-go.webp',
  '/images/hero/clear-numbers.webp',
  '/images/hero/greenery-02.webp',
  '/images/hero/mente-02.webp',
] as const

/** Seconds between characters. ~31 per second reads as brisk typing, not a crawl. */
const CHAR_STAGGER = 0.032

export function HeroText() {
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const h1Ref      = useRef<HTMLHeadingElement>(null)
  const h1WrapRef  = useRef<HTMLDivElement>(null)
  const caretRef   = useRef<HTMLSpanElement>(null)
  const subRef     = useRef<HTMLDivElement>(null)
  const t          = useTranslations('hero')
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /**
   * The headline types itself in, with a caret that follows the last character
   * and disappears once the line is finished.
   *
   * Everything is wrapped: if SplitText or the timeline throws, the catch puts
   * the headline back to full opacity. The one outcome this animation must
   * never produce is an invisible h1 — that is the whole message of the page.
   */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const h1      = h1Ref.current
    const eyebrow = eyebrowRef.current
    const sub     = subRef.current
    const caret   = caretRef.current
    if (!h1) return

    let split: SplitText | undefined
    let tl:    gsap.core.Timeline | undefined

    try {
      split = new SplitText(h1, { type: 'chars,words' })
      const chars  = split.chars
      const cursor = { i: 0 }

      gsap.set(chars, { opacity: 0 })
      gsap.set([eyebrow, sub].filter(Boolean), { y: 16, opacity: 0 })

      // The caret sits in the h1's positioned wrapper, so a character's
      // offsetLeft/offsetTop are already in the caret's coordinate space.
      const parkCaret = (el: Element) => {
        if (!caret || !(el instanceof HTMLElement)) return
        gsap.set(caret, {
          x:      el.offsetLeft + el.offsetWidth,
          y:      el.offsetTop,
          height: el.offsetHeight,
        })
      }
      if (caret && chars[0]) {
        parkCaret(chars[0])
        // visibility, not autoAlpha — autoAlpha would write opacity and fight
        // the blink keyframes for control of it.
        gsap.set(caret, { visibility: 'visible' })
      }

      tl = gsap.timeline()
      tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
        .to(chars, {
          opacity:  1,
          // Each character lands instantly; the rhythm comes from the stagger,
          // which is what makes this read as typing rather than as a fade.
          duration: 0.01,
          ease:     'none',
          stagger:  CHAR_STAGGER,
        }, '-=0.15')
        // The caret rides a proxy index over the same span as the stagger, so
        // it tracks the character being typed without depending on per-target
        // callbacks.
        .to(cursor, {
          i:        chars.length - 1,
          duration: chars.length * CHAR_STAGGER,
          ease:     'none',
          onUpdate: () => parkCaret(chars[Math.round(cursor.i)]),
        }, '<')
        .to(sub, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '+=0.1')
        // display, not opacity: the blink keyframes own opacity on this element.
        .set(caret, { display: 'none' }, '<')
    } catch {
      tl?.kill()
      split?.revert()
      gsap.set(h1, { opacity: 1, clearProps: 'transform' })
      if (caret) caret.style.display = 'none'
      return
    }

    return () => {
      tl?.kill()
      split?.revert()
    }
  }, [])

  return (
    <section
      aria-label="Nexxo — estudio de diseño y desarrollo"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-ink px-6 md:px-16 lg:px-24 pt-28 md:pt-32"
    >
      {/* Sticker size is desktop-only: mobile stays at 100 so the pieces still
          fit the narrower stage instead of piling into a wall. */}
      <PhysicsStickerWall
        imageUrls={[...HERO_STICKERS]}
        backgroundColor="var(--color-ink)"
        stickerCount={isMobile ? 5 : 11}
        stickerSize={isMobile ? 100 : 180}
        sizeRandomness={isMobile ? 0.15 : 0.3}
        gravity={1.35}
        restitution={0.42}
        friction={0.16}
        throwPower={1.15}
        borderRadius={18}
      />

      <span
        ref={eyebrowRef}
        className="relative z-10 pointer-events-none mt-[7vh] text-center font-mono text-smoke/70 text-[10px] uppercase tracking-[0.2em] block"
      >
        {t('eyebrow')}
      </span>

      {/* The wrapper carries the positioning so the caret can be placed from a
          character's offsetLeft/offsetTop. The h1 itself must stay unpositioned
          for those offsets to resolve against this box. */}
      {/* The measure stays on the h1: `13ch` has to resolve against the headline's
          own font-size. On the wrapper it would resolve against the body font and
          crush the title into a one-letter column. */}
      <div ref={h1WrapRef} className="relative z-10 pointer-events-none mt-5 w-full">
        <h1
          ref={h1Ref}
          className="mx-auto max-w-[13ch] text-center font-display font-semibold text-paper leading-[0.9] tracking-[-0.045em]"
          style={{ fontSize: 'clamp(2.8rem, 5.8vw, 6.5rem)' }}
        >
          {t('headline1')}
          <br />
          {t('headline2')}
        </h1>

        <span
          ref={caretRef}
          aria-hidden
          className="hero-caret absolute left-0 top-0 bg-accent"
          style={{ width: 'clamp(3px, 0.35vw, 7px)', height: '1em', visibility: 'hidden' }}
        />
      </div>

      <div
        ref={subRef}
        className="relative z-10 pointer-events-none mx-auto mt-6 flex max-w-[48ch] flex-col items-center gap-5 text-center"
      >
        <p className="font-mono text-smoke text-[12px] md:text-[13px] tracking-[0.02em] leading-relaxed max-w-[42ch]">
          {t('body')}
        </p>

        <div className="pointer-events-auto flex items-center gap-5 shrink-0">
          <Link
            href={CONTACT_CALENDLY as any}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink bg-paper px-5 py-3 hover:bg-paper/80 transition-colors duration-200"
          >
            {t('ctaAgendar')}
          </Link>
          <Link
            href="/proyectos"
            className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.22em] text-smoke hover:text-paper transition-colors duration-200"
          >
            {t('ctaTrabajo')}
          </Link>
        </div>
      </div>

    </section>
  )
}
