'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type CapabilityItem = {
  label:     string
  outcome:   string
  imageHint: string
}

const NUMBERS = ['01', '02', '03', '04']

function ImagePlaceholder({ hint, number }: { hint: string; number: string }) {
  return (
    <>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.75"
          className="w-8 h-8 text-smoke/20">
          <rect x="3" y="3" width="34" height="34" rx="1" />
          <line x1="3" y1="14" x2="37" y2="14" strokeDasharray="2 3" />
          <line x1="14" y1="3" x2="14" y2="37" strokeDasharray="2 3" />
        </svg>
        <p className="font-mono text-smoke/20 text-[9px] uppercase tracking-[0.2em] text-center leading-loose px-6">
          {hint}
        </p>
      </div>
      <span
        className="absolute bottom-2 right-3 font-display font-bold text-paper/[0.05] leading-none select-none"
        style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
        aria-hidden
      >
        {number}
      </span>
    </>
  )
}

export function Capabilities() {
  const [active, setActive] = useState<number | null>(null)
  const t = useTranslations('capabilities')
  const items = t.raw('items') as CapabilityItem[]

  return (
    <section aria-label="Lo que hacemos" className="border-t border-line">

      <div className="px-6 md:px-16 lg:px-24 pt-20 md:pt-28 pb-10 md:pb-14">
        <span className="font-mono text-smoke text-[10px] uppercase tracking-[0.25em] block mb-4">
          {t('seccion')}
        </span>
        <h2
          className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
        >
          {t('headline1')}<br />{t('headline2')}
        </h2>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block px-6 md:px-16 lg:px-24 pb-28 md:pb-36">
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
                      isActive ? 'text-paper' : 'text-smoke/25'
                    }`}
                  >
                    {cap.label}
                  </span>
                  <span
                    className={`block font-body text-smoke/70 text-[13px] leading-relaxed transition-all duration-300 overflow-hidden ${
                      isActive ? 'max-h-16 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
                    }`}
                  >
                    {cap.outcome}
                  </span>
                </div>
                <span
                  className={`font-mono text-[10px] tracking-[0.22em] shrink-0 transition-colors duration-300 ${
                    isActive ? 'text-smoke/50' : 'text-smoke/20'
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
                    <ImagePlaceholder hint={cap.imageHint} number={num} />
                  </div>
                </div>
              </div>
            )
          })}
          <div className="border-t border-line" />
        </div>
      </div>

      {/* Mobile: acordeón */}
      <div className="lg:hidden px-6 pt-2 pb-16">
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
                    isOpen ? 'text-accent' : 'text-smoke/25'
                  }`}
                >
                  {num}
                </span>
                <span
                  className={`font-mono text-[1.05rem] leading-snug tracking-[-0.01em] flex-1 transition-colors duration-300 ${
                    isOpen ? 'text-paper' : 'text-smoke/40'
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
                    <ImagePlaceholder hint={cap.imageHint} number={num} />
                  </div>
                  <p className="font-body text-smoke text-[15px] leading-relaxed">
                    {cap.outcome}
                  </p>
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
