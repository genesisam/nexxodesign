'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import { useActionState } from 'react'
import { subscribeNewsletter } from '@/app/[locale]/(site)/journal/actions'
import { SOCIAL_INSTAGRAM, SOCIAL_BEHANCE, SOCIAL_LINKEDIN } from '@/lib/constants'

function IconInstagram() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function IconBehance() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M1.5 4.5H9c2.5 0 4 1.5 4 3.5 0 1.3-.7 2.4-1.8 3 1.5.5 2.5 1.8 2.5 3.5 0 2.5-1.8 4.5-5 4.5H1.5V4.5zm3 3V10h4c.8 0 1.5-.7 1.5-1.5S9.3 7.5 8.5 7.5H4.5zm0 6v3H8c1.1 0 2-.9 2-2s-.9-2-2-2H4.5z"/>
      <path d="M17.5 8c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.2 0 4.2-1.5 4.8-3.5h-2.6c-.4.9-1.2 1.5-2.2 1.5-1.4 0-2.4-1-2.7-2.3H23c0-.2.1-.5.1-.7 0-2.8-2.3-5-5.6-5zm-2.7 4c.3-1.2 1.3-2 2.7-2s2.4.8 2.7 2h-5.4z"/>
      <rect x="14" y="5.5" width="6" height="1.5" rx=".75"/>
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

const SOCIALS = [
  { label: 'Instagram', href: SOCIAL_INSTAGRAM, Icon: IconInstagram },
  { label: 'Behance',   href: SOCIAL_BEHANCE,   Icon: IconBehance },
  { label: 'LinkedIn',  href: SOCIAL_LINKEDIN,  Icon: IconLinkedIn },
]

function FooterNewsletter() {
  const t = useTranslations('footer')
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, { status: 'idle' as const })

  return (
    <div className="max-w-[240px]">
      <span className="block font-mono text-smoke/30 text-[9px] uppercase tracking-[0.25em] mb-6">
        {t('newsletterLabel')}
      </span>
      <p className="font-sans text-paper/35 text-[12px] leading-relaxed mb-5 max-w-[22ch]">
        {t('newsletterText')}
      </p>

      {state.status === 'success' ? (
        <p role="status" className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          {t('exito')}
        </p>
      ) : (
        <>
          <form action={formAction} className="flex items-center border-b border-smoke/20 pb-2.5">
            <input
              name="email"
              type="email"
              required
              placeholder={t('emailPlaceholder')}
              aria-label={t('ariaEmail')}
              disabled={isPending}
              className="flex-1 min-w-0 bg-transparent font-mono text-paper text-[11px] placeholder:text-smoke/25 outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isPending}
              aria-label={t('ariaSuscribirse')}
              className="ml-3 shrink-0 font-mono text-paper/40 text-[12px] hover:text-accent transition-colors duration-200 disabled:opacity-50"
            >
              {isPending ? '…' : '→'}
            </button>
          </form>
          {state.status === 'error' && (
            <p role="status" className="font-mono text-[8px] uppercase tracking-[0.18em] text-red-400 mt-2">
              {state.message}
            </p>
          )}
        </>
      )}
    </div>
  )
}

export function Footer() {
  const t = useTranslations('footer')

  const FOOTER_NAV = [
    { href: '/proyectos' as const, label: t('navProyectos') },
    { href: '/nosotros' as const, label: t('navEstudio')   },
    { href: '/journal' as const,  label: t('navJournal')   },
    { href: '/contact' as const,  label: t('navContacto')  },
  ]

  return (
    <footer aria-label="Footer" className="bg-ink">

      <div className="px-6 md:px-16 lg:px-24 pt-20 md:pt-28 grid grid-cols-2 md:grid-cols-4 gap-y-14 gap-x-10 md:gap-x-14 lg:gap-x-20">

        <div>
          <span className="block font-mono text-smoke/30 text-[9px] uppercase tracking-[0.25em] mb-6">
            {t('menuLabel')}
          </span>
          <nav aria-label="Navegación del footer">
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-paper/50 text-sm leading-tight hover:text-paper transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <span className="block font-mono text-smoke/30 text-[9px] uppercase tracking-[0.25em] mb-6">
            {t('ubicacionLabel')}
          </span>
          <p className="font-sans text-paper/50 text-sm leading-relaxed">
            {t('ciudad')}<br />{t('pais')}
          </p>
        </div>

        <FooterNewsletter />

        <div>
          <span className="block font-mono text-smoke/30 text-[9px] uppercase tracking-[0.25em] mb-6">
            {t('socialsLabel')}
          </span>
          <ul className="flex flex-col gap-3.5">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-sans text-paper/50 text-sm hover:text-paper transition-colors duration-200 group"
                >
                  <span className="text-smoke/35 group-hover:text-paper/70 transition-colors duration-200">
                    <Icon />
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="px-6 md:px-16 lg:px-24 mt-16 md:mt-24 overflow-hidden">
        <p
          aria-hidden
          className="font-display font-semibold text-paper leading-none select-none"
          style={{ fontSize: 'clamp(80px, 27vw, 480px)', letterSpacing: '-0.04em' }}
        >
          NEXXO
        </p>
      </div>

      <div className="px-6 md:px-16 lg:px-24 mt-5 pt-5 pb-8 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <Link
            href="/privacidad"
            className="font-mono text-smoke/25 text-[9px] uppercase tracking-[0.2em] hover:text-smoke/50 transition-colors duration-200"
          >
            {t('privacidad')}
          </Link>
          <Link
            href="/soporte"
            className="font-mono text-smoke/25 text-[9px] uppercase tracking-[0.2em] hover:text-smoke/50 transition-colors duration-200"
          >
            {t('soporte')}
          </Link>
        </div>
        <span className="font-mono text-smoke/25 text-[9px] uppercase tracking-[0.2em]">
          {t('copyright')}
        </span>
      </div>

    </footer>
  )
}
