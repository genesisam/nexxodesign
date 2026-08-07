'use client'

import { useEffect, useRef } from 'react'

// ─── Icons — minimal line SVGs per step ──────────────────────────────────────

function IconEstrategia() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <line x1="0"  y1="6"  x2="20" y2="6"  stroke="currentColor" strokeWidth="1.5"/>
      <line x1="6"  y1="14" x2="32" y2="14" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="0"  y1="22" x2="24" y2="22" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="8"  y1="30" x2="28" y2="30" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function IconDiseno() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <line x1="28" y1="4"  x2="4"  y2="28" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="12" x2="12" y2="32" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="20" y1="0"  x2="0"  y2="20" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="28" y1="16" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function IconBuild() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <line x1="4"  y1="0" x2="4"  y2="32" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="14" y1="6" x2="14" y2="32" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="24" y1="0" x2="24" y2="26" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="8" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function IconDeploy() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <line x1="16" y1="0"  x2="0"  y2="16" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="0"  x2="0"  y2="32" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="16" x2="16" y2="32" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="32" y1="8"  x2="8"  y2="32" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

const ICONS = [IconEstrategia, IconDiseno, IconBuild, IconDeploy]

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProcesoStep = {
  num:      string
  title:    string
  sublabel: string
  desc:     string
  desc2?:   string
}

// ─── Component ───────────────────────────────────────────────────────────────

const CARD_OFFSET = 64 // px between sticky tops (nav ~80px + offset per card)
const NAV_H       = 88 // approximate nav height

export function ProcesoCards({ steps }: { steps: ProcesoStep[] }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    const total = cards.length

    function onScroll() {
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        // How many cards are stacked above this one
        const stickyTop = NAV_H + i * CARD_OFFSET
        // Distance past the card's own sticky point (negative = not stuck yet)
        const progress = Math.max(0, stickyTop - rect.top) / (card.offsetHeight * 0.5)
        const clamped  = Math.min(progress, 1)
        // Cards behind stack with slight scale + translate down
        const scale  = 1 - clamped * 0.035 * (total - i - 1)
        const dim    = 0.35 + (1 - clamped) * 0.65 // opacity-like brightness via filter
        card.style.transform = `scale(${scale})`
        card.style.filter    = `brightness(${dim})`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div>
      {steps.map((step, i) => {
        const Icon = ICONS[i] ?? ICONS[0]
        return (
          <div
            key={step.num}
            ref={el => { cardRefs.current[i] = el }}
            className="sticky border border-paper/10 bg-ink"
            style={{
              top:            `${NAV_H + i * CARD_OFFSET}px`,
              transformOrigin:'top center',
              transition:     'transform 0.1s linear, filter 0.1s linear',
              zIndex:         10 + i,
            }}
          >
            {/* Inner grid */}
            <div className="grid grid-cols-12 gap-6 px-8 md:px-14 py-10 md:py-14">

              {/* Col 1-5: icon + title + sublabel */}
              <div className="col-span-12 md:col-span-5 flex flex-col gap-6 justify-between">
                <div className="text-paper/40">
                  <Icon />
                </div>
                <div>
                  <h3
                    className="font-display font-semibold text-paper leading-[0.9] tracking-[-0.04em]"
                    style={{ fontSize: 'clamp(2rem, 3.8vw, 3.6rem)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/35 mt-3">
                    {step.sublabel}
                  </p>
                </div>
              </div>

              {/* Col 6-8: description 1 */}
              <div className="col-span-12 md:col-span-3 flex items-end">
                <p
                  className="font-sans text-paper/55 leading-relaxed"
                  style={{ fontSize: 'clamp(0.875rem, 1.05vw, 0.95rem)' }}
                >
                  {step.desc}
                </p>
              </div>

              {/* Col 9-11: description 2 */}
              <div className="col-span-12 md:col-span-3 flex items-end">
                {step.desc2 && (
                  <p
                    className="font-sans text-paper/40 leading-relaxed"
                    style={{ fontSize: 'clamp(0.875rem, 1.05vw, 0.95rem)' }}
                  >
                    {step.desc2}
                  </p>
                )}
              </div>

              {/* Col 12: number */}
              <div className="hidden md:flex col-span-1 items-start justify-end">
                <span className="font-mono text-[9px] tracking-[0.1em] text-accent">
                  {step.num}
                </span>
              </div>

            </div>
          </div>
        )
      })}
    </div>
  )
}
