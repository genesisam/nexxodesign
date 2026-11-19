'use client'

import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { PixelDistortion } from './PixelDistortion'
import { coverFor, type CoverRatio } from '@/lib/covers'

gsap.registerPlugin(ScrollTrigger, CustomEase)

const ease = (name: string, path: string) => CustomEase.get(name) || CustomEase.create(name, path)

export type ShowcaseProject = {
  _id: string
  title: string
  slug: { current: string }
  metric: string
  services: string[]
  coverUrl?: string
}

/**
 * The home's work grid, laid out as a 12-column editorial spread:
 *
 *   row 1  ███████ 7        ████ 4 (bottom-aligned, ends on col 12)
 *   row 2     ██████████ 10 (cols 2–11)
 *   row 3  ████ 4 (top)     ███████ 7 (ends on col 12)
 *
 * Each slot fixes the image ratio and the width the description may run to,
 * so the cards keep their rhythm whatever the copy says.
 */
/** `cover` picks the composed cover whose framing suits the slot. */
type Slot = { col: string; ratio: string; desc: string; cover: CoverRatio }

const SLOTS: Slot[] = [
  {
    col:   'col-span-7 max-lg:col-span-6 max-sm:col-span-8',
    ratio: 'aspect-[656/521]',
    cover: '16x9',
    desc:  'max-w-[28vw] max-lg:max-w-[28vw] max-sm:max-w-[70vw]',
  },
  {
    col:   'col-span-4 col-end-13 mt-auto h-fit max-lg:col-span-6 max-lg:col-end-9 max-sm:col-span-8',
    ratio: 'aspect-[367/382]',
    cover: '1x1',
    desc:  'max-w-[27.8vw] max-lg:max-w-[37vw] max-sm:max-w-[90vw]',
  },
  {
    col:   'col-span-10 col-start-2 max-lg:col-span-12 max-sm:col-span-12',
    ratio: 'aspect-[948/518]',
    cover: '16x9',
    desc:  'max-w-[41.67vw] max-lg:max-w-[60vw] max-sm:max-w-[100vw]',
  },
  {
    col:   'col-span-4 h-fit max-lg:col-span-6 max-sm:col-span-8',
    ratio: 'aspect-[367/382]',
    cover: '1x1',
    desc:  'max-w-[23.95vw] max-lg:max-w-[45vw] max-sm:max-w-[90vw]',
  },
  {
    col:   'col-span-7 col-end-13 max-lg:col-span-6 max-lg:col-end-9 max-sm:col-span-8',
    ratio: 'aspect-[656/521]',
    cover: '16x9',
    desc:  'max-w-[24vw] max-lg:max-w-[28vw] max-sm:max-w-[70vw]',
  },
]

const HOVER_LABEL = 'Ver proyecto'

/** One word per mask, so each can rise out of its own line box. */
function SplitWords({ text, className }: { text: string; className: string }) {
  return (
    <>
      {text.split(/\s+/).filter(Boolean).map((word, i) => (
        <span key={i} className="relative inline-block overflow-hidden align-top">
          <span className={`block ${className}`}>{word}&nbsp;</span>
        </span>
      ))}
    </>
  )
}

function Arrow() {
  return (
    <svg className="h-full w-full" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path d="M2.48676 7.09893L2.47624 7.08841L5.75973 3.79718L2.47624 0.505641L2.48676 0.495117L4.13315 0.495117L7.42871 3.79687L4.13315 7.09831L2.48676 7.09893Z" fill="currentColor" />
      <path d="M0.000152588 3.24707L5.77783 3.24707L5.77783 4.34745L0.00015254 4.34745L0.000152588 3.24707Z" fill="currentColor" />
    </svg>
  )
}

/** "Ver proyecto": the white box opens, the arrow turns, the letters slide in. */
const ViewLink = memo(function ViewLink({ active }: { active: boolean }) {
  const box     = useRef<HTMLSpanElement>(null)
  const arrow   = useRef<HTMLSpanElement>(null)
  const letters = useRef<HTMLSpanElement[]>([])
  const tl      = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    ease('natureSway', 'M0,0 C0.08,0.494 0.14,1 1,1')
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true, defaults: { ease: 'natureSway', duration: 0.4 } })
        .to(box.current, { width: '1.38vw', scale: 1, marginRight: '0.83vw' }, 0)
        .to(arrow.current, { x: 0, rotate: 0 }, 0)
        .to(letters.current, { x: 0, opacity: 1, stagger: 0.01, duration: 0.3 }, 0)
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (active) tl.current?.play()
    else tl.current?.reverse()
  }, [active])

  return (
    <div className="flex items-center py-[0.39vh]">
      <span ref={box} className="grid h-[1.38vw] w-0 scale-0 place-items-center overflow-hidden bg-white">
        <span ref={arrow} className="block aspect-square h-[0.52vw] -translate-x-[0.83vw] rotate-180 text-black">
          <Arrow />
        </span>
      </span>
      <span className="flex">
        {Array.from(HOVER_LABEL).map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span
              ref={el => { if (el) letters.current[i] = el }}
              className="inline-block font-mono uppercase text-paper text-[1.1vw] leading-none -translate-x-[110%] opacity-0 max-lg:text-[1.56vw]"
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          </span>
        ))}
      </span>
    </div>
  )
})

