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

export function HeroText() {
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const h1Ref      = useRef<HTMLHeadingElement>(null)
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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const h1      = h1Ref.current
    const eyebrow = eyebrowRef.current
    const sub     = subRef.current
    if (!h1) return

    const split = new SplitText(h1, { type: 'chars,words' })

    gsap.set(split.chars, { y: 60, opacity: 0 })
    gsap.set([eyebrow, sub], { y: 18, opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl
      .to(eyebrow, { y: 0, opacity: 1, duration: 0.7 })
      .to(split.chars, { y: 0, opacity: 1, duration: 0.85, stagger: 0.014 }, '-=0.4')
      .to(sub, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')

    return () => {
      tl.kill()
      split.revert()
    }
  }, [])

  return (
    <section
      aria-label="Nexxo — estudio de diseño y desarrollo"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-ink px-6 md:px-16 lg:px-24 pt-28 md:pt-32"
    >
      <PhysicsStickerWall
        imageUrls={[...HERO_STICKERS]}
        backgroundColor="var(--color-ink)"
        stickerCount={isMobile ? 5 : 11}
        stickerSize={isMobile ? 100 : 142}
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

      <h1
        ref={h1Ref}
        className="relative z-10 pointer-events-none mx-auto mt-5 max-w-[13ch] text-center font-display font-semibold text-paper leading-[0.9] tracking-[-0.045em]"
        style={{ fontSize: 'clamp(2.8rem, 5.8vw, 6.5rem)' }}
      >
        {t('headline1')}
        <br />
        {t('headline2')}
      </h1>

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
