'use client'

import { useRef, useState } from 'react'
import { BuyButton } from '@/components/store/BuyButton'
import { NotifyForm } from '@/components/store/NotifyForm'
import { formatPrice } from '@/lib/price'
import { fromPrice, type Product } from '@/types/product'

/**
 * Licence picker and buy button, plus the sticky bar that carries both on a
 * phone.
 *
 * Tiers are optional. A listing sold at one price on Framer shows that price
 * and one button; the picker only appears once a product has real tiers, which
 * is when Lemon Squeezy is involved.
 *
 * When it is there, the picker is a real radiogroup: arrows move between tiers
 * and the selection follows focus, which is what a screen reader user expects
 * from radios and what a row of styled buttons usually gets wrong.
 */
export function BuyPanel({ product }: { product: Product }) {
  const licenses = product.licenses ?? []
  const [index, setIndex] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const selected = licenses[index] ?? null
  const soon     = product.status === 'coming_soon'
  const price    = selected?.price ?? fromPrice(product)
  const free     = price === 0

  const move = (dir: 1 | -1) => {
    if (!licenses.length) return
    const next = (index + dir + licenses.length) % licenses.length
    setIndex(next)
    refs.current[next]?.focus()
  }

  const fallbackLabel = free ? 'Descargar gratis en Framer' : 'Comprar en Framer Marketplace'

  return (
    <div>
      {licenses.length > 0 && (
        <div
          role="radiogroup"
          aria-label="Elige tu licencia"
          className="flex flex-col gap-3 mb-8"
          onKeyDown={e => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); move(1) }
            if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); move(-1) }
          }}
        >
          {licenses.map((license, i) => {
            const isActive = i === index
            return (
              <button
                key={license._key ?? license.name}
                ref={el => { refs.current[i] = el }}
                type="button"
                role="radio"
                aria-checked={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setIndex(i)}
                className="group flex items-start justify-between gap-6 border p-5 text-left transition-colors duration-200
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                style={{
                  borderColor: isActive ? 'rgba(242,239,233,0.75)' : 'rgba(242,239,233,0.15)',
                  background:  isActive ? 'rgba(242,239,233,0.05)' : 'transparent',
                }}
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-paper mb-2">
                    {license.name}
                  </span>
                  {license.description && (
                    <span className="block font-sans text-paper/60 text-[13px] leading-relaxed">
                      {license.description}
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-display font-semibold text-paper text-[1.1rem] leading-none">
                  {formatPrice(license.price)}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* With no tiers the price has nowhere else to live, so it goes here,
          above the button. */}
      {!soon && licenses.length === 0 && price !== null && (
        <p
          className="font-display font-semibold text-paper leading-none mb-6"
          style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}
        >
          {formatPrice(price)}
        </p>
      )}

      {soon ? (
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/60 mb-4">
            Todavía no está a la venta
          </p>
          <NotifyForm product={product.title} />
        </div>
      ) : (
        <>
          <BuyButton
            productSlug={product.slug.current}
            license={selected}
            fallbackBuyUrl={product.fallbackBuyUrl}
            fallbackLabel={fallbackLabel}
            className="w-full"
          />
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/45 mt-3">
            {free ? 'Descarga gratuita desde Framer' : 'Pago único · Actualizaciones incluidas'}
          </p>
        </>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8">
        {product.demoUrl && (
          <a
            href={product.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper border-b border-paper/30 pb-1 hover:border-paper transition-colors duration-200"
          >
            Ver demo →
          </a>
        )}
        {product.freeVersionUrl && (
          <a
            href={product.freeVersionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60 hover:text-paper transition-colors duration-200"
          >
            Probar versión gratis
          </a>
        )}
      </div>

      {/* Phones: the price and the button follow the reader down the page.
          It repeats the panel above, so it is hidden from assistive tech — and
          `inert` as well as aria-hidden, since a hidden control that still
          catches the Tab key is worse than no shortcut at all. */}
      {!soon && (
        <div
          aria-hidden
          inert
          className="md:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4
                     border-t border-line bg-ink/95 backdrop-blur px-5 py-3"
        >
          <span className="font-display font-semibold text-paper text-[1.05rem] leading-none">
            {price !== null ? formatPrice(price) : product.title}
          </span>
          <BuyButton
            productSlug={product.slug.current}
            license={selected}
            fallbackBuyUrl={product.fallbackBuyUrl}
            fallbackLabel={free ? 'Descargar' : 'Comprar'}
            className="px-5 py-3"
          />
        </div>
      )}
    </div>
  )
}
