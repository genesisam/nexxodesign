'use client'

import { useEffect, useState } from 'react'
import { aRgb, legibleSobre } from '@/lib/color'

export type Muestra = {
  _key: string
  hex: string
  name: string
  note?: string
  textura?: string | null
}

/**
 * La carta de color de un caso.
 *
 * En escritorio cada muestra es una ficha cuadrada con su nombre, su valor y
 * —al pasar por encima— su nota y la textura del material.
 *
 * En el teléfono la nota no cabe. Estaba puesta con `opacity: 0`, que la
 * esconde pero no la saca del flujo: con `aspect-ratio: 1/1` el contenido
 * manda sobre la proporción, así que una nota larga estiraba su muestra y la
 * carta quedaba con cuadros de alturas distintas. Aquí la nota sale del
 * cuadro y pasa a una hoja que sube desde abajo al tocar el color, de modo
 * que todas las muestras miden exactamente lo mismo en todos los proyectos.
 */
export function PaletteGrid({ colors }: { colors: Muestra[] }) {
  const [abierta, setAbierta] = useState<Muestra | null>(null)

  // Mientras la hoja está arriba, la página de debajo no se mueve.
  useEffect(() => {
    if (!abierta) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const salir = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierta(null) }
    window.addEventListener('keydown', salir)
    return () => {
      document.body.style.overflow = previo
      window.removeEventListener('keydown', salir)
    }
  }, [abierta])

  const columnas = colors.length % 4 === 0 ? 'md:grid-cols-4'
    : colors.length % 3 === 0 ? 'md:grid-cols-3'
    : 'md:grid-cols-4'

  return (
    <>
      {/* Los fotogramas van aquí y no en la hoja global: son de esta lámina y
          de nada más, y así el componente se lleva consigo todo lo que
          necesita para funcionar. */}
      <style>{`
        @keyframes hoja-sube { from { transform: translateY(100%) } to { transform: none } }
        @keyframes hoja-velo { from { opacity: 0 } to { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes hoja-sube { from { transform: none } to { transform: none } }
        }
      `}</style>

      <dl className={`grid grid-cols-2 gap-2 md:gap-3 ${columnas}`}>
        {colors.map((c, i) => {
          const tinta = legibleSobre(c.hex)
          return (
            <button
              key={c._key}
              type="button"
              // En escritorio la nota ya se ve al pasar por encima, así que
              // la hoja es cosa del táctil; el botón se queda igualmente por
              // teclado.
              onClick={() => c.note && setAbierta(c)}
              aria-label={c.note ? `${c.name}, ${c.hex}. Ver la nota` : `${c.name}, ${c.hex}`}
              className="revelado group relative overflow-hidden rounded-[1.25rem] border border-paper/10
                         flex flex-col justify-end p-5 md:p-6 text-left
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/60"
              style={{
                background: c.hex,
                aspectRatio: '1 / 1',
                // Escalonado dentro de la fila: el ojo recorre de izquierda a
                // derecha en vez de ver aparecer los cuatro de golpe.
                animationDelay: `${(i % 4) * 90}ms`,
                ['--retraso' as string]: `${(i % 4) * 2}%`,
              }}
            >
              {/* La textura del material, al pasar por encima. El color es el
                  dato; esto solo dice de qué está hecho. */}
              {c.textura && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.textura}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover
                             opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  loading="lazy"
                  draggable={false}
                />
              )}
              <dt className="relative font-mono text-[12px] md:text-[14px] uppercase tracking-[0.16em]"
                  style={{ color: tinta }}>
                {c.name}
              </dt>
              <dd className="relative font-mono text-[12px] md:text-[14px] tracking-[0.1em] mt-2 space-y-0.5"
                  style={{ color: tinta, opacity: 0.72 }}>
                <span className="block">{c.hex.toUpperCase()}</span>
                <span className="block">RGB {aRgb(c.hex).join(' ')}</span>
              </dd>

              {/* La nota, solo de md para arriba y solo al pasar por encima.
                  `absolute` para que no empuje el cuadrado. */}
              {c.note && (
                <p
                  className="hidden md:block absolute inset-x-6 bottom-6 font-sans text-[13px] leading-snug
                             text-pretty opacity-0 translate-y-1 transition-all duration-300
                             group-hover:opacity-90 group-hover:translate-y-0"
                  style={{ color: tinta }}
                >
                  {c.note}
                </p>
              )}
            </button>
          )
        })}
      </dl>

      {/* ── La hoja ─────────────────────────────────────────────────────── */}
      {abierta && (
        <div
          className="fixed inset-0 z-[80] flex items-end md:items-center md:justify-center"
          onMouseDown={e => { if (e.target === e.currentTarget) setAbierta(null) }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[hoja-velo_.25s_ease-out]" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={abierta.name}
            className="relative w-full md:max-w-md rounded-t-[1.75rem] md:rounded-[1.75rem]
                       overflow-hidden animate-[hoja-sube_.32s_cubic-bezier(.2,.7,.3,1)]"
            style={{ background: abierta.hex }}
          >
            {abierta.textura && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={abierta.textura} alt="" aria-hidden
                   className="absolute inset-0 w-full h-full object-cover opacity-35" draggable={false} />
            )}
            {/* El tirador, que es lo que dice que esto se arrastra. */}
            <span aria-hidden className="relative mx-auto mt-3 mb-1 block h-1 w-10 rounded-full"
                  style={{ background: legibleSobre(abierta.hex), opacity: 0.35 }} />

            <div className="relative p-7 pt-4">
              <p className="font-mono text-[12px] uppercase tracking-[0.16em]"
                 style={{ color: legibleSobre(abierta.hex) }}>
                {abierta.name}
              </p>
              <p className="font-mono text-[12px] tracking-[0.1em] mt-1.5 space-y-0.5"
                 style={{ color: legibleSobre(abierta.hex), opacity: 0.72 }}>
                <span className="block">{abierta.hex.toUpperCase()}</span>
                <span className="block">RGB {aRgb(abierta.hex).join(' ')}</span>
              </p>
              {abierta.note && (
                <p className="font-sans text-[15px] leading-[1.5] mt-5 text-pretty"
                   style={{ color: legibleSobre(abierta.hex) }}>
                  {abierta.note}
                </p>
              )}
              <button
                type="button"
                onClick={() => setAbierta(null)}
                className="mt-7 w-full rounded-full py-3 font-mono text-[12px] uppercase tracking-[0.2em]"
                style={{
                  color: legibleSobre(abierta.hex),
                  border: `1px solid ${legibleSobre(abierta.hex)}`,
                  opacity: 0.8,
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
