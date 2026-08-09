'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// Swap por foto real: /images/alexander-moreno.jpg (vertical 3:4)
const PHOTO_SRC = ''

type Props = {
  bioText:  string
  photoAlt: string
}

export function FoundadorBio({ bioText, photoAlt }: Props) {
  const floatRef  = useRef<HTMLDivElement>(null)
  const rootRef   = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Dedicated portal root appended LAST in body — guarantees DOM paint order
    const root = document.createElement('div')
    root.setAttribute('aria-hidden', 'true')
    root.style.cssText = 'position:fixed;inset:0;z-index:100000;pointer-events:none;overflow:hidden'
    document.body.appendChild(root)
    rootRef.current = root
    setMounted(true)
    return () => { document.body.removeChild(root) }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = floatRef.current
    if (!el) return
    el.style.left      = `${e.clientX + 24}px`
    el.style.top       = `${e.clientY - 150}px`
    el.style.opacity   = '1'
    el.style.transform = 'scale(1)'
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = floatRef.current
    if (!el) return
    el.style.opacity   = '0'
    el.style.transform = 'scale(0.93)'
  }, [])

  const floatingEl = (
    <div
      ref={floatRef}
      className="hidden md:block"
      style={{
        position:   'absolute',
        width:      'clamp(200px, 22vw, 340px)',
        opacity:    0,
        left:       0,
        top:        0,
        transform:  'scale(0.93)',
        transition: 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)',
        overflow:   'hidden',
      }}
    >
      {PHOTO_SRC ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={PHOTO_SRC}
          alt={photoAlt}
          className="w-full h-auto object-cover aspect-[3/4] block"
          draggable={false}
        />
      ) : (
        <div className="aspect-[3/4] bg-gradient-to-b from-paper/20 to-paper/5 flex items-end p-4">
          <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-paper/55">
            {photoAlt}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <div className="relative mt-[10vh] md:mt-[14vh]">

      {/* Bio — texto editorial grande */}
      <p
        className="font-display font-semibold text-paper leading-[1.08] tracking-[-0.03em] md:cursor-default"
        style={{ fontSize: 'clamp(1.7rem, 3.4vw, 4rem)' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {bioText}
      </p>

      {/* Portal en root dedicado z-index:100000 al final del body */}
      {mounted && rootRef.current && createPortal(floatingEl, rootRef.current)}

      {/* Imagen mobile: estática debajo del texto */}
      <div
        aria-hidden
        className="md:hidden mt-10 overflow-hidden"
        style={{ maxWidth: '72vw' }}
      >
        {PHOTO_SRC ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={PHOTO_SRC}
            alt={photoAlt}
            className="w-full h-auto object-cover aspect-[3/4] block"
            draggable={false}
          />
        ) : (
          <div className="aspect-[3/4] bg-gradient-to-b from-paper/18 to-paper/5 flex items-end p-4">
            <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-paper/55">
              {photoAlt}
            </span>
          </div>
        )}
      </div>

    </div>
  )
}
