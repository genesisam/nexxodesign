'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { WorkStage, type StageChange } from './WorkStage'
import { ProjectCursor } from './WorkShowcase'
import { piecesFor } from '@/lib/project-pieces'
import { inkFor, toneFor } from '@/lib/project-tones'
import { lineFor } from '@/lib/project-lines'

export type Vertical = 'SaaS' | 'Fintech' | 'Web' | 'Branding' | 'IA'

export type Project = {
  _id:        string
  title:      string
  slug:       { current: string }
  vertical:   Vertical
  cover:      string | null
  logo:       string | null
  thumbnail:  string | null
  thumbVideo: string | null
  blurb:      string
  year:       number
  client?:    string
}

/**
 * /proyectos as an index: every case is one row of large type, and the image
 * of whichever row is active sits pinned to the left.
 *
 * On desktop the section is taller than the screen and its content is sticky,
 * so scrolling walks the active row down the list (half a screen per project)
 * while nothing moves. Hovering takes over from scrolling: the row under the
 * pointer fills with its project's tone, the others fade, the image climbs in
 * as a staircase of blocks, and moving across the row steps through that
 * project's images. The "Ver" tag trails the pointer over the rows and the
 * image.
 *
 * At most PAGE rows are listed at a time on desktop, like the reference; with
 * more projects than that, two arrows under the list page through them and
 * the scroll walks the rows of the current page only.
 *
 * Below 768px there is no pin and no paging: each row shows its wide cover under the name
 * instead.
 */

const SCROLL_STEP = 0.5 // of the viewport, per project
/** Rows shown at once on desktop; the arrows under the list page through the rest. */
const PAGE = 5

type Active = { index: number; piece: number; change: StageChange }

