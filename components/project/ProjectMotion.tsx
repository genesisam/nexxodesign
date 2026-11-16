'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

if (typeof window !== 'undefined') gsap.registerPlugin(SplitText)

/**
 * How a case study arrives: the media uncovers itself, the big headings land
 * a word at a time.
 *
 * It is driven by IntersectionObserver rather than ScrollTrigger on purpose.
 * A case study is read in two places — its own page, where the window scrolls,
 * and the modal, where a box inside the window scrolls — and ScrollTrigger
 * would need to be told which. An observer watches the viewport either way, so
 * the same code works in both without knowing where it is.
 *
 * The hidden state is applied from JS, never from CSS, and every element gets
 * a watchdog: if the animation has not run a second and a half after the thing
 * is genuinely on screen, it is shown regardless. Nothing here is allowed to
 * cost the page its content.
 */

/** Fires once, when `el` is properly in view rather than barely touching it. */
function whenSeen(el: Element, run: () => void, settle: () => void) {
  let timer = 0

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    io.disconnect()
    run()
    // The rescue: whatever happened to the tween, the content is visible.
    timer = window.setTimeout(settle, 1500)
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })

  io.observe(el)
  return () => { io.disconnect(); window.clearTimeout(timer) }
}

export function ProjectMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const main = document.querySelector('main')
    if (!main) return

    const stops: (() => void)[] = []
    const ctx = gsap.context(() => {})
    const seen = new WeakSet<Element>()

    const collect = () => {
      // ── Los medios: se destapan de abajo arriba ──────────────────────────
      main.querySelectorAll<HTMLElement>('figure img, figure video').forEach(media => {
        const box = media.parentElement
        // Se vigila la figura, no la caja. La caja es la que lleva el
        // clip-path, y un elemento recortado a cero nunca vuelve a contar como
        // visible para el observador: se quedaba en ratio 0,00 para siempre y
        // la imagen no aparecía jamás. La figura no se recorta.
        const vigia = media.closest('figure')
        if (!box || !vigia || seen.has(box)) return

        // Nada que no esté maquetado ahora mismo.
        //
        // El bloque de dos columnas dibuja cada ficha dos veces —una para
        // escritorio y otra para teléfono— y esconde la que no toca con
        // `display:none`. Una copia escondida no entra nunca en pantalla, así
        // que su observador no se dispara nunca: si la ocultamos, se queda
        // oculta para siempre y al cambiar de ancho aparece en blanco.
        // Se deja tal cual, visible y sin entrada, que es el fallo correcto.
        if (!vigia.offsetParent || vigia.getBoundingClientRect().height < 8) return

        seen.add(box)

        ctx.add(() => {
          gsap.set(box, { clipPath: 'inset(100% 0% 0% 0%)' })
          gsap.set(media, { scale: 1.06, transformOrigin: 'center' })

          const settle = () => {
            gsap.set(box, { clipPath: 'none' })
            gsap.set(media, { clearProps: 'transform' })
          }

          stops.push(whenSeen(vigia, () => {
            gsap.to(box,   { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut',
                             onComplete: () => gsap.set(box, { clipPath: 'none' }) })
            gsap.to(media, { scale: 1, duration: 1.3, ease: 'power3.out',
                             onComplete: () => gsap.set(media, { clearProps: 'transform' }) })
          }, settle))
        })
      })

      // ── Los titulares de capítulo: palabra a palabra ─────────────────────
      main.querySelectorAll<HTMLElement>('section[id] > h2').forEach(heading => {
        if (seen.has(heading)) return
        seen.add(heading)

        ctx.add(() => {
          let split: SplitText | undefined
          try {
            split = new SplitText(heading, { type: 'words' })
          } catch {
            return // Sin partir el texto no hay nada que animar; queda tal cual.
          }

          const words = split.words
          gsap.set(words, { yPercent: 110, opacity: 0 })

          // Revertir devuelve el titular a un solo nodo de texto, que es como
          // debe quedar: sin restos de spans una vez terminada la entrada.
          const settle = () => { split?.revert() }

          stops.push(whenSeen(heading, () => {
            gsap.to(words, {
              yPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
              stagger: 0.055, onComplete: settle,
            })
          }, settle))
        })
      })
    }

    collect()

    // El cuerpo de un caso llega por streaming, así que lo que aún no estaba
    // al montar se recoge cuando aparece.
    const mo = new MutationObserver(collect)
    mo.observe(main, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      stops.forEach(stop => stop())
      ctx.revert()
    }
  }, [])

  return null
}
