'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/navigation'
import { CONTACT_CALENDLY } from '@/lib/constants'
import { NexxoLogo } from '@/components/ui/NexxoLogo'
import { useLenis } from '@/components/motion/SmoothScrollProvider'

const NAV_KEYS = [
  { href: '/proyectos', key: 'proyectos' },
  { href: '/nosotros', key: 'estudio'   },
  { href: '/journal',  key: 'journal'   },
  { href: '/tienda',   key: 'tienda'    },
  { href: '/contact',  key: 'contacto'  },
] as const

export function Nav() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname              = usePathname()
  const lenis                 = useLenis()
  const t                     = useTranslations('nav')
  const panel                 = useRef<HTMLDivElement>(null)
  const toggle                = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => { setOpen(false) }, [pathname])

  /**
   * The fullscreen menu stays mounted so it can fade, which used to mean its
   * seven links were tab stops on every page — including desktop, where the
   * panel is invisible. Tabbing past the header sent focus into nothing: no
   * outline anywhere on screen for seven presses. `inert` on the closed panel
   * takes it out of the tab order and out of the accessibility tree while the
   * opacity transition keeps working.
   *
   * The rest is what `aria-modal` promises and has to be implemented: focus
   * goes into the panel when it opens, Tab cycles inside it, Escape closes it,
   * and focus returns to the button that opened it.
   */
  useEffect(() => {
    if (!open) return
    const box = panel.current
    if (!box) return

    const focusables = () =>
      Array.from(box.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))

    focusables()[0]?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return

      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last  = items[items.length - 1]
      const active = document.activeElement

      // Wrap at both ends, and pull focus back in if it has escaped the panel.
      if (event.shiftKey && (active === first || !box.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !box.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      // Only reclaim focus if it is still inside the panel we are closing —
      // a click on a nav link navigates and should not yank focus backwards.
      if (box.contains(document.activeElement)) toggle.current?.focus()
    }
  }, [open])

  // Once the page has scrolled at all, the bar needs a surface of its own:
  // over article text `mix-blend-difference` inverts per-pixel and the links
  // become unreadable. Below the threshold we keep it fully transparent so the
  // hero is untouched.
  //
  // Lenis swallows the native scroll event — the page moves and window.scrollY
  // updates, but no listener fires — so we subscribe to Lenis when it is
  // running and fall back to the window event when it is not (Lenis opts out
  // entirely under prefers-reduced-motion).
  useEffect(() => {
    const update = (y: number) => setScrolled(y > 24)
    update(window.scrollY)

    if (lenis) {
      const onLenisScroll = ({ scroll }: { scroll: number }) => update(scroll)
      lenis.on('scroll', onLenisScroll)
      return () => { lenis.off('scroll', onLenisScroll) }
    }

    const onScroll = () => update(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lenis])


  return (
    <>
      <nav
        aria-label="Navegación principal"
        // `mix-blend-difference` used to carry legibility on inner pages, where
        // the links sat bare over the content. Now the pill gives them a
        // surface of their own on every page, and blending would invert that
        // surface against whatever scrolled behind it.
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-[background-color,backdrop-filter] duration-300"
        // Inline rather than a utility class: the surface is state-driven and
        // must not depend on the class being present in the generated CSS.
        style={scrolled ? {
          backgroundColor: 'rgb(var(--color-ink-rgb) / 0.85)',
          backdropFilter:  'blur(12px)',
          borderBottom:    '1px solid rgb(var(--color-line-rgb) / 1)',
        } : undefined}
      >
        {/* One header everywhere. The bar used to grow to h-24 on the home,
            wrap the links in a blurred pill there and nowhere else, and flip
            the CTA between solid and outline — three separate identities for
            the same component. */}
        <div className="flex items-center justify-between gutter-x h-16 md:h-20 pointer-events-auto">

          <Link
            href="/"
            aria-label={t('ariaLogo')}
            className="text-paper"
            onClick={() => setOpen(false)}
          >
            <NexxoLogo className="h-6 md:h-7 w-auto" />
          </Link>

          <ul className="hidden md:flex items-center gap-6 rounded-xl border border-paper/15 bg-ink/65 px-5 py-3 shadow-sm backdrop-blur-md" role="list">
            {NAV_KEYS.map(({ href, key }) => {
              const isActive =
                pathname === href || pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group relative block font-mono text-[10px] uppercase tracking-[0.22em] py-0.5
                                transition-colors duration-200 ${isActive ? 'text-paper' : 'text-paper/70 hover:text-paper'}`}
                  >
                    {t(key)}
                    {/* Rule wipes in from the left on hover and stays put on the
                        current page, so the active item is legible without
                        relying on a 30% opacity difference alone. */}
                    <span
                      aria-hidden
                      className={`absolute left-0 -bottom-0.5 h-px bg-accent origin-left
                                  transition-transform duration-300 ease-out w-full
                                  ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/contact"
              className="group relative inline-flex items-center overflow-hidden rounded-xl
                         bg-paper text-ink font-mono text-[10px] uppercase tracking-[0.22em]
                         px-5 py-2.5 transition-transform duration-300 ease-out
                         hover:-translate-y-0.5 active:translate-y-0
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {/* Accent floods up from the bottom instead of the fill simply
                  dimming. The label sits above it and flips to paper. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-accent origin-bottom scale-y-0
                           transition-transform duration-300 ease-out group-hover:scale-y-100"
              />
              <span className="relative transition-colors duration-300 group-hover:text-paper">
                {t('cotiza')}
              </span>
            </Link>
          </div>

        </div>
      </nav>

      {/* Botón hamburguesa */}
      <button
        ref={toggle}
        type="button"
        className="md:hidden fixed top-0 right-0 z-[60] h-16 w-16 flex items-center justify-center"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="menu-movil"
        aria-label={open ? t('cerrarMenu') : t('abrirMenu')}
      >
        <span className="sr-only">{open ? t('cerrarMenu') : t('abrirMenu')}</span>
        <div className="relative w-6 h-[18px] flex flex-col justify-between" aria-hidden>
          <span
            className="block h-[1.5px] w-full bg-paper origin-center transition-all duration-300"
            style={{ transform: open ? 'translateY(8px) rotate(45deg)' : 'none' }}
          />
          <span
            className="block h-[1.5px] bg-paper transition-all duration-200"
            style={{ width: open ? '0%' : '100%', opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-[1.5px] w-full bg-paper origin-center transition-all duration-300"
            style={{ transform: open ? 'translateY(-8px) rotate(-45deg)' : 'none' }}
          />
        </div>
      </button>

      {/* Menú fullscreen mobile */}
      <div
        ref={panel}
        id="menu-movil"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        // Closed: out of the tab order and out of the accessibility tree, while
        // still able to fade. `hidden` would kill the transition; `inert` does
        // not. Supported in every browser this site targets.
        inert={!open}
        className={[
          'fixed inset-0 z-40 bg-ink flex flex-col justify-between px-6 pt-28 pb-12',
          'transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <ul className="space-y-1" role="list">
          {NAV_KEYS.map(({ href, key }) => {
            const isActive =
              pathname === href || pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className="block font-display font-semibold text-paper leading-[1] tracking-tight hover:text-smoke transition-colors duration-150"
                  style={{ fontSize: 'clamp(2.8rem, 13vw, 5rem)' }}
                  onClick={() => setOpen(false)}
                >
                  {t(key)}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="space-y-3">
          <Link
            href="/contact"
            className="flex items-center justify-center font-mono text-xs uppercase tracking-widest bg-accent text-paper w-full py-4"
            onClick={() => setOpen(false)}
          >
            {t('cotizaProyecto')}
          </Link>
          <a
            href={CONTACT_CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center font-mono text-xs uppercase tracking-widest border border-line text-smoke w-full py-4"
            onClick={() => setOpen(false)}
          >
            {t('agendarLlamada')}
          </a>
        </div>
      </div>
    </>
  )
}
