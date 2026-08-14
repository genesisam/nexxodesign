'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

type CapabilityItem = {
  label:        string
  outcome:      string
  deliverables: string[]
  image:        string
  imageHint:    string
}

const NUMBERS = ['01', '02', '03', '04']

/**
 * Artwork for a service. Nothing sits on top of it — the numeral that used to
 * be ghosted into the corner fought the render underneath, and the row already
 * carries its number at the right edge.
 */
function CapabilityArt({ src, hint }: { src: string; hint: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={hint}
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
      draggable={false}
    />
  )
}

/** Concrete deliverables — scannable for readers, extractable for answer engines. */
function Deliverables({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3" role="list">
      {items.map(d => (
        <li
          key={d}
          className="font-mono text-smoke/65 text-[10px] uppercase tracking-[0.16em] border border-line px-2.5 py-1"
        >
          {d}
        </li>
      ))}
    </ul>
  )
}

export function Capabilities() {
  const [active, setActive] = useState<number | null>(null)
  const t = useTranslations('capabilities')
  const items = t.raw('items') as CapabilityItem[]

  return (
    <section aria-label="Lo que hacemos" className="border-t border-line">

      <ScrollReveal stagger className="gutter-x pt-20 md:pt-28 pb-10 md:pb-14">
        <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-4">
          {t('seccion')}
        </span>
        <h2
          className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
        >
          {t('headline1')}<br />{t('headline2')}
        </h2>
      </ScrollReveal>

      {/* Desktop */}
      <div className="hidden lg:block gutter-x pb-28 md:pb-36">
        <div onMouseLeave={() => setActive(null)}>
          {items.map((cap, i) => {
            const isActive = active === i
            const num = NUMBERS[i]
            return (
              <div
                key={num}
                onMouseEnter={() => setActive(i)}
                className="relative border-t border-line flex items-center justify-between py-9 cursor-default"
              >
                <div className="max-w-[50%]">
                  <span
                    className={`block font-mono text-lg xl:text-xl tracking-[-0.01em] transition-colors duration-300 ${
                      // Service names are the primary content of this section:
                      // the inactive state must stay readable, not disappear.
                      isActive ? 'text-paper' : 'text-smoke/70'
                    }`}
                  >
                    {cap.label}
                  </span>
                  <div
                    className={`block transition-all duration-300 overflow-hidden ${
                      isActive ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
                    }`}
                  >
                    <span className="block font-body text-smoke/70 text-[13px] leading-relaxed">
                      {cap.outcome}
                    </span>
                    <Deliverables items={cap.deliverables} />
                  </div>
                </div>
                <span
                  className={`font-mono text-[10px] tracking-[0.22em] shrink-0 transition-colors duration-300 ${
                    isActive ? 'text-paper' : 'text-smoke/70'
                  }`}
                >
                  {num}
                </span>
                <div
                  aria-hidden
                  className={`absolute right-[18%] top-1/2 -translate-y-1/2 w-[18%] pointer-events-none transition-opacity duration-500 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-line">
                    <CapabilityArt src={cap.image} hint={cap.imageHint} />
                  </div>
                </div>
              </div>
            )
          })}
          <div className="border-t border-line" />
        </div>
      </div>

      {/* Mobile: acordeón */}
      <div className="lg:hidden gutter-x pt-2 pb-16">
        {items.map((cap, i) => {
          const isOpen = active === i
          const num = NUMBERS[i]
          return (
            <div key={num} className="border-t border-line">
              <button
                onClick={() => setActive(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-4 py-5 text-left"
              >
                <span
                  className={`font-mono text-[10px] tracking-[0.18em] shrink-0 transition-colors duration-300 ${
                    isOpen ? 'text-accent' : 'text-smoke/55'
                  }`}
                >
                  {num}
                </span>
                <span
                  className={`font-mono text-[1.05rem] leading-snug tracking-[-0.01em] flex-1 transition-colors duration-300 ${
                    isOpen ? 'text-paper' : 'text-smoke/65'
                  }`}
                >
                  {cap.label}
                </span>
                <span
                  className={`font-mono text-smoke text-base shrink-0 transition-transform duration-300 leading-none ${
                    isOpen ? 'rotate-45' : 'rotate-0'
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pb-7 space-y-4">
                  <div className="relative aspect-video bg-line overflow-hidden">
                    <CapabilityArt src={cap.image} hint={cap.imageHint} />
                  </div>
                  <p className="font-body text-smoke text-[15px] leading-relaxed">
                    {cap.outcome}
                  </p>
                  <Deliverables items={cap.deliverables} />
                </div>
              </div>
            </div>
          )
        })}
        <div className="border-t border-line" />
      </div>

    </section>
  )
}