export function WorkIndex({ projects = [] }: { projects?: Project[] }) {
  const t = useTranslations('work')

  const rows = useMemo(() => projects.map(p => ({
    ...p,
    tone:   toneFor(p.slug.current),
    pieces: piecesFor(p.slug.current, p.cover),
  })).filter(p => p.pieces.length > 0), [projects])

  const section = useRef<HTMLElement>(null)
  const list    = useRef<HTMLUListElement>(null)
  const stage   = useRef<HTMLDivElement>(null)

  const [active, setActive]   = useState<Active>({ index: 0, piece: 0, change: 'instant' })
  const [peeking, setPeeking] = useState(false)
  const [page, setPage]       = useState(0)
  const [onStage, setOnStage] = useState(false)
  const lastScroll = useRef(0)
  const activeRef  = useRef(active)
  activeRef.current = active
  const pageRef = useRef(page)
  pageRef.current = page
  const pages = Math.ceil(rows.length / PAGE)

  const activate = useCallback((index: number, piece = 0, change: StageChange = 'steps') => {
    const cur = activeRef.current
    if (cur.index === index && cur.piece === piece) return
    setActive({ index, piece, change: cur.index === index ? 'wipe' : change })
  }, [])

  // ── Scroll walks the active row ───────────────────────────────────────────
  useEffect(() => {
    const el = section.current
    if (!el || !rows.length) return
    const mq = window.matchMedia('(min-width: 768px)')
    let raf = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    const update = () => {
      raf = 0
      if (!mq.matches) return
      const top = el.getBoundingClientRect().top + window.scrollY
      const seg = window.innerHeight * SCROLL_STEP
      const first = pageRef.current * PAGE
      const last  = Math.min(rows.length, first + PAGE) - 1
      const i = Math.max(first, Math.min(last, first + Math.round((window.scrollY - top) / seg)))
      if (i === activeRef.current.index) return
      clearTimeout(timer)
      timer = setTimeout(() => { setPeeking(false); activate(i) }, 120)
    }
    const onScroll = () => {
      lastScroll.current = performance.now()
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [rows.length, activate])

  // ── Paging ──────────────────────────────────────────────────────────────
  const goTo = (next: number) => {
    const p = (next + pages) % pages
    if (p === pageRef.current) return
    setPage(p)
    setPeeking(false)
    activate(p * PAGE)
  }

  // The new page's names rise into their rows, one after another.
  const firstPaint = useRef(true)
  useEffect(() => {
    if (firstPaint.current) { firstPaint.current = false; return }
    const ul = list.current
    if (!ul || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const names = ul.querySelectorAll('.wl-item:not(.is-off) .wl-name, .wl-item:not(.is-off) .wl-sector')
    gsap.fromTo(names, { yPercent: 60, opacity: 0 }, {
      yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.04, clearProps: 'transform,opacity',
    })
  }, [page])

  // A row that slides under a still pointer while scrolling is not a hover.
  const isHover = (e: React.PointerEvent) =>
    e.pointerType === 'mouse' && performance.now() - lastScroll.current > 200

  const onRowEnter = (i: number) => (e: React.PointerEvent) => {
    if (!isHover(e)) return
    setPeeking(true)
    if (activeRef.current.index !== i) activate(i)
  }

  const onRowMove = (i: number) => (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!isHover(e)) return
    setPeeking(true)
    if (activeRef.current.index !== i) return activate(i)
    const r = e.currentTarget.getBoundingClientRect()
    const n = rows[i].pieces.length
    const piece = Math.min(n - 1, Math.floor(Math.max(0, (e.clientX - r.left) / r.width) * n))
    activate(i, piece, 'wipe')
  }

  if (!rows.length) {
    return (
      <main className="min-h-screen bg-ink pt-40 gutter-x">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke/70">{t('empty')}</p>
      </main>
    )
  }

  const current = rows[active.index]

  return (
    <main className="bg-ink text-paper">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="wl-hero gutter-x pt-32 md:pt-40 pb-16 md:pb-24">
        <h1 className="font-display font-medium leading-[0.92] tracking-[-0.055em] text-paper text-portada">
          {t('hero.title')}
        </h1>
        <div className="mt-6 grid grid-cols-12 md:mt-8">
          <p className="col-span-12 max-w-[34ch] font-body text-[clamp(1rem,1.35vw,1.4rem)] leading-snug text-smoke
                        md:col-span-5 md:col-start-6">
            {t('hero.lead')}
          </p>
        </div>
      </section>

      {/* ── Index ────────────────────────────────────────────────────────── */}
      <section
        ref={section}
        aria-label={t('meta.title')}
        className={`wl ${peeking ? 'is-peeking' : ''}`}
        style={{ '--wl-n': Math.min(PAGE, rows.length) } as React.CSSProperties}
      >
        <div className="wl-pin gutter-x">
          <div className="wl-stage" aria-hidden>
            {/* The image opens the active case too, with the same "Ver" tag.
                Out of the tab order: the row link already carries it. */}
            <Link
              href={`/proyectos/${current.slug.current}`}
              data-tone={current.tone}
              tabIndex={-1}
              className="block"
              onPointerEnter={e => e.pointerType === 'mouse' && setOnStage(true)}
              onPointerLeave={() => setOnStage(false)}
            >
              <div ref={stage} className="wl-frame">
                <WorkStage src={current.pieces[active.piece] ?? current.pieces[0]} change={active.change} />
              </div>
            </Link>
            <p className="wl-caption">
              <span>{lineFor(current.slug.current) ?? current.blurb}</span>
              <span>{current.year}</span>
            </p>
          </div>

          <div className="wl-side">
          <ul ref={list} className="wl-list" onPointerLeave={() => setPeeking(false)}>
            {rows.map((p, i) => (
              <li key={p._id} className={`wl-item ${Math.floor(i / PAGE) === page ? '' : 'is-off'}`}>
                <Link
                  href={`/proyectos/${p.slug.current}`}
                  data-tone={p.tone}
                  className={`wl-row ${i === active.index ? 'is-on' : ''}`}
                  style={{ '--row-tone': p.tone, '--row-ink': inkFor(p.tone) } as React.CSSProperties}
                  onPointerEnter={onRowEnter(i)}
                  onPointerMove={onRowMove(i)}
                  onFocus={() => activate(i)}
                >
                  <h2 className="wl-name">{p.title}</h2>
                  <p className="wl-sector">{p.client && p.client !== p.title ? p.client : p.vertical}</p>
                  <p className="wl-year">{p.year}</p>
                  <span className="wl-pieces" aria-hidden>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/_next/image?url=${encodeURIComponent(p.pieces[p.pieces.length - 1])}&w=828&q=75`}
                         alt="" loading="lazy" decoding="async" draggable={false} />
                  </span>
                </Link>
              </li>
            ))}
            {/* Empty slots keep a short last page as tall as a full one, so the
                arrows stay put under the pointer. */}
            {pages > 1 && Array.from({ length: pages * PAGE - rows.length }, (_, i) => (
              page === pages - 1 && (
                <li key={`ghost-${i}`} className="wl-item wl-ghost" aria-hidden>
                  <div className="wl-row"><span className="wl-name">&nbsp;</span></div>
                </li>
              )
            ))}
          </ul>

          {pages > 1 && (
            <nav className="wl-pager" aria-label={t('pager.aria')}>
              <span className="wl-count">
                {String(page + 1).padStart(2, '0')} / {String(pages).padStart(2, '0')}
              </span>
              <button type="button" onClick={() => goTo(page - 1)} aria-label={t('pager.prev')}>
                <PagerArrow flip />
              </button>
              <button type="button" onClick={() => goTo(page + 1)} aria-label={t('pager.next')}>
                <PagerArrow />
              </button>
            </nav>
          )}
          </div>
        </div>
      </section>

      <ProjectCursor visible={peeking || onStage} />
    </main>
  )
}

function PagerArrow({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  )
}
