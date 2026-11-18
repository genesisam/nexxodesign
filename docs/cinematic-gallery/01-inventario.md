# Cinematic Project Gallery — Etapa 1: inventario

Auditoría del estado actual antes de tocar nada. No se modificó código para escribir esto.

Fecha: 16 de noviembre de 2026 · Rama: `main`

---

## 1. Dónde vive hoy la sección de proyectos

| Sitio | Archivo | Rejilla | Proporción de la tarjeta | Ajuste |
|---|---|---|---|---|
| Home | `components/sections/SelectedWork.tsx` + `ProjectCard.tsx` | 12 columnas, ritmo editorial asimétrico (7+4, 10 centrado, 4+7) | `aspect-square` en pares, `16/9` en destacada | `object-cover` |
| Índice | `components/sections/WorkIndex.tsx` | `1 → 2 → 3 → 4` columnas | `3 / 4` fija | `object-cover` |

**El home ya hace lo que pide el brief**: tarjetas grandes, dos columnas, ritmo alternado, una pieza a ancho completo. El problema está en el índice `/proyectos`, que mete ocho portadas apaisadas en un marco vertical 3:4 y recorta por los lados.

Qué se pierde exactamente al recortar a 3:4:

- **Cornish** — el rótulo «cornish arquitectos» queda cortado por ambos lados.
- **Merxo** — se van los bordes del panel y las tarjetas de métricas laterales.
- **NBL** — desaparecen la navegación, el logotipo y el carrito.
- **Nexo Go** — el teléfono queda descentrado.
- **Solivus** — se corta el dashboard, que es lo único que cuenta el proyecto.

La miniatura secundaria de la tarjeta (85 × 85 px, con vídeo al pasar el cursor) sí es un recurso aprovechable: ya existe una segunda capa visual por proyecto.

## 2. Los ocho proyectos y sus recursos

Portadas en el CMS bajo `coverImage` (no `cover`); los medios de la historia son referencias de asset de Sanity, no URLs.

| Proyecto | Año · Vertical | Origen | Portada | Medios | Sitio público |
|---|---|---|---|---|---|
| **NBL** | 2026 · E-commerce | repo | `nbl/home.webp` 2000×1250 | 7 imgs + 3 vídeos, locales | ✅ `nbl-home.vercel.app` |
| **Cornish Arquitectos** | 2026 · Arquitectura | repo | `cornish/home.webp` 2000×1250 | 10 imgs + 5 vídeos, locales | ✅ **`cornisharquitectos.com`** |
| **Solivus** | 2025 · SaaS | CMS | 2100×1208 | 17 (3 ≥ 2000 px) | ❌ ninguno |
| **Merxo** | 2025 · SaaS | CMS | 2800×1898 | 12 (0 ≥ 2000 px) | ❌ ninguno |
| **Nexo Go** | 2025 · SaaS | CMS | 2100×1332 | 17 (0 ≥ 2000 px) | ❌ ninguno |
| **Greenery 420** | 2025 · Web | CMS | 2100×1377 | 17 (1 ≥ 2000 px) | ❌ ninguno |
| **Maison Oliva** | 2025 · Web | CMS | 2880×1924 | 17 (1 ≥ 2000 px) | ✅ `maison-oliva.com` |
| **Mente** | 2022 · Fintech | CMS | 2800×2032 | 12 (2 ≥ 2000 px) | ✅ `mente.co` |
| _Tolvia_ | _despublicado_ | repo | — | — | ✅ `tolvia.com/es` |

**Hallazgo**: el `liveUrl` de Cornish apuntaba a `cornish-arquitectos-web.vercel.app`, que redirige al dominio real **`cornisharquitectos.com`**. Hay que actualizarlo.

Archivos locales: `public/images/projects/` — 55 archivos, 41 MB, solo cuatro proyectos.
`nexo-go/cover.png` pesa **13 MB a 4000×3000** y no se usa (se sirve el `.webp` de 1400 px). Es el mejor original que tenemos de ese proyecto.

## 3. Diagnóstico de dirección de arte

Las ocho portadas juntas, sin recortar:

