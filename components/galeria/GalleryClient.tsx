'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import './gallery.css'

/* Interfaz HTML de la galería; la escena (mountGallery) la rellena y la anima.
   Es estática, así que va como HTML y React no la vuelve a tocar. */
const MARKUP = `<div id="vignette"></div>
<div id="loader" role="status" aria-live="polite"><div class="box"><span class="eyebrow">Montando la galería…</span><div class="track"><div id="lbar"></div></div></div></div>
<header id="top">
  <a class="brand" href="/" aria-label="Nexxo, ir al inicio"><b>NEXXO</b><span class="eyebrow">Galería 3D de proyectos</span></a>
  <button id="skip">Saltar intro</button>
  <a id="portfolio" href="/proyectos">Ver portafolio completo →</a>
</header>
<div id="tip"></div>
<nav id="list" aria-label="Proyectos de la galería"></nav>
<div id="dots" aria-hidden="true"></div>
<nav id="mnav" aria-label="Recorrer la galería">
  <button class="btn" id="mprev" aria-label="Proyecto anterior">←</button>
  <button class="btn title" id="mopen"><span class="eyebrow" id="mnum"></span><b id="mtitle"></b></button>
  <button class="btn" id="mnext" aria-label="Proyecto siguiente">→</button>
</nav>
<article id="panel" aria-live="polite">
  <p class="eyebrow" id="pnum"></p>
  <h2 id="ptitle"></h2>
  <p class="cat" id="pcat"></p>
  <p class="sum" id="psum"></p>
  <ul id="psrv"></ul>
  <div class="actions">
    <a class="btn primary" id="plink" href="#">Ver proyecto →</a>
    <button class="btn" id="pback">← Volver a la galería</button>
    <span class="nav"><button class="btn" id="pprev" aria-label="Anterior">←</button><button class="btn" id="pnext" aria-label="Siguiente">→</button></span>
  </div>
</article>`

type GalleryApi = { destroy(): void; setPaused(p: boolean): void }

/**
 * Galería 3D de proyectos a pantalla completa, encima de la navegación del sitio.
 * "Ver proyecto" navega a /proyectos/[slug] con el router: la ruta interceptada
 * Cada caso abre su propia página, igual que desde el portafolio, sobre la
 * galería, y al cerrarlo (router.back) se vuelve aquí sin recargar la escena.
 */
export function GalleryClient() {
  const api      = useRef<GalleryApi | null>(null)
  const host     = useRef<HTMLDivElement | null>(null)
  const router   = useRouter()
  useEffect(() => {
    // El contenedor vive en <body>, fuera del árbol de React: Next vuelve a
    // montar el DOM de la página en cada navegación y se llevaba el canvas por
    // delante.
    let dead = false
    const el = document.createElement('div')
    el.id = 'galeria'
    el.className = 'nx-gal'
    el.innerHTML = MARKUP
    document.body.appendChild(el)
    host.current = el
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    import('./mountGallery')
      .then(m => m.mount(el, {
        onOpenProject: (slug: string) => router.push(`/proyectos/${slug}`, { scroll: false }),
      }))
      .then((a: GalleryApi) => { if (dead) a.destroy(); else api.current = a })
      .catch(err => console.error('[galeria]', err))
    return () => {
      dead = true
      api.current?.destroy()
      api.current = null
      el.remove()
      host.current = null
      html.style.overflow = prev
    }
  }, [router])

  // El <main> de la página. Va vacío —la escena está en el contenedor de
  // <body>— pero tiene que existir: RevealSections y ProjectMotion trabajan
  // sobre el primer <main> del documento, y sin uno aquí no tendrían dónde
  // mirar.
  return (
    <main id="galeria-main" data-no-reveal>
      <h1 className="sr-only">Galería 3D de proyectos de Nexxo</h1>
    </main>
  )
}
