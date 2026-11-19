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
  /* The brand violet clears 5.15:1 on paper but only 3.15:1 on ink, so the
     accent is part of the theme rather than a constant. Each one is a literal
     class string, never built by interpolation, because Tailwind's scanner
     only generates what it can read in the source. */
  accent:      string  // emphasis colour
  accentHover: string  // `hover:` variant of the above
  marker:      string  // `marker:` variant, for list bullets
}

/**
 * Dos escalas de lectura.
 *
 *   lectura  16–17 px. Artículos del journal y fichas de tienda, donde el
 *            texto es largo y se lee seguido.
 *   caso     18–28 px. Los casos de proyecto, donde cada capítulo tiene dos o
 *            tres párrafos entre imágenes a pantalla casi completa.
 *
 * La diferencia no es capricho: a 16 px, un párrafo de tres líneas colocado
 * entre dos piezas de 1.500 px se lee como un pie de foto, y el caso deja de
 * contarse. Medido contra la referencia que sirve de vara —Cakao— donde el
 * cuerpo ronda los 28 px.
 */
export type Escala = 'lectura' | 'caso'

const CUERPO: Record<Escala, string> = {
  lectura: 'clamp(1rem, 0.6vw + 0.85rem, 1.05rem)',
  caso:    'clamp(1.12rem, 1.15vw + 0.6rem, 1.75rem)',
}

const TITULAR: Record<Escala, string> = {
  lectura: 'clamp(1.75rem, 3.2vw, 3rem)',
  caso:    'clamp(2.1rem, 4.4vw, 4.2rem)',
}

const SUBTITULAR: Record<Escala, string> = {
  lectura: 'clamp(1.25rem, 2.4vw, 2rem)',
  caso:    'clamp(1.5rem, 3vw, 2.6rem)',
}

function makeComponents(t: Theme, e: Escala = 'lectura'): Partial<PortableTextReactComponents> {
  return {
    block: {
      h2: ({ children }) => (
        <h2
          className={`font-display font-semibold ${t.text} leading-[0.92] tracking-[-0.035em] mt-14 mb-4 first:mt-0`}
          style={{ fontSize: TITULAR[e] }}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className={`font-display font-semibold ${t.sub} leading-tight tracking-[-0.028em] mt-10 mb-3`}
          style={{ fontSize: SUBTITULAR[e] }}
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
        <p
          className={`font-sans ${t.body} leading-[1.5] mb-6 text-pretty`}
          style={{ fontSize: CUERPO[e] }}
        >
          {children}
        </p>
      ),
    },

    marks: {
      strong: ({ children }) => (
        <strong className={`font-semibold ${t.text}`}>{children}</strong>
      ),
      em: ({ children }) => (
        <em className={`${t.accent} not-italic`}>{children}</em>
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
          className={`${t.text} underline underline-offset-2 decoration-smoke/40 ${t.accentHover} transition-colors duration-150`}
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
              <figcaption className="font-mono text-smoke/65 text-[9px] uppercase tracking-[0.2em] mt-2">
                {value.caption}
              </figcaption>
            )}
          </figure>
        )
      },
    },

    list: {
      bullet: ({ children }) => (
        <ul className={`mb-5 space-y-1.5 pl-5 list-disc ${t.marker}`}>{children}</ul>
      ),
      number: ({ children }) => (
        <ol className={`mb-5 space-y-1.5 pl-5 list-decimal ${t.marker} marker:font-mono`}>{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className={`font-sans ${t.body} leading-[1.5]`} style={{ fontSize: CUERPO[e] }}>{children}</li>
      ),
      number: ({ children }) => (
        <li className={`font-sans ${t.body} leading-[1.5]`} style={{ fontSize: CUERPO[e] }}>{children}</li>
      ),
    },
  }
}

// `accent`/`marker` are part of the theme because the brand violet clears
// 5.15:1 on paper but only 3.15:1 on ink. Same ink, two different grounds.
const CLARO = { text: 'text-ink',   body: 'text-ink/70',   sub: 'text-ink/80',   code: 'bg-ink/6 text-ink/80',    accent: 'text-accent',      marker: 'marker:text-accent',      accentHover: 'hover:text-accent' }
const OSCURO = { text: 'text-paper', body: 'text-paper/90', sub: 'text-paper/80', code: 'bg-paper/10 text-paper/80', accent: 'text-accent-soft', marker: 'marker:text-accent-soft', accentHover: 'hover:text-accent-soft' }

// Cuatro juegos: dos temas por dos escalas. Se construyen una vez, fuera del
// render, porque `PortableText` vuelve a montar todo si el objeto cambia.
const COMPONENTES = {
  'lectura-claro':  makeComponents(CLARO,  'lectura'),
  'lectura-oscuro': makeComponents(OSCURO, 'lectura'),
  'caso-claro':     makeComponents(CLARO,  'caso'),
  'caso-oscuro':    makeComponents(OSCURO, 'caso'),
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NexxoPortableText({
  value,
  dark = false,
  escala = 'lectura',
}: {
  value: PTContent[]
  dark?: boolean
  escala?: Escala
}) {
  return (
    <PortableText
      value={value as Parameters<typeof PortableText>[0]['value']}
      components={COMPONENTES[`${escala}-${dark ? 'oscuro' : 'claro'}`]}
    />
  )
}
