'use client'

import { useState, useEffect, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/lib/navigation'
import { CONTACT_CALENDLY } from '@/lib/constants'
import { NexxoLogo } from '@/components/ui/NexxoLogo'
import { useLenis } from '@/components/motion/SmoothScrollProvider'

const NAV_KEYS = [
  { href: '/proyectos', key: 'proyectos' },
  { href: '/nosotros', key: 'estudio'   },
  { href: '/journal',  key: 'journal'   },
  { href: '/contact',  key: 'contacto'  },
] as const

export function Nav() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [, startTransition]     = useTransition()
  const pathname              = usePathname()
  const router                = useRouter()
  const locale                = useLocale()
  const lenis                 = useLenis()
  const t                     = useTranslations('nav')
  const isHome                = pathname === '/'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => { setOpen(false) }, [pathname])

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

  function switchLocale() {
    const next = locale === 'es' ? 'en' : 'es'
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className={[
          'fixed top-0 left-0 right-0 z-50 pointer-events-none',
          'transition-[background-color,backdrop-filter] duration-300',
          // The blend trick only works while the bar is transparent — once the
          // backdrop is on it would invert against our own surface.
          open || isHome || scrolled ? '' : 'md:mix-blend-difference',
        ].join(' ')}
        // Inline rather than a utility class: the surface is state-driven and
        // must not depend on the class being present in the generated CSS.
        style={scrolled ? {
          backgroundColor: 'rgb(var(--color-ink-rgb) / 0.85)',
          backdropFilter:  'blur(12px)',
          borderBottom:    '1px solid rgb(var(--color-line-rgb) / 1)',
        } : undefined}
      >
        <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 h-16 md:h-20 pointer-events-auto ${isHome ? 'md:h-24' : ''}`}>

          <Link
            href="/"
            aria-label={t('ariaLogo')}
            className="text-paper"
            onClick={() => setOpen(false)}
          >
            <NexxoLogo className="h-6 md:h-7 w-auto" />
          </Link>

          <ul className={`hidden md:flex items-center ${isHome ? 'gap-6 rounded-xl border border-paper/15 bg-ink/65 px-5 py-3 shadow-sm backdrop-blur-md' : 'gap-10'}`} role="list">
            {NAV_KEYS.map(({ href, key }) => {
              const isActive =
                pathname === href || pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper transition-opacity duration-200"
                    style={{ opacity: isActive ? 1 : 0.7 }}
                  >
                    {t(key)}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="hidden md:flex items-center gap-5">
            {/* Selector de idioma */}
            <button
              onClick={switchLocale}
              className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/50 hover:text-paper transition-colors duration-200"
              aria-label={`Switch to ${t('switchLang')}`}
            >
              {t('switchLang')}
            </button>

            <Link
              href="/contact"
              className={`inline-flex items-center font-mono text-[10px] uppercase tracking-[0.22em] px-5 py-2.5 transition-colors duration-200 ${isHome ? 'rounded-xl bg-paper text-ink hover:bg-paper/80' : 'text-paper border border-paper/60 hover:border-paper'}`}
            >
              {t('cotiza')}
            </Link>
          </div>

        </div>
      </nav>

      {/* Botón hamburguesa */}
      <button
        className="md:hidden fixed top-0 right-0 z-[60] h-16 w-16 flex items-center justify-center"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
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
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
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
          {/* Selector de idioma mobile */}
          <button
            onClick={() => { switchLocale(); setOpen(false) }}
            className="flex items-center justify-center font-mono text-xs uppercase tracking-widest border border-line text-smoke/60 w-full py-3"
          >
            {t('switchLang')} — {locale === 'es' ? 'English' : 'Español'}
          </button>

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