type CardProps = {
  project: ShowcaseProject
  slot: Slot
  hovered: string | null
  onHover: (id: string | null) => void
}

const Card = memo(function Card({ project, slot, hovered, onHover }: CardProps) {
  const card    = useRef<HTMLAnchorElement>(null)
  const frame   = useRef<HTMLDivElement>(null)
  const pointer = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(false)
  // The composed cinematic cover first; the CMS cover only for projects without one.
  const src = coverFor(project.slug.current, slot.cover) ?? project.coverUrl

  // The pointer square collapses while the card is hovered.
  useEffect(() => {
    if (!pointer.current) return
    const t = gsap.to(pointer.current, {
      marginRight: active ? 0 : '0.97vw',
      width:       active ? 0 : '0.55vw',
      height:      active ? 0 : '0.55vw',
      opacity:     active ? 0 : 1,
      duration:    active ? 0.6 : 0.4,
      ease:        active ? 'expo.out' : 'power2.out',
    })
    return () => { t.kill() }
  }, [active])

  // The hovered card grows a touch; every other one sinks back, blurred and dark.
  useLayoutEffect(() => {
    if (!card.current) return
    const other = hovered !== null && hovered !== project._id
    const t = gsap.to(card.current, {
      opacity: other ? 0.5 : 1,
      filter:  other ? 'blur(4px) brightness(0.4)' : 'blur(0px) brightness(1)',
      scale:   hovered === project._id ? 1.02 : other ? 0.98 : 1,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: true,
    })
    return () => { t.kill() }
  }, [hovered, project._id])

  return (
    <Link
      ref={card}
      href={`/proyectos/${project.slug.current}`}
      aria-label={project.title}
      onMouseEnter={() => { setActive(true); onHover(project._id) }}
      onMouseLeave={() => { setActive(false); onHover(null) }}
      className={`ws-card group/main flex cursor-pointer flex-col gap-[1.67vw] max-lg:gap-[3.07vw] max-sm:gap-[3.48vh] ${slot.col}`}
    >
      {/* ── Image ── */}
      <div className="relative w-full overflow-hidden">
        <div ref={frame} className={`relative w-full overflow-hidden ${slot.ratio}`}>
          <div className="ws-parallax absolute inset-x-0 -top-[5%] h-[110%] will-change-transform">
            <div className="ws-reveal absolute inset-0">
              {src ? (
                <PixelDistortion src={src} frameRef={frame} />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-line">
                  <span className="font-display text-paper/[0.06] text-[12vw] leading-none select-none">
                    {project.title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags — glass chips, bottom-right */}
        <div className="pointer-events-none absolute right-0 bottom-0 m-[1.39vw] flex flex-wrap justify-end gap-[0.41vw] max-sm:hidden">
          {project.services.map(s => (
            <span
              key={s}
              /* bg-black/55 rather than /25: the chip is glass over the cover,
                 so at 25% the label's contrast was the cover's contrast. The
                 blur keeps the glass reading; the extra tint is what makes the
                 text legible on a light frame. */
              className="ws-tag font-mono uppercase text-paper text-[0.69vw] leading-none tracking-[0.02em] border border-white/5 bg-black/55 p-[0.69vw] backdrop-blur-md max-lg:p-[0.97vw] max-lg:text-[0.97vw]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ── Info ── */}
      <div className="ws-info relative flex w-full max-sm:flex-col max-sm:gap-[2.5vw]">
        <span
          ref={pointer}
          aria-hidden
          className="ws-pointer my-[1.5vh] mr-[0.97vw] size-[0.55vw] shrink-0 border border-[#303030] max-sm:hidden"
        />

        <div className="flex flex-col gap-[0.73vw] max-lg:gap-[1.02vw] max-sm:gap-[3.48vw]">
          <h3 className="font-display font-normal text-paper text-[1.67vw] leading-tight tracking-[-0.01em] max-lg:text-[2.34vw] max-sm:text-[5.97vw]">
            <SplitWords text={project.title} className="ws-word" />
          </h3>
          {project.metric && (
            <p className={`font-mono uppercase text-smoke text-[0.97vw] leading-[1.3] max-lg:text-[1.36vw] max-sm:text-[3.48vw] ${slot.desc}`}>
              <SplitWords text={project.metric} className="ws-word-fast" />
            </p>
          )}
        </div>

        <div aria-hidden className="absolute top-0 right-0 max-sm:hidden">
          <ViewLink active={active} />
        </div>
      </div>
    </Link>
  )
})

/**
 * The "Ver" tag that trails the mouse while a card is hovered: arrow tile +
 * label, offset down-right of the pointer, catching up over 0.8s.
 * Portalled to <body> so no transformed or filtered ancestor can trap it.
 */
export function ProjectCursor({ visible }: { visible: boolean }) {
  const el = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useLayoutEffect(() => {
    if (el.current) gsap.set(el.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0, visibility: 'hidden' })
  }, [mounted])

  useEffect(() => {
    const t = el.current
    if (!t) return
    const onMove = (e: MouseEvent) => {
      gsap.to(t, { x: e.clientX, y: e.clientY, duration: 0.8, delay: 0.05, ease: 'power3.out', overwrite: 'auto' })
    }
    window.addEventListener('mousemove', onMove)
    if (visible) {
      gsap.to(t, { scale: 1, opacity: 1, visibility: 'visible', duration: 0.4, ease: 'back.out(1.5)', overwrite: true })
    } else {
      gsap.timeline({ overwrite: true })
        .to(t, { scale: 1, duration: 0.15 })
        .to(t, { scale: 0, opacity: 0, duration: 0.45, ease: 'power3.in', onComplete: () => { gsap.set(t, { visibility: 'hidden' }) } })
    }
    return () => window.removeEventListener('mousemove', onMove)
  }, [visible, mounted])

  if (!mounted) return null
  return createPortal(
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed top-[4.68vh] left-[4.44vw] z-[1000] max-lg:hidden"
      style={{ visibility: 'hidden', willChange: 'transform' }}
    >
      <div className="flex items-stretch gap-1">
        <div className="grid aspect-square h-[1.94vw] place-items-center bg-[#F5F5F5] text-[#2B2B2B]">
          <div className="aspect-square h-[0.76vw] -rotate-45">
            <Arrow />
          </div>
        </div>
        <div className="flex items-center bg-[#F5F5F5] px-[0.83vw] py-[0.41vw] font-mono text-[0.83vw] font-medium uppercase leading-[1.25] text-[#2B2B2B]">
          <p className="leading-none">Ver</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}

type Props = {
  projects: ShowcaseProject[]
  headline: string
  cta: string
  ctaHref: string
}

export function WorkShowcase({ projects, headline, cta, ctaHref }: Props) {
  const root   = useRef<HTMLElement>(null)
  const header = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const five = projects.slice(0, 5)

  // The header dims with the other cards while one is hovered.
  useLayoutEffect(() => {
    if (!header.current) return
    const t = gsap.to(header.current, {
      opacity: hovered ? 0.5 : 1,
      filter:  hovered ? 'blur(4px) brightness(0.4)' : 'blur(0px) brightness(1)',
      duration: 0.6, ease: 'power2.out', overwrite: true,
    })
    return () => { t.kill() }
  }, [hovered])

  useEffect(() => {
    const el = root.current
    if (!el) return
    ease('natureSway',   'M0,0 C0.08,0.494 0.14,1 1,1')
    ease('premiumGlide', 'M0,0 C0.1,0.4 0.15,1 1,1')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.ws-card').forEach(card => {
        const parallax = card.querySelector<HTMLElement>('.ws-parallax')
        const reveal   = card.querySelector<HTMLElement>('.ws-reveal')
        const info     = card.querySelector<HTMLElement>('.ws-info')

        // Parallax, scrubbed: -10% → +10% of the 110%-tall layer.
        if (parallax) {
          gsap.set(parallax, { scale: 1.025 })
          ScrollTrigger.create({
            trigger: card, start: 'top bottom', end: 'bottom top', scrub: true,
            onUpdate: st => gsap.set(parallax, { yPercent: -10 + 20 * st.progress }),
          })
        }

        if (reduce) return

        // Image: opens from the bottom-left corner while it settles from 1.3×.
        if (reveal) {
          gsap.set(reveal, { scale: 1.3, transformOrigin: 'left bottom', clipPath: 'inset(100% 100% 0% 0%)' })
          ScrollTrigger.create({
            trigger: card, start: 'top 85%', once: true,
            onEnter: () => gsap.to(reveal, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.7, ease: 'power4.out' }),
          })
        }

        // Text, pointer and tags.
        const words = card.querySelectorAll('.ws-word')
        const fast  = card.querySelectorAll('.ws-word-fast')
        const tags  = card.querySelectorAll('.ws-tag')
        const ptr   = card.querySelectorAll('.ws-pointer')
        gsap.set([...words, ...fast], { yPercent: 100, opacity: 0.1 })
        gsap.set(tags, { y: '1.95vh', rotateZ: -2, opacity: 0, filter: 'blur(4px)' })

        gsap.timeline({ scrollTrigger: { trigger: info ?? card, start: 'top 95%', toggleActions: 'play none none none' } })
          .fromTo(ptr, { scale: 0 }, { scale: 1, duration: 0.7, ease: 'natureSway' }, 'reveal')
          .to(words, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'natureSway' }, 'reveal')
          .to(fast,  { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.02, ease: 'natureSway' }, 0.1)
          .to(tags,  { y: 0, opacity: 1, rotateZ: 0, filter: 'blur(0px)', duration: 0.65, stagger: 0.05, ease: 'premiumGlide' }, 0.2)
      })

      if (!reduce) {
        gsap.from('.ws-see-all', {
          y: '2.34vh', rotateZ: -2, opacity: 0, filter: 'blur(4px)',
          duration: 0.8, ease: 'natureSway',
          scrollTrigger: { trigger: '.ws-header', start: 'top 65%', toggleActions: 'play none none none' },
        })
        gsap.from('.ws-see-all-end', {
          y: '2.34vh', rotateZ: -2, opacity: 0, filter: 'blur(4px)',
          duration: 0.8, ease: 'natureSway',
          scrollTrigger: { trigger: '.ws-see-all-end', start: 'top 95%', toggleActions: 'play none none none' },
        })
      }
    }, el)

    return () => ctx.revert()
  }, [])

  const card = (i: number) =>
    five[i] && <Card project={five[i]} slot={SLOTS[i]} hovered={hovered} onHover={setHovered} />

  return (
    <section
      ref={root}
      aria-label={headline}
      className="text-paper px-[5.55vw] pb-[11.67vh] max-lg:px-[4.1vw] max-lg:pb-[8vh] max-sm:px-[5.97vw]"
    >
      <div ref={header} className="ws-header flex items-end justify-between gap-6 pt-[16.6vh] max-lg:pt-[11.7vh] max-sm:pt-[6.86vh]">
        <h2 className="font-display font-semibold text-paper leading-[0.9] tracking-[-0.025em] max-w-[60%]
                       text-[clamp(2rem,4.2vw,4.5rem)] max-sm:max-w-none max-sm:text-[13.5vw]">
          {headline}
        </h2>
        {/* On phones the link moves under the last project instead. */}
        <Link href={ctaHref} className="ws-see-all group/see mb-[1.17vh] w-fit shrink-0 font-mono uppercase text-paper text-[0.97vw] max-lg:text-[1.95vw] max-sm:hidden">
          <span className="flex items-center gap-[0.4vw]">{cta}</span>
          <span className="block h-px w-full translate-y-[0.39vh] origin-right bg-paper transition-transform duration-500 ease-out-expo group-hover/see:scale-x-0" />
        </Link>
      </div>

      <div className="flex flex-col gap-[13.67vh] pt-[11.7vh] max-lg:gap-[4.7vh] max-lg:pt-[8.56vh]">
        <div className="grid grid-cols-12 gap-[1.39vw] max-lg:grid-cols-8 max-lg:gap-[4.7vh]">
          {card(0)}
          {card(1)}
        </div>
        {five[2] && <div className="grid grid-cols-12">{card(2)}</div>}
        <div className="grid grid-cols-12 gap-[1.39vw] max-lg:grid-cols-8 max-lg:gap-[4.7vh]">
          {card(3)}
          {card(4)}
        </div>
      </div>

      <Link href={ctaHref} className="ws-see-all-end group/see mt-[6vh] block w-fit font-mono text-[3.48vw] uppercase text-paper sm:hidden">
        <span className="flex items-center gap-[1.49vw]">{cta}</span>
        <span className="block h-px w-full translate-y-[0.39vh] origin-right bg-paper" />
      </Link>

      <ProjectCursor visible={hovered !== null} />
    </section>
  )
}
