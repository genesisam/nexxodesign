'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/store/ProductCard'
import type { ProductSummary, ProductType } from '@/types/product'

/**
 * The catalogue grid and its filter. Same tablist pattern and the same pill
 * styling as the journal's category filter, so the two indexes of the site
 * behave identically.
 */

const TABS: { label: string; value: 'all' | ProductType }[] = [
  { label: 'Todos',       value: 'all'       },
  { label: 'Componentes', value: 'component' },
  { label: 'Templates',   value: 'template'  },
  { label: 'Bundles',     value: 'bundle'    },
]

export function StoreCatalog({ products }: { products: ProductSummary[] }) {
  const [active, setActive] = useState<'all' | ProductType>('all')

  const filtered = active === 'all' ? products : products.filter(p => p.type === active)

  return (
    <section className="gutter-x pb-20 md:pb-28">
      <div
        role="tablist"
        aria-label="Filtrar por tipo de producto"
        className="flex items-center gap-2 flex-wrap mb-12 md:mb-16"
      >
        {TABS.map(({ label, value }) => {
          const isActive = active === value
          return (
            <button
              key={value}
              id={`tab-${value}`}
              role="tab"
              aria-selected={isActive}
              aria-controls="store-panel"
              onClick={() => setActive(value)}
              className="font-mono text-[9px] uppercase tracking-[0.22em] px-4 py-2 border transition-colors duration-200"
              style={{
                borderColor: isActive ? 'rgb(242,239,233)' : 'rgba(242,239,233,0.15)',
                background:  isActive ? 'rgb(242,239,233)' : 'transparent',
                color:       isActive ? '#0E0E0E'          : 'rgba(242,239,233,0.4)',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {filtered.length > 0 ? (
        <ul
          id="store-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
        >
          {filtered.map(product => (
            <li key={product._id} className="flex">
              <div className="flex w-full flex-col">
                <ProductCard product={product} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div id="store-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="py-20 flex items-center justify-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-paper/55">
            Nada por aquí todavía
          </p>
        </div>
      )}
    </section>
  )
}