- **No hay universo visual compartido.** Hay ocho mundos distintos: un collage de pegatinas pastel (Greenery), una ilustración vectorial plana (Mente), un degradado turquesa (Merxo), un fondo croma verde de estudio (Solivus), una foto sobre pizarra negra (Nexo Go), dos capturas de navegador sobre blanco (Maison Oliva, NBL) y una fotografía arquitectónica en blanco y negro (Cornish).
- **Tres clases de recurso disfrazadas de una sola**: renders con entorno inventado (Greenery, Mente, Merxo, Solivus, Nexo Go), capturas de navegador pegadas en plano (Maison Oliva, NBL) y fotografía del sitio real (Cornish). Puestas en rejilla, la mezcla se lee como inconsistencia, no como variedad.
- **La portada de Greenery contradice su propio caso.** El caso dice, literalmente, «sin neones, sin hojas de marihuana caricaturescas, verde botánico, no verde cannabis». La portada es exactamente eso que el texto dice haber rechazado.
- **El fondo croma de Solivus** es un verde de recorte. Parece un recurso sin terminar.
- **Cornish es, hoy, la portada más cerca del objetivo**: fotografía real, luz controlada, espacio negativo, tipografía que respira. Sirve de referencia de nivel.

## 4. Tecnología y herramientas disponibles

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind 3.4, GSAP + ScrollTrigger, Lenis, `next/image`.
- **CMS**: Sanity (`h169b4gl`, dataset `production`). Lectura pública; escritura con `SANITY_API_WRITE_TOKEN`. Los assets pasan por el CDN de Sanity, que ya sirve WebP/AVIF y recorte por URL.
- **Captura**: Playwright instalado y usado en este repositorio (los pares escritorio/móvil de Cornish y NBL salieron de ahí).
- **Composición de imagen**: `sharp` disponible vía `node_modules` del proyecto.
- **Higgsfield**: ✅ **conexión funcional y autorizada**, plan `plus`, **226 créditos**. Modelos útiles:

| Para | Modelo | Por qué |
|---|---|---|
| Capa A — fondos | `cinematic_studio_2_5` (Higgsfield Cinema Studio 2.5) | Fotograma cinematográfico, 16:9, hasta 4K |
| Capa A alternativa | `nano_banana_2` (Google) | 4K, acepta imagen de referencia para mantener el universo entre fondos |
| Capa B — piezas 3D | `recraft_v4_1` en `model_type: utility` | Producto limpio y frontal, con `background_color` fijo, que hace trivial el recorte |
| Recorte | `remove_background` | Resuelve la transparencia real que el brief pide |

Ningún modelo entrega alfa directo: las piezas de la Capa B se generan sobre fondo plano y se recortan con `remove_background`. No hay que simular fondos a cuadros en ningún momento.

**No he gastado créditos todavía.** Mido el consumo real en la primera generación antes de lanzar una tanda.

## 5. El obstáculo serio

La Capa C del brief —capturas reales, sin que ningún modelo reescriba la interfaz— **solo es posible en cuatro de los ocho proyectos**: NBL, Cornish, Maison Oliva y Mente. Son los que tienen sitio público en línea.

**Solivus, Merxo, Nexo Go y Greenery 420 no tienen URL pública registrada.** De esos cuatro no existe interfaz que capturar: lo único real son los renders que ya están en el CMS. Para ellos, la Capa C tiene que salir de esos archivos, recompuestos sobre el fondo nuevo, no de Playwright.

Es exactamente la mitad del portafolio, así que conviene resolverlo antes de la Etapa 2.

## 6. Propuesta de pilotos (Etapa 2)

Tres proyectos de categorías distintas que además ponen a prueba los dos caminos de la Capa C:

1. **Cornish Arquitectos** — arquitectura, sitio en línea. Captura real con Playwright. Es la vara de medir.
2. **Solivus** — SaaS, sin sitio. Recomposición de los renders del CMS. El caso difícil.
3. **NBL** — e-commerce, sitio en línea. Escritorio + móvil, producto y marca.

Si el sistema aguanta estos tres, aguanta los nueve.

## 7. Qué está pendiente de decisión

1. Si Solivus, Merxo, Nexo Go o Greenery 420 tienen algún sitio, prototipo o archivo original que yo no conozca.
2. Si el sistema nuevo sustituye la rejilla de `/proyectos` y además reemplaza las portadas del home, o solo `/proyectos` por ahora.

---

Nada de lo anterior toca el código publicado. El siguiente paso es la Etapa 2.
