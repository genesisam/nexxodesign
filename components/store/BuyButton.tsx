'use client'

import { useCallback, useEffect, useState } from 'react'
import Script from 'next/script'
import { track } from '@vercel/analytics'
import { LEMON_SCRIPT_SRC, buildCheckoutUrl, hasCheckout } from '@/lib/lemonsqueezy'
import type { ProductLicense } from '@/types/product'

/**
 * The buy button, in both of the states this store will live through.
 *
 * With a Lemon Squeezy checkout on the selected licence, the overlay opens on
 * the page. Without one — which is every product until the shop is verified —
 * it opens the marketplace listing in a new tab. Nothing about the layout
 * changes between the two, so switching a product over later is a content
 * edit, not a visual one.
 *
 * lemon.js is only injected when there is a checkout to open, so the catalogue
 * and every unsold product stay free of it.
 */
export function BuyButton({
  productSlug,
  license,
  fallbackBuyUrl,
  fallbackLabel = 'Comprar en Framer Marketplace',
  className = '',
}: {
  productSlug:    string
  license:        ProductLicense | null
  fallbackBuyUrl: string
  fallbackLabel?: string
  className?:     string
}) {
  const [bought, setBought] = useState(false)
  const [ready, setReady]   = useState(false)
  const checkout            = hasCheckout(license)

  // Wiring the handler once lemon.js is on the page; Setup is what makes
  // Checkout.Success reach us instead of only the overlay knowing about it.
  useEffect(() => {
    if (!checkout || !ready) return
    window.createLemonSqueezy?.()
    window.LemonSqueezy?.Setup?.({
      eventHandler: event => {
        if (event.event === 'Checkout.Success') {
          setBought(true)
          track('store_purchase', { product: productSlug, license: license?.name ?? '' })
        }
      },
    })
  }, [checkout, ready, productSlug, license?.name])

  const onBuy = useCallback(() => {
    if (checkout && license?.lemonCheckoutUrl) {
      const url = buildCheckoutUrl(license.lemonCheckoutUrl, productSlug, license.name)
      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(url)
        track('store_checkout_open', { product: productSlug, license: license.name })
        return
      }
      // lemon.js blocked or still loading: the hosted checkout works on its own.
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }

    track('store_fallback_buy', { product: productSlug })
    window.open(fallbackBuyUrl, '_blank', 'noopener,noreferrer')
  }, [checkout, license, productSlug, fallbackBuyUrl])

  if (bought) {
    return (
      <p
        role="status"
        aria-live="polite"
        className={`font-mono text-[10px] uppercase tracking-[0.2em] text-accent ${className}`}
      >
        ¡Gracias! Revisa tu correo →
      </p>
    )
  }

  return (
    <>
      {checkout && (
        <Script src={LEMON_SCRIPT_SRC} strategy="lazyOnload" onReady={() => setReady(true)} />
      )}
      <button
        type="button"
        onClick={onBuy}
        className={`group relative inline-flex items-center justify-center overflow-hidden
                    bg-accent text-paper font-mono text-[10px] uppercase tracking-[0.22em]
                    px-6 py-4 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper
                    focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${className}`}
      >
        {checkout ? 'Comprar ahora' : fallbackLabel}
        {!checkout && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
      </button>
    </>
  )
}
