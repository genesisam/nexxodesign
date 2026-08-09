'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

const TransformacionInner = dynamic(
  () => import('./TransformacionInner'),
  {
    ssr: false,
    loading: () => <div className="h-[500vh] w-full bg-ink" />,
  },
)

type SlotData = { label: string; title: string; sub: string }

/**
 * The interactive filmstrip is client-only (GSAP + Lenis measure the viewport),
 * so its copy never reached the server HTML — the section describing the whole
 * methodology was invisible to crawlers that don't execute JavaScript, which
 * includes most answer-engine bots.
 *
 * This mirror emits the same six steps as plain semantic markup. It is hidden
 * from sighted users and from assistive tech (the interactive version is the
 * accessible one), but it is present in the initial response.
 */
function TransformacionOutline() {
  const t     = useTranslations('transformacion')
  const slots = t.raw('slots') as SlotData[]

  return (
    <div className="sr-only" aria-hidden="true">
      <h2>{t('seccion')}</h2>
      <ol>
        {slots.map(s => (
          <li key={s.label}>
            <h3>{s.title.replace('\n', ' ')}</h3>
            <p>{s.sub}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Transformacion() {
  return (
    <>
      <TransformacionOutline />
      <TransformacionInner />
    </>
  )
}
