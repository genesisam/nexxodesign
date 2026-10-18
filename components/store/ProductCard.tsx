'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { formatPrice } from '@/lib/price'
import { NotifyForm } from '@/components/store/NotifyForm'
import {
  PRODUCT_GRADIENT, PRODUCT_TYPE_LABEL, fromPrice, type ProductSummary,
} from '@/types/product'

/**
 * A card in the catalogue.
 *
 * The demo loop only exists while the pointer is over the card: the element is
 * created on hover and dropped on leave, so a page of cards costs nothing until
 * someone shows interest. It never loads under `prefers-reduced-motion`, where
 * the cover is the whole story.
 *
 * A product that isn't out yet gets the waiting-list form in place of the
 * price — the card is the same shape either way, which is what keeps the grid
 * from looking broken half the time.
 */
export function ProductCard({ product }: { product: ProductSummary }) {
  const [hovering, setHovering] = useState(false)
  const [notifying, setNotifying] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const price    = fromPrice(product)
  const soon     = product.status === 'coming_soon'
  const href     = `/tienda/${product.slug.current}`
  const canPlay  =
    !!product.demoVideoUrl &&
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <article
      className="group relative flex flex-col"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => { setHovering(false); videoRef.current?.pause() }}
    >
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
      >
        <div
          className="relative overflow-hidden rounded-[1.25rem] aspect-[4/3] mb-5"
          style={{ background: PRODUCT_GRADIENT[product.type] }}
        >
          {product.cover && (
            <NextImage
              src={product.cover}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 30vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          )}

          {hovering && canPlay && (
            <video
              ref={videoRef}
              src={product.demoVideoUrl ?? undefined}
              poster={product.cover ?? undefined}
              muted
              loop
              playsInline
              autoPlay
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/80">
              {PRODUCT_TYPE_LABEL[product.type]}
            </span>
            {(product.badge || soon) && (
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-paper text-ink px-2.5 py-1">
                {soon ? 'Próximamente' : product.badge}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-display font-semibold text-paper leading-tight tracking-[-0.03em] group-hover:text-accent transition-colors duration-200 mb-2"
            style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)' }}>
          {product.title}
        </h3>
        <p className="font-sans text-paper/55 text-[14px] leading-relaxed line-clamp-2 mb-4">
          {product.tagline}
        </p>
      </Link>

      {product.compatibility?.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mb-4" role="list">
          {product.compatibility.map(tag => (
            <li
              key={tag}
              className="font-mono text-[8px] uppercase tracking-[0.18em] text-paper/55 border border-paper/15 px-2 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto">
        {soon ? (
          notifying ? (
            <NotifyForm product={product.title} compact />
          ) : (
            <button
              type="button"
              onClick={() => setNotifying(true)}
              className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper border border-paper/25 px-4 py-2.5
                         hover:border-paper/60 transition-colors duration-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Avísame
            </button>
          )
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/75">
            {/* "Desde" only when there is more than one tier to be above. */}
            {price === null
              ? 'Consultar'
              : (product.licenses?.length ?? 0) > 1
                ? `Desde ${formatPrice(price)}`
                : formatPrice(price)}
          </p>
        )}
      </div>
    </article>
  )
}
