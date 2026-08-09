'use client'

import { useState } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { COVER_GRADIENT, type PostCategory, type PostSummary } from '@/types/post'

const TABS: Array<'Todos' | PostCategory> = ['Todos', 'Diseño', 'IA', 'UX', 'Proceso']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function JournalList({ posts }: { posts: PostSummary[] }) {
  const [active, setActive] = useState<'Todos' | PostCategory>('Todos')

  const filtered = active === 'Todos' ? posts : posts.filter(p => p.category === active)

  return (
    <section className="px-6 md:px-16 lg:px-24 pb-20 md:pb-28">

      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Filtrar por categoría"
        className="flex items-center gap-2 flex-wrap mb-12 md:mb-16"
      >
        {TABS.map(tab => {
          const isActive = active === tab
          return (
            <button
              key={tab}
              id={`tab-${tab}`}
              role="tab"
              aria-selected={isActive}
              aria-controls="journal-panel"
              onClick={() => setActive(tab)}
              className="font-mono text-[9px] uppercase tracking-[0.22em] px-4 py-2 border transition-colors duration-200"
              style={{
                borderColor: isActive ? 'rgb(242,239,233)'        : 'rgba(242,239,233,0.15)',
                background:  isActive ? 'rgb(242,239,233)'        : 'transparent',
                color:       isActive ? '#0E0E0E'                 : 'rgba(242,239,233,0.4)',
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Post list */}
      {filtered.length > 0 ? (
        <ul
          id="journal-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="divide-y divide-paper/10 border-t border-paper/10"
        >
          {filtered.map(post => (
            <li key={post._id}>
              <Link
                href={`/journal/${post.slug.current}`}
                className="group flex items-start gap-5 md:gap-8 py-8 md:py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
              >
                {/* Cover thumbnail */}
                <div
                  className="flex-shrink-0 rounded-[1rem] overflow-hidden relative"
                  style={{
                    width:      120,
                    height:     120,
                    background: COVER_GRADIENT[post.category],
                  }}
                >
                  {post.cover && (
                    <NextImage
                      src={post.cover}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 pt-1">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent mb-2">
                    {post.category}
                  </p>
                  <h2
                    className="font-display font-semibold text-paper leading-tight tracking-[-0.03em] group-hover:text-accent transition-colors duration-200 mb-2.5"
                    style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.45rem)' }}
                  >
                    {post.title}
                  </h2>
                  <p className="font-sans text-paper/55 text-[14px] leading-relaxed line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/55">
                    {formatDate(post.publishedAt)} · {post.readingTime} min de lectura
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div id="journal-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="py-20 flex items-center justify-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-paper/55">
            Sin artículos en esta categoría
          </p>
        </div>
      )}
    </section>
  )
}
