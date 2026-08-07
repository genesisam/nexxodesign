'use client'

import { PortableText } from '@portabletext/react'
import type { PortableTextReactComponents } from '@portabletext/react'
import type { PTContent, PTImage } from '@/types/project'

// ─── Theme-aware component factory ────────────────────────────────────────────

type Theme = {
  text:  string   // headings / strong
  body:  string   // paragraph body
  sub:   string   // h3/h4 slightly muted
  code:  string   // code bg + text
}

function makeComponents(t: Theme): Partial<PortableTextReactComponents> {
  return {
    block: {
      h2: ({ children }) => (
        <h2
          className={`font-display font-semibold ${t.text} leading-[0.92] tracking-[-0.035em] mt-14 mb-4 first:mt-0`}
          style={{ fontSize: 'clamp(1.75rem, 3.2vw, 3rem)' }}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className={`font-display font-semibold ${t.sub} leading-tight tracking-[-0.028em] mt-10 mb-3`}
          style={{ fontSize: 'clamp(1.25rem, 2.4vw, 2rem)' }}
        >
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className={`font-sans font-semibold ${t.sub} text-base md:text-lg mt-7 mb-2`}>
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-accent pl-6 my-10">
          <p
            className={`font-display font-semibold ${t.text} leading-snug tracking-[-0.025em]`}
            style={{ fontSize: 'clamp(1.15rem, 2vw, 1.7rem)' }}
          >
            {children}
          </p>
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className={`font-sans ${t.body} text-base md:text-[1.05rem] leading-relaxed mb-5`}>
          {children}
        </p>
      ),
    },

    marks: {
      strong: ({ children }) => (
        <strong className={`font-semibold ${t.text}`}>{children}</strong>
      ),
      em: ({ children }) => (
        <em className="text-accent not-italic">{children}</em>
      ),
      code: ({ children }) => (
        <code className={`font-mono text-sm ${t.code} px-1.5 py-0.5 rounded`}>
          {children}
        </code>
      ),
      link: ({ value, children }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${t.text} underline underline-offset-2 decoration-smoke/40 hover:text-accent transition-colors duration-150`}
        >
          {children}
        </a>
      ),
    },

    types: {
      image: ({ value }: { value: PTImage }) => {
        if (!value.url) return null
        return (
          <figure className="my-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.url}
              alt={value.alt ?? ''}
              className="w-full"
              loading="lazy"
              draggable={false}
            />
            {value.caption && (
              <figcaption className="font-mono text-smoke/40 text-[9px] uppercase tracking-[0.2em] mt-2">
                {value.caption}
              </figcaption>
            )}
          </figure>
        )
      },
    },

    list: {
      bullet: ({ children }) => (
        <ul className="mb-5 space-y-1.5 pl-5 list-disc marker:text-accent">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="mb-5 space-y-1.5 pl-5 list-decimal marker:text-accent marker:font-mono">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className={`font-sans ${t.body} text-base md:text-[1.05rem] leading-relaxed`}>{children}</li>
      ),
      number: ({ children }) => (
        <li className={`font-sans ${t.body} text-base md:text-[1.05rem] leading-relaxed`}>{children}</li>
      ),
    },
  }
}

const lightComponents = makeComponents({
  text: 'text-ink',
  body: 'text-ink/70',
  sub:  'text-ink/80',
  code: 'bg-ink/6 text-ink/80',
})

const darkComponents = makeComponents({
  text: 'text-paper',
  body: 'text-paper/70',
  sub:  'text-paper/80',
  code: 'bg-paper/10 text-paper/80',
})

// ─── Component ────────────────────────────────────────────────────────────────

export function NexxoPortableText({
  value,
  dark = false,
}: {
  value: PTContent[]
  dark?: boolean
}) {
  return (
    <PortableText
      value={value as Parameters<typeof PortableText>[0]['value']}
      components={dark ? darkComponents : lightComponents}
    />
  )
}
