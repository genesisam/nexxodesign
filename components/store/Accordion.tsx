'use client'

import { useId, useState } from 'react'
import type { ProductFaqItem } from '@/types/product'

/**
 * FAQ list. One open at a time, keyboard-operable because it is built from
 * buttons rather than divs, and the answer is a region tied to its heading so a
 * screen reader announces what collapsed.
 */
export function Accordion({ items, className = '' }: { items: ProductFaqItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const base            = useId()

  if (!items?.length) return null

  return (
    <ul className={`divide-y divide-paper/10 border-y border-paper/10 ${className}`} role="list">
      {items.map((item, i) => {
        const isOpen  = open === i
        const btnId   = `${base}-b-${i}`
        const panelId = `${base}-p-${i}`
        return (
          <li key={item._key ?? item.question}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                           focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
              >
                <span className="font-sans text-paper text-[15px] leading-snug group-hover:text-accent transition-colors duration-200">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-paper/55 text-[14px] leading-none pt-1 transition-transform duration-300"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                >
                  +
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen}>
              <p className="font-sans text-paper/65 text-[14px] leading-relaxed pb-6 max-w-[62ch]">
                {item.answer}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
