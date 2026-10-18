'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { PRODUCT_GRADIENT, type Product } from '@/types/product'

/**
 * Media for a product page: the demo video first when there is one, then the
 * images.
 *
 * The video never autoplays here — on the card a muted loop is a preview, but
 * on the page the visitor came to look, so it gets controls and loads only when
 * asked. Thumbnails are real buttons so the gallery works from the keyboard.
 */
export function ProductGallery({ product }: { product: Product }) {
  const hasVideo = !!product.demoVideoUrl
  const images   = product.gallery?.length
    ? product.gallery
    : product.cover
      ? [{ _key: 'cover', url: product.cover, alt: product.title }]
      : []

  const slides = [
    ...(hasVideo ? [{ kind: 'video' as const, key: 'video' }] : []),
    ...images.map((img, i) => ({ kind: 'image' as const, key: img._key ?? `img-${i}`, img })),
  ]

  const [current, setCurrent] = useState(0)
  const slide = slides[current]

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-[1.5rem] aspect-[4/3]"
        style={{ background: PRODUCT_GRADIENT[product.type] }}
      >
        {slide?.kind === 'video' && (
          <video
            src={product.demoVideoUrl ?? undefined}
            poster={product.cover ?? undefined}
            controls
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {slide?.kind === 'image' && (
          <NextImage
            src={slide.img.url}
            alt={slide.img.alt ?? product.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        )}

        {/* Nothing uploaded yet: the gradient carries the slot rather than a
            broken image frame. */}
        {!slide && (
          <span className="absolute inset-0 flex items-end p-6 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/60">
            {product.title}
          </span>
        )}
      </div>

      {slides.length > 1 && (
        <ul className="flex gap-3 mt-4 flex-wrap" role="list">
          {slides.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={s.kind === 'video' ? 'Ver el video de demo' : `Ver imagen ${i + 1}`}
                aria-current={current === i}
                className="relative h-16 w-20 overflow-hidden rounded-[0.6rem] border transition-colors duration-200
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                style={{
                  borderColor: current === i ? 'rgba(242,239,233,0.8)' : 'rgba(242,239,233,0.15)',
                  background:  PRODUCT_GRADIENT[product.type],
                }}
              >
                {s.kind === 'image' ? (
                  <NextImage src={s.img.url} alt="" fill sizes="80px" className="object-cover" />
                ) : (
                  <span aria-hidden className="absolute inset-0 flex items-center justify-center text-paper text-[11px]">
                    ▶
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
