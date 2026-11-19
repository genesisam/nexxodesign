# Auditoría SEO · GEO · Accesibilidad — NexxoDesign

**Fecha:** 18 de noviembre de 2026
**Sitio:** https://nexxodesign.com
**Repositorio:** rama `main`, commit base `a7dde13`
**Stack:** Next.js 15.5.19 (App Router) · React 19 · Tailwind 3.4 · next-intl 4 · Sanity · GSAP + Lenis + Three.js · desplegado en Vercel

---

## 1. Resumen ejecutivo

El sitio llega a esta auditoría en mucho mejor estado del que es habitual en un portafolio con este nivel de animación. El SEO técnico está trabajado de verdad y no de forma declarativa: metadatos únicos por ruta, canónicas construidas por un helper central, 301 para `/work` y `/en`, `robots.txt` y `sitemap.xml` generados, un interruptor `NEXT_PUBLIC_NOINDEX` de tres capas para el *soft launch*, y JSON-LD extenso con `@id` estables. Y lo más importante para el posicionamiento: **el contenido se renderiza en el servidor**. Un rastreador sin ejecutar JavaScript recibe los titulares, las cifras, los cinco proyectos destacados y los once testimonios en el HTML. Eso no se podía dar por supuesto en un sitio construido sobre GSAP y WebGL, y es la base sobre la que todo lo demás funciona.

Lo que la auditoría encontró no son omisiones de estrategia, son defectos concretos. Tres importan de verdad:

1. **Siete enlaces invisibles y enfocables en todas las páginas, también en escritorio.** El menú móvil a pantalla completa se quedaba montado siempre, oculto solo con `opacity-0` y `pointer-events-none`. Tabulando desde la cabecera, el foco entraba en él y desaparecía de la vista durante siete pulsaciones. Reproducido con Playwright en escritorio a 1440 px y con `prefers-reduced-motion` en ambos estados. Fallo de WCAG 2.4.3, 2.4.7 y 4.1.2.

2. **La tipografía de display nunca cargó en producción.** La CSP del middleware autorizaba `api.fontshare.com` en `font-src`, pero Fontshare sirve los `.woff2` desde `cdn.fontshare.com`. El navegador descargaba la hoja de `@font-face`, pedía los archivos y la propia política del sitio los rechazaba. Clash Display —la fuente de todos los `h1` del sitio— caía al *sans-serif* genérico en todas las páginas. Confirmado contra la cabecera CSP de producción y contra la respuesta real de Fontshare. No produce ningún error visible: el sitio no parece roto, solo ligeramente distinto al diseño.

3. **76 nodos con contraste insuficiente**, medidos con axe-core sobre 8 rutas en escritorio y móvil. Dos causas: opacidades bajas de `smoke` y `paper` usadas en texto de 9–10 px (hasta 3.46:1 donde AA pide 4.5:1), y el violeta de marca como color de texto sobre tinta (3.15:1). El violeta está bien como relleno; no lo está como texto sobre un fondo casi negro.

Tras la intervención: **axe-core no reporta ninguna violación en 8 rutas × 2 viewports** (76 + 48 + 10 nodos → 0), la trampa de teclado está eliminada y Clash Display carga por primera vez. Build y typecheck limpios, 50 páginas generadas.

Queda pendiente, y es deliberado: no se ha medido rendimiento real. No hay datos de Core Web Vitals en este informe porque no se pudo tomar una medición fiable (§8), y una cifra inventada de Lighthouse sería peor que ninguna.

---

## 2. Tabla de hallazgos

Prioridad: **C** crítica · **A** alta · **M** media · **B** baja.
Estado: ✅ corregido y verificado · ⚠️ corregido, verificación limitada · ◻️ pendiente (recomendación).

| # | Ubicación | Problema | Impacto | Pri. | Solución | Estado |
|---|-----------|----------|---------|------|----------|--------|
| 1 | `components/sections/Nav.tsx` | El diálogo del menú móvil queda montado y enfocable siempre; 7 enlaces invisibles en el orden de tabulación en toda ruta, también en escritorio | El foco desaparece de la vista 7 pulsaciones. WCAG 2.4.3, 2.4.7, 4.1.2 | **C** | `inert` cuando está cerrado; trampa de foco, Escape y retorno de foco cuando está abierto | ✅ |
| 2 | `middleware.ts` (CSP `font-src`) | Falta `cdn.fontshare.com`, que es donde Fontshare sirve los `.woff2`. Clash Display bloqueada por la propia CSP del sitio | Toda la jerarquía tipográfica del sitio cae al *sans-serif* del sistema, en producción, sin error visible | **C** | Añadido `https://cdn.fontshare.com` a `font-src` | ✅ |
| 3 | `app/globals.css`, 17 componentes | `text-smoke/50·55·60`, `text-paper/30·35·40·45` y `.wl-count` / `.wl-caption` a 10 px: 3.37–4.16:1 | 76 nodos axe. Texto secundario y cuerpo de párrafo ilegibles. WCAG 1.4.3 | **A** | Subidas a `/70` y `/60`; `.wl-*` de `.6` a `.75` | ✅ |
| 4 | 30 archivos | El violeta de marca `#5B3DF5` como color de **texto** sobre tinta: 3.15:1 | Etiquetas, métricas y asteriscos de campo obligatorio por debajo de AA | **A** | Token nuevo `accent-soft` `#7C64F7` (mismo tono y saturación, 4.62:1 sobre tinta). `accent` sigue siendo el relleno | ✅ |
| 5 | `JournalList.tsx`, `StoreCatalog.tsx` | `role="tabpanel"` puesto sobre el propio `<ul>`: sustituye el rol de lista y deja 48 `<li>` sin padre de lista | 48 nodos axe. El lector de pantalla anuncia los artículos y productos como texto suelto, sin número de elementos | **A** | El panel pasa a ser un `<div>` envolvente; la lista vuelve a ser lista | ✅ |
| 6 | `components/sections/Testimonios.tsx` | El carrusel duplica las 10 reseñas para el bucle; las 20 quedaban expuestas | Un lector lee 20 testimonios; el texto de la sección cuenta doble para los rastreadores | **A** | La segunda copia pasa a `aria-hidden`; la primera conserva `role="article"` | ✅ |
| 7 | `components/sections/Testimonios.tsx` | Animación infinita de 48 s sin forma de detenerla salvo con el ratón | WCAG 2.2.2 (Pause, Stop, Hide). Excluye teclado y táctil | **A** | Botón Pausar/Reanudar con `aria-pressed`; pausa también al recibir foco | ✅ |
| 8 | `app/[locale]/(site)/layout.tsx` | No existía enlace para saltar al contenido | 6 controles de cabecera antes del contenido en cada página. WCAG 2.4.1 | **A** | `.skip-link` como primer elemento enfocable → `#contenido-principal` | ✅ |
| 9 | `components/sections/Testimonios.tsx` | `REVIEWS_URL = '#'` renderizado como enlace con `target="_blank"`, dos veces por página | Dos controles que se anuncian como enlace y no llevan a ningún sitio. WCAG 2.4.4 | **M** | El enlace solo se renderiza si la constante tiene valor | ✅ |
| 10 | `components/project/PaletteGrid.tsx` | `<button>` como hijo directo de `<dl>`, y `<dt>`/`<dd>`/`<p>` dentro del `<button>` | HTML inválido; la lista de definiciones se rompe para la API de accesibilidad | **M** | `<ul role="list">` + `<li>`; el par nombre/valor lo lleva el `aria-label` del botón | ✅ |
| 11 | `components/sections/PhysicsStickerWall.tsx` | `aria-label` sobre un `<div>` sin rol; anunciaba «muro interactivo» sin equivalente de teclado | Atributo ARIA prohibido; promete una interacción que no existe sin ratón | **M** | `aria-hidden="true"`: es decoración y se declara como tal | ✅ |
| 12 | `nosotros/page.tsx`, `StoreCatalog.tsx` | Salto de `h1` a `h3` (la etiqueta de sección era un `<p>`; el catálogo no tenía encabezado) | Jerarquía de encabezados rota en 2 rutas | **M** | El `<p>` de «Proceso» pasa a `h2` con las mismas clases; `h2` `sr-only` en el catálogo | ✅ |
| 13 | `components/sections/Footer.tsx` | Botón de suscripción de 16×18 px a 12 px del input: no cumple ni por tamaño ni por separación | WCAG 2.2 · 2.5.8 (Target Size) | **M** | Área de 24×24 alrededor de la flecha; el glifo no cambia | ✅ |
| 14 | `components/project/ProjectModal.tsx` | `aria-modal="true"` sin trampa de foco: Tab salía al índice de detrás, invisible tras el backdrop. Sin retorno de foco al cerrar | WCAG 2.4.3. El foco acaba en enlaces que no se ven | **M** | Trampa de foco con ciclado en ambos extremos; el foco vuelve al elemento que abrió | ✅ |
| 15 | `app/sitemap.ts` | `/galeria` ausente del sitemap pese a tener título, descripción, canónica y `h1` | Ruta indexable sin ruta de descubrimiento más allá de la navegación | **M** | Añadida (`monthly`, 0.5) | ✅ |
| 16 | `sanity/mock/projects.ts` y 2 listas de respaldo | 25.6 MB de PNG/JPG referenciados, `nexo-go/cover.png` de **12.85 MB** (4000×3000) | Solo llegan al navegador si Sanity no responde — ver §8, el impacto real es menor de lo que parece | **M** | Repuntado a WebP (generados donde faltaban): 25.6 MB → 1.15 MB en esa ruta de código | ⚠️ |
| 17 | `app/globals.css` | `--color-smoke` (`#8B8B85`) no coincidía con `--color-smoke-rgb` (`#BABAAE`), el valor que Tailwind usa de verdad | Documentación engañosa; cualquier cálculo de contraste hecho sobre el hex daba un número falso | **B** | Alineado a `#BABAAE`. El hex no se usa en ninguna parte, así que no cambia nada en pantalla | ✅ |
| 18 | sin archivo | No existía `/llms.txt` | — | **B** | Ruta generada desde los datos reales de proyectos | ✅ |
| 19 | `app/globals.css` | `@import` de Fontshare dentro de la hoja principal: cadena HTML → CSS → CSS → woff2 | La fuente de los titulares llega un viaje de red tarde. Afecta a LCP | **M** | `preconnect` a ambos hosts de Fontshare. El `@import` se mantiene (ver §7) | ⚠️ |
| 20 | `app/[locale]/(site)/proyectos/[slug]/ProjectView.tsx` | 12 `<img>` sin `width`/`height` ni `srcset`, fuera de `next/image` | Sin variantes responsivas; riesgo de CLS donde el contenedor no fija proporción | **M** | No modificado — ver §7 | ◻️ |
| 21 | `components/sections/WorkShowcase.tsx` | Tipografía en unidades `vw` (`text-[0.69vw]` ≈ 9 px a 1280 px) en toda la sección | El zoom de solo texto no la escala. Riesgo sobre WCAG 1.4.4 | **M** | No modificado — es una decisión de composición, ver §7 | ◻️ |
| 22 | `ProjectCard.tsx`, `WorkShowcase.tsx` | Etiquetas sobre la portada: `bg-ink/65` y `bg-black/25` — el contraste dependía de la fotografía | Ilegible sobre portadas claras | **M** | Subidas a `/80` y `/55`: el chip es su propio fondo oscuro | ✅ |
| 23 | `package.json` | `npm run lint` invoca `next lint`, pero no hay configuración de ESLint en el repositorio | El script pide configuración interactiva y nunca ha corrido | **B** | No modificado — ver §7 | ◻️ |
| 24 | `components/project/PaletteGrid.tsx` | Duplicado sin usar del mismo bloque dentro de `ProjectView.tsx` tras la refactorización | Código muerto; dos sitios donde arreglar el mismo defecto | **B** | Corregido el componente vivo; el duplicado ya no existe tras `a7dde13` | ✅ |
| 25 | `public/images/` | 34.5 MB en 19 archivos de más de 200 KB sin referencia en el código | Peso de despliegue; `cover.png` de 12.85 MB sigue siendo públicamente accesible | **B** | No borrado — lista en §7 para que la decisión sea tuya | ◻️ |

---

## 3. Diagnóstico SEO

### 3.1 Técnico — lo que ya estaba bien

Verificado sirviendo el *build* de producción y leyendo el HTML, ruta por ruta:

| Ruta | HTTP | `h1` | Bloques JSON-LD | Canónica |
|---|---|---|---|---|
| `/` | 200 | 1 | 11 | `https://nexxodesign.com` |
| `/proyectos` | 200 | 1 | 10 | `.../proyectos` |
| `/proyectos/merxo` | 200 | 1 | 14 | `.../proyectos/merxo` |
| `/nosotros` | 200 | 1 | 10 | `.../nosotros` |
| `/contact` | 200 | 1 | 11 | `.../contact` |
| `/journal` | 200 | 1 | 10 | `.../journal` |
| `/tienda` | 200 | 1 | 12 | `.../tienda` |
| `/galeria` | 200 | 1 | 10 | `.../galeria` |
| `/soporte` | 200 | 1 | 10 | `.../soporte` |
| `/privacidad` | 200 | 1 | 10 | `.../privacidad` |

- **Un solo `h1` por página** en las diez rutas, con título único y descriptivo.
- **Canónicas correctas y sin duplicar.** `lib/seo.ts` las construye con `localizedPath`, que respeta `localePrefix: 'as-needed'` — por eso no se genera `/es/...`, que redirigiría con 307 y rompería la canónica. El `layout.tsx` del segmento documenta explícitamente por qué *no* declara `alternates`: lo heredarían todas las páginas hijas y cada una se declararía duplicada de la home. Es un detalle que se equivoca con frecuencia y aquí está bien.
- **`hreflang` correctamente ausente.** `routing.locales` tiene un solo idioma y `buildAlternates` omite `languages` por debajo de dos locales. Verificado: 0 etiquetas `hreflang` en el HTML. Un sitio monolingüe que emite `hreflang` apunta cada alternativa a sí misma, lo que no dice nada.
- **Redirecciones 301 correctas:** `/work` → `/proyectos`, `/work/merxo` → `/proyectos/merxo`, `/en` → `/`, `/en/proyectos` → `/proyectos`. `/no-existe` responde 404.
- **`robots.txt`** permite todo salvo `/studio/` y `/api/`, y anuncia el sitemap. **`sitemap.xml`** con 42 URL, generado a partir de slugs reales de Sanity con respaldo en el repositorio.
- **`NEXT_PUBLIC_NOINDEX`** no está activo: el sitio es indexable hoy. El interruptor cubre tres capas (robots.txt, meta `robots`, cabecera `X-Robots-Tag`), lo que es más riguroso de lo normal.
- **Cabeceras de seguridad** completas: HSTS con `preload`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` y una CSP estricta sin comodines (que es precisamente por lo que el fallo nº 2 pasó inadvertido).

### 3.2 Renderizado e indexabilidad sin JavaScript

El HTML de la home, con los `<script>` eliminados, contiene **6 573 caracteres de texto visible**: el titular, la tagline, las cinco cifras, los once testimonios con nombre y empresa, y los cinco proyectos destacados con su cliente, año, métrica y disciplinas. Nada del contenido indexable depende de hidratación.

Las animaciones son seguras para el rastreo porque la opacidad inicial la aplica GSAP **después** de la hidratación, no el HTML servido: sin JavaScript, todo está visible. Y `RevealSections` lleva un *watchdog* con `IntersectionObserver` que muestra la sección a la fuerza a los 1,5 s si `ScrollTrigger` no disparó — es la clase de defensa que normalmente falta y que evita que un fallo de script deje la página en blanco.

Un detalle menor: el truco de animación letra a letra de «Ver proyecto» en `WorkShowcase` emite `V e r  p r o y e c t o` como nodos de texto separados. Está dentro de un contenedor `aria-hidden`, así que no afecta a lectores de pantalla, pero los rastreadores sí lo leen: es ruido de bajo valor, repetido una vez por tarjeta.

### 3.3 Contenidos

Lo que está sólido:

- **Los casos de estudio tienen estructura real**, no galerías con pie de foto: contexto, proceso, decisiones y una barra de resultados con métricas. El commit `863c703` («cifras que se pueden comprobar») indica que las cifras ya se depuraron para que fueran verificables, y la auditoría no encontró ninguna métrica que contradiga eso.
- **Los metadatos de proyecto admiten override desde el CMS** (`meta?.title`), con respaldo sensato (`${title} — Diseño de Producto`).
- **Una sola voz** en los nueve casos, según `1eb44b0`, y se nota: no hay bloques de relleno ni descripciones de dos líneas.
- **El enlazado interno** funciona en ambos sentidos: home → proyectos, índice → caso, y el *modal* es una ruta interceptada real, así que cada caso tiene URL propia, compartible e indexable. Eso está bien resuelto y es raro verlo así.

Lo que falta, y es la oportunidad de contenido más grande que tiene el sitio:

- **No hay páginas de servicio.** Los cuatro servicios existen como `OfferCatalog` en JSON-LD y como texto en la home, pero ninguno tiene URL propia. Las consultas de intención comercial («diseño de producto SaaS», «automatización con IA para startups», «CRO landing page») no tienen a dónde aterrizar. Hoy compiten todas por la home, que ya está optimizada para marca. Es la brecha de arquitectura temática, no de redacción.
- **El `/journal` está infrautilizado** como superficie de captación: existe, tiene `Article` + `BreadcrumbList` bien montados, y es el vehículo natural para las consultas informacionales que alimentan a las comerciales.
- **No hay enlazado servicio ↔ proyecto**, porque no hay servicio al que enlazar. Cuando existan, cada caso debería enlazar a la disciplina que lo resolvió y cada servicio a los casos que lo demuestran.

---

## 4. Diagnóstico GEO — visibilidad en motores de respuesta

Antes del diagnóstico, una precisión que conviene dejar escrita: **no existe evidencia pública de que ninguno de los elementos de esta sección garantice ser citado por ChatGPT, Gemini, Perplexity o AI Overviews.** No hay «posicionamiento GEO» que optimizar de forma comprobable. Lo que sí se puede hacer es eliminar las razones por las que un sistema que *sí* lee el sitio no entendería qué hace Nexxo. Eso es lo que evalúa esta sección.

### 4.1 Lo que ya juega a favor

Esta es, con diferencia, el área más fuerte del sitio, y está hecha a conciencia:

- **Identidad explícita.** El JSON-LD declara `['Organization', 'ProfessionalService']` con `@id` estable, `founder` apuntando por `@id` a un nodo `Person` con nombre, cargo, `knowsAbout` y `sameAs` a cuatro perfiles. Las dos entidades resuelven a una sola. El `E-E-A-T` apoyado en un humano nombrado y enlazable está correctamente modelado.
- **`DefinedTermSet` con tres definiciones.** Esto es poco común y es exactamente el formato que los motores de respuesta citan con más facilidad: una definición clara de «máquina de generación de leads», «CRO» y «nurturing automático». El comentario del código lo justifica bien: los motores citan definiciones mucho antes que afirmaciones de marketing.
- **`OfferCatalog`** con los cuatro servicios y descripción en cada uno.
- **`FAQPage`** en `/contact`, construido desde el mismo catálogo de traducciones que el acordeón visible, así que el dato estructurado nunca se desincroniza del texto.
- **`Review` ×10** con autor, cargo y empresa, y `itemReviewed` apuntando a la organización. El código documenta por qué **no** hay `reviewRating` ni `AggregateRating`: no existen puntuaciones, e inventarlas sería fabricar datos. Esa decisión es correcta y además es la que un auditor busca.
- **`areaServed`**, `availableLanguage` y `contactPoint` con teléfono real.
- **Contenido accesible sin JavaScript** (§3.2), que es la condición previa para que cualquier rastreador de IA lea algo.
- **Consistencia de marca:** «Nexxo» en el JSON-LD y en los títulos, «Nexxo Design» en el pie y el dominio. Es una inconsistencia leve y vale la pena resolverla hacia una sola forma.

### 4.2 `llms.txt` — implementado, con la expectativa en su sitio

Se ha añadido `app/llms.txt/route.ts`, que genera `/llms.txt` a partir de los datos reales de proyectos. Criterio seguido:

- **No es un requisito de posicionamiento ni una garantía de visibilidad.** Es una convención que algunos motores han anunciado soportar. Se implementa porque cuesta muy poco y porque un modelo que *sí* la lea obtiene la forma del sitio en una petición en lugar de rastrear quince.
- **No contiene nada que no esté ya en el sitio.** Cada afirmación y cada cifra están en la página a la que enlaza.
- **Está generado, no escrito a mano**, para que la lista de casos no pueda divergir de la que el sitio renderiza.
- **No inventa nada.** Dice explícitamente «No hay premios, rankings ni certificaciones que reportar», porque no los hay. Las cinco cifras son las que el sitio ya publica. Devuelve 404 si `NEXT_PUBLIC_NOINDEX` está activo.

Incluye además una sección «En qué contextos es una opción relevante», que responde a la pregunta que un motor de respuesta realmente necesita resolver: no «qué es Nexxo» sino «cuándo recomendarlo».

### 4.3 Lo que falta

- **Las páginas de servicio** (§3.3) son también la mayor carencia GEO. Cuando alguien pregunta a un asistente «quién hace diseño de producto SaaS en Latinoamérica», la respuesta se construye sobre páginas dedicadas a esa pregunta.
- **El `FAQPage` solo está en `/contact`.** `/soporte` tiene contenido con forma de preguntas y no emite el dato estructurado.
- **No hay contenido orientado a preguntas reales de cliente** más allá del FAQ de contacto: cuánto cuesta, cuánto tarda, cómo es el proceso, qué pasa después de la entrega.

---

## 5. Diagnóstico de accesibilidad — WCAG 2.2 AA

**Declaración de alcance, porque importa:** lo que sigue combina axe-core 4.12.1 con pruebas manuales de teclado automatizadas vía Playwright. **Pasar axe no es conformidad WCAG.** axe cubre aproximadamente entre un tercio y la mitad de los criterios, y los que no cubre son justamente los de juicio: si un texto alternativo es *descriptivo*, si el orden de tabulación es *lógico*, si una animación es *problemática*. No se ha hecho prueba con lector de pantalla real (NVDA / VoiceOver), y por tanto **este informe no declara conformidad AA**. Declara que no quedan fallos detectables por las pruebas ejecutadas.

### 5.1 Lo que ya estaba bien

- `:focus-visible` global con contorno de 2 px y `outline-offset`, aplicado en toda la tabulación (verificado: `outline=2px` en los 22 primeros puntos de foco).
- Regla general de `prefers-reduced-motion` que neutraliza duraciones e iteraciones, y `Lenis` que se desactiva por completo en ese modo. `WorkShowcase` consulta además la preferencia antes de preparar sus timelines y sale temprano.
- El telón de entrada tiene un `failsafe` **en CSS puro** que lo retira a los 5 s si el script falla, y toca solo `visibility` y `pointer-events` para no pelearse con GSAP. Un telón que se queda pegado deja el sitio inutilizable; aquí está cubierto sin depender de JavaScript.
- **El formulario de contacto está bien hecho:** `label` con `htmlFor` en todos los campos, `aria-describedby` y `aria-invalid` condicionales, errores con `role="alert"`, `autoComplete` correcto, `required` nativo, y un *honeypot* con `tabIndex={-1}` + `aria-hidden` + `sr-only` y atributos para que los gestores de contraseñas no lo rellenen. El contraste de los mensajes de error (`red-500`, 5.13:1) cumple.
- `ProjectModal` ya cerraba con Escape, con botón y con clic en el backdrop, movía el foco al panel al abrir y bloqueaba el *scroll* de fondo tanto para Lenis como para `overflow`.
- Áreas táctiles: el botón de hamburguesa es de 64×64 y el de cierre del modal de 40×40.
- `<caption class="sr-only">` en la tabla comparativa de la tienda, `aria-current="page"` en la navegación, `h1` `sr-only` en la galería 3D.

### 5.2 Fallos encontrados y corregidos

Los nº 1, 3–14 y 22 de la tabla. Los tres de mayor consecuencia:

**La trampa de foco invisible (nº 1).** El más grave con diferencia, porque no es un matiz de etiquetado: es foco que desaparece. Medición en escritorio a 1440 px, antes y después:

```
ANTES                                  DESPUÉS
 7. "Cotiza"                  op=1      7. "Cotiza"                 op=1
 8. "Proyectos"   op=0  ← oculto        8. "Agendar llamada"        op=1
 9. "Estudio"     op=0  ← oculto        9. "Ver resultados →"       op=1
10. "Journal"     op=0  ← oculto       10. "Ver más proyectos"      op=1
11. "Tienda"      op=0  ← oculto       …
12. "Contacto"    op=0  ← oculto
13. "Cotiza tu proyecto"  op=0 ← oculto
14. "Agendar llamada"     op=0 ← oculto
15. "Agendar llamada"     op=1
```

Idéntico con `prefers-reduced-motion: reduce`, así que no era un artefacto de animación.

**Un falso positivo que conviene dejar documentado.** La misma medición mostraba también las tarjetas de proyecto con `opacity: 0` al recibir el foco, lo que parecía un segundo fallo del mismo tipo. **No lo es.** Al tabular, el navegador desplaza el elemento a la vista, eso dispara `ScrollTrigger`, y la sección se revela. Repitiendo la medición 1,4 s después de cada pulsación, todas aparecen con `op=1`. Medir inmediatamente después del Tab capturaba la animación a mitad de camino. Se verificó antes de reportarlo porque un «fallo» así habría llevado a desmontar las animaciones de entrada sin motivo.

**La tipografía bloqueada por la CSP (nº 2).** Diagnóstico y verificación:

```
ANTES   Clash Display: unloaded ×4   ·  cdn.fontshare.com → bloqueado (csp) ×10
DESPUÉS Clash Display: loaded        ·  sin peticiones de fuente rechazadas
```

### 5.3 Contraste — medición

Ratios calculados sobre la paleta real (fondo tinta `#0E0E0E`), y coincidentes con lo que reportó axe:

| Token | Antes | Después | AA texto normal |
|---|---|---|---|
| `text-smoke/50` | 3.46:1 ✗ | `/70` → 5.26:1 | ✓ |
| `text-smoke/55` | 3.70:1 ✗ | `/70` → 5.26:1 | ✓ |
| `text-smoke/60` | 4.16:1 ✗ | `/70` → 5.26:1 | ✓ |
| `text-paper/40` | 3.37:1 ✗ | `/60` → 6.29:1 | ✓ |
| `text-paper/45` | 3.97:1 ✗ | `/60` → 6.29:1 | ✓ |
| `text-accent` (texto) | 3.15:1 ✗ | `accent-soft` → 4.62:1 | ✓ |
| `.wl-count`, `.wl-caption` | 4.16:1 ✗ | `.75` → 5.26:1 | ✓ |
| Pestañas inactivas | 3.46:1 ✗ | `0.65` → 7.21:1 | ✓ |

`accent-soft` (`#7C64F7`) conserva tono (249,8°) y saturación del violeta de marca; solo sube la luminosidad hasta cruzar el umbral. `accent` sigue siendo el relleno de los CTA, donde `paper` sobre violeta ya da 5.15:1 — aclarar el relleno lo habría **empeorado** a 3.52:1, así que separar los dos usos era la única vía que no rompía algo al arreglar lo otro. En `portable-text`, que renderiza sobre fondo claro y oscuro, el acento pasó a ser parte del tema: `accent` en claro (5.15:1), `accent-soft` en oscuro.

### 5.4 Lo que no se ha podido verificar

- **Lector de pantalla real.** Sin prueba con NVDA o VoiceOver.
- **La galería 3D (`/galeria`)** tiene un `h1` `sr-only` y botón de salto, pero la escena WebGL en sí no se ha evaluado como experiencia navegable ni se ha comprobado si existe alternativa equivalente. Es el componente que más merece una revisión manual dedicada.
- **Zoom al 200 % y *reflow***: no verificado sistemáticamente. El uso extensivo de unidades `vw` para tipografía en `WorkShowcase` (nº 21) es el riesgo concreto: el zoom de página sí las escala, el zoom de solo texto no.
- **`ProjectEstimator`**, `NexxoEstudio` (estudio 3D) y el muro de físicas no se auditaron componente a componente más allá de lo que axe cubrió en las rutas probadas.

---

## 6. Mejoras implementadas

**45 archivos modificados, 2 creados, 15 WebP generados. Nada commiteado ni desplegado.**

### Archivos nuevos

| Archivo | Qué hace |
|---|---|
| `app/llms.txt/route.ts` | Genera `/llms.txt` desde los datos reales de proyectos. 404 bajo `NOINDEX`. |
| `AUDITORIA-SEO-GEO-ACCESIBILIDAD.md` | Este informe. |

### Accesibilidad

| Archivo | Cambio |
|---|---|
| `components/sections/Nav.tsx` | `inert` en el diálogo cerrado; trampa de foco, Escape, retorno de foco, `aria-controls` |
| `app/[locale]/(site)/layout.tsx` | Enlace «Saltar al contenido» + envoltorio `#contenido-principal` con `tabIndex={-1}` |
| `app/globals.css` | `.skip-link`; regla de `prefers-reduced-motion` para el carrusel; `.wl-count` / `.wl-caption` a `.75`; token `--color-accent-soft`; `--color-smoke` alineado |
| `components/sections/Testimonios.tsx` | Copia duplicada a `aria-hidden`; botón Pausar/Reanudar; pausa al recibir foco; enlaces muertos condicionados; `id="testimonios"`; `alt=""` en avatares |
| `components/project/ProjectModal.tsx` | Trampa de foco con ciclado; retorno de foco al elemento que abrió |
| `components/project/PaletteGrid.tsx` | `<dl>`+`<button>` inválido → `<ul role="list">` + `<li>`; `dt`/`dd`/`p` → `span` |
| `app/[locale]/(site)/journal/JournalList.tsx`, `components/store/StoreCatalog.tsx` | `role="tabpanel"` fuera del `<ul>`; `h2` `sr-only` en el catálogo; pestañas inactivas a 0.65 |
| `components/sections/PhysicsStickerWall.tsx` | `aria-label` prohibido → `aria-hidden="true"` |
| `app/[locale]/(site)/nosotros/page.tsx` | Etiqueta de «Proceso» de `<p>` a `h2`, mismas clases |
| `components/sections/Footer.tsx` | Botón de suscripción a 24×24 |
| 30 archivos | `text-accent` → `text-accent-soft`; `smoke/50·55·60` → `/70`; `paper/30·35·40·45` → `/60` |
| `components/portable-text/index.tsx` | Acento y marcadores pasan a ser parte del tema claro/oscuro; tipo `Theme` ampliado |
| `tailwind.config.ts` | Color `accent-soft` |
| `messages/es.json` | `testimonios.pausar` / `.reanudar` |

### SEO, GEO y rendimiento

| Archivo | Cambio |
|---|---|
| `middleware.ts` | `cdn.fontshare.com` en `font-src` — desbloquea Clash Display |
| `app/layout.tsx` | `preconnect` a ambos hosts de Fontshare, dentro de `<body>` para que React los eleve al `<head>` |
| `app/globals.css` | Comentario que documenta el coste del `@import` y el camino al auto-hospedaje |
| `app/sitemap.ts` | `/galeria` añadida |
| `sanity/mock/projects.ts`, `SelectedWork.tsx`, `NosotrosProjects.tsx` | 17 referencias PNG/JPG → WebP |
| `public/images/projects/solivus/*.webp` | 15 WebP generados con sharp (calidad 82, lado largo ≤ 2400): 12.76 MB → 1.06 MB |
| `components/sections/ProjectCard.tsx`, `WorkShowcase.tsx` | Fondo de los chips sobre portada a `/80` y `/55` |

---

## 7. Pendiente y recomendaciones

### Requiere una decisión tuya

1. **Auto-hospedar Clash Display** (nº 19). Es el cambio de rendimiento con más retorno que queda. Hoy la fuente de todos los titulares viaja así: `HTML → globals.css → api.fontshare.com → cdn.fontshare.com → .woff2`. Descargando los `.woff2` a `/public/fonts/` y usando `next/font/local` desaparecen de golpe el viaje extra, el origen de terceros y la propia necesidad de la excepción en la CSP. El comentario original del archivo ya planteaba exactamente esto. No lo he hecho porque implica descargar e incorporar archivos de fuente al repositorio, y la licencia es una decisión tuya, no mía.

2. **La URL de reseñas** (nº 9). El enlace «Leer todas las reseñas» ahora solo se renderiza si `REVIEWS_URL` tiene valor, así que no hay enlaces muertos. Dame el perfil real (Google Business, Clutch) y vuelve a aparecer solo. Si no existe perfil público, lo correcto es dejarlo como está.

3. **Borrar los 34.5 MB sin referencia** (nº 25). No he borrado nada. Los más pesados:

   ```
   12.85 MB  /images/projects/nexo-go/cover.png
    3.44 MB  /images/projects/nexo-go/story-2.png
    2.96 MB  /images/projects/solivus/mobile-panels.png
    2.53 MB  /images/projects/nexo-go/story-1.png
    1.66 MB  /images/projects/solivus/cover.png
   ```

   Los de `nexo-go` y `solivus` tienen ya su `.webp` y están repuntados, así que el PNG no se usa. **`hero-bg.webp` y `hero-bg-mobile.webp` también aparecen sin referencia en el código: verifícalos antes de tocarlos**, porque podrían estar en contenido de Sanity, donde mi búsqueda no llega.

4. **Configurar ESLint** (nº 23). `npm run lint` no funciona: `next lint` pide configuración interactiva y no hay archivo de configuración. O se añade uno (`npx @next/codemod next-lint-to-eslint-cli .`) o se quita el script, para que no parezca que hay *linting* donde no lo hay.

### Trabajo técnico pendiente

5. **Pasar los 12 `<img>` de los casos a `next/image`** (nº 20). Ganarían `srcset`, `width`/`height` y conversión automática. No lo he hecho porque están dentro de composiciones con posicionamiento absoluto, filtros y proporciones fijas, y convertirlos a `fill` a ciegas es la clase de cambio que rompe una maquetación sin que los tests lo noten. Conviene hacerlo con el navegador delante, bloque por bloque.

6. **Revisar la tipografía en `vw`** (nº 21). `text-[0.69vw]` da unos 9 px a 1280 px, y el zoom de solo texto no la escala. Lo correcto es `clamp()` con base en `rem`, que mantiene la respuesta fluida y respeta la preferencia de tamaño del usuario. Es una decisión de composición y no la he tomado por ti.

7. **Auditar la galería 3D** manualmente (§5.4): navegación por teclado y alternativa equivalente.

8. **Verificar zoom al 200 % y *reflow*** en las rutas principales.

9. **Probar con lector de pantalla real.** Sin esto no se puede declarar conformidad AA, con independencia de lo que diga axe.

### Contenido y GEO

10. **Páginas de servicio.** Es la mayor oportunidad del sitio, para buscadores y para motores de respuesta a la vez (§3.3, §4.3). Cuatro URL, una por servicio del `OfferCatalog` que ya existe, cada una con `Service` en JSON-LD, enlazadas desde y hacia los casos que las demuestran.
11. **`FAQPage` en `/soporte`**, que ya tiene el contenido con forma de preguntas.
12. **Unificar «Nexxo» / «Nexxo Design»** hacia una sola forma pública.
13. **No añadir `AggregateRating`** mientras no haya puntuaciones reales. Lo anoto porque es la tentación obvia al ver diez reseñas sin estrellas, y la decisión actual es la correcta.

---

## 8. Resultados de las pruebas

### Entorno

- *Build* de producción (`next build`) servido con `next start`, Chromium vía Playwright 1.61.
- axe-core 4.12.1, etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`.
- 8 rutas × 2 viewports (1440×900 y 390×844), 7 s de espera tras `networkidle` para que el telón y los *reveals* terminaran.

### axe-core — antes y después

| Regla | Impacto | Criterio | Antes | Después |
|---|---|---|---|---|
| `color-contrast` | serious | 1.4.3 | 76 nodos / 16 páginas | **0** |
| `listitem` | serious | 1.3.1 | 48 nodos / 4 páginas | **0** |
| `heading-order` | moderate | — | 4 nodos / 4 páginas | **0** |
| `aria-allowed-role` | minor | — | 4 nodos / 4 páginas | **0** |
| `aria-prohibited-attr` | serious | 4.1.2 | 2 nodos / 2 páginas | **0** |
| `definition-list` | serious | 1.3.1 | 2 nodos / 2 páginas | **0** |
| **Total** | | | **136 nodos** | **0** |

```
desktop /                  0 rule(s), 0 node(s)      mobile /                  0, 0
desktop /proyectos         0 rule(s), 0 node(s)      mobile /proyectos         0, 0
desktop /proyectos/merxo   0 rule(s), 0 node(s)      mobile /proyectos/merxo   0, 0
desktop /nosotros          0 rule(s), 0 node(s)      mobile /nosotros          0, 0
desktop /contact           0 rule(s), 0 node(s)      mobile /contact           0, 0
desktop /journal           0 rule(s), 0 node(s)      mobile /journal           0, 0
desktop /tienda            0 rule(s), 0 node(s)      mobile /tienda            0, 0
desktop /soporte           0 rule(s), 0 node(s)      mobile /soporte           0, 0
```

### Pruebas funcionales

| Prueba | Resultado |
|---|---|
| Enlace de salto | Primer punto de foco. Al enfocarse: visible en `top:0 left:0`, 203×40,5 px, contorno 2 px. `Enter` mueve el foco a `#contenido-principal` |
| Menú móvil cerrado | 0 puntos de foco dentro (antes 7). `inert=""` presente en el HTML servido |
| Carrusel — pausa | `running` → clic → `paused` (`aria-pressed="true"`, etiqueta «Reanudar») → clic → `running` |
| Carrusel — reduced motion | `animation-name: none`, `transform: matrix(1,0,0,1,0,0)`: la copia anunciada se queda en su sitio |
| Testimonios expuestos | 20 hijos en la pista · 10 `aria-hidden` · 10 anunciados como `article` |
| Tipografía | `Clash Display: loaded`. Sin peticiones de fuente rechazadas por CSP |
| Hoja de estilos | `htmlBg: rgb(14,14,14)`, `navFont: IBM Plex Mono 10px` |
| Áreas táctiles | axe no reporta `target-size`. El botón de suscripción sale de la lista de infradimensionados |
| `/galeria` en sitemap | Presente. 42 URL en total |
| `/llms.txt` | HTTP 200, `text/plain`, 5 693 B, lista de casos generada |

### Build y tipos

```
✓ Compiled successfully in 22.1s
  Linting and checking validity of types ...
✓ Generating static pages (50/50)
BUILD_ID presente
tsc --noEmit: sin errores
```

`npm run lint`: **no ejecutable**, sin configuración de ESLint en el repositorio (nº 23). No es una regresión.

### Lo que NO se midió — y por qué

Esta sección es tan importante como la anterior.

- **No hay Core Web Vitals en este informe.** No se ejecutó Lighthouse ni se tomaron LCP, INP o CLS. Una medición en `localhost` sobre un portátil Windows no predice el comportamiento en producción tras la CDN de Vercel, y el sitio ya tiene `@vercel/speed-insights` instalado, que da datos de campo reales. **Mira ahí, no aquí.** No hay ninguna puntuación de Lighthouse en este documento porque no se ejecutó ninguna.
- **No hay datos de indexación.** Nada sobre páginas indexadas, posiciones ni impresiones: eso está en Search Console.
- **No se probó con lector de pantalla.**
- **La ganancia de las imágenes es condicional, y menos de lo que parece.** Medí la carga real de imágenes en las dos rutas más pesadas, producción contra *build* local:

  ```
  LIVE  (producción)  /proyectos/solivus    8 imágenes  0.54 MB
  LIVE  (producción)  /proyectos/nexo-go    8 imágenes  0.42 MB
  LOCAL (tras cambios) /proyectos/solivus   8 imágenes  0.54 MB
  LOCAL (tras cambios) /proyectos/nexo-go   8 imágenes  0.42 MB
  ```

  **Idénticas.** Esos PNG de varios MB solo estaban referenciados desde `sanity/mock/projects.ts` y dos listas `FALLBACK`, que entran en juego únicamente si Sanity no responde. En operación normal las imágenes vienen del CDN de Sanity y de las portadas cinematográficas, que ya eran WebP. Así que el cambio **no mejora el peso de hoy**: elimina un camino en el que una caída de Sanity habría servido 12,85 MB en una sola imagen, y reduce 25,6 MB a 1,15 MB en esa ruta de código. Es una mejora real de robustez, no la victoria de rendimiento que el tamaño de los archivos sugería. Lo digo así porque la conclusión contraria era la fácil de escribir.
- **`next build` falló dos veces** al recolectar *build traces* (`ENOENT ... _not-found/page.js.nft.json`) antes de empezar a funcionar de forma consistente tras limpiar `.next`. Es anterior a mis cambios —ocurrió en el primer *build* de referencia— y parece un problema de Next en Windows, no del código. En las últimas tres ejecuciones el *build* terminó limpio.
- **Nota de método:** una ejecución intermedia de axe reportó 246 violaciones de `target-size` y contrastes de 1.08:1. Era un artefacto: un servidor antiguo seguía escuchando en el puerto y servía un `.next` ya borrado, de modo que la página se renderizaba sin hoja de estilos, en Times New Roman. Lo investigué antes de «arreglar» nada y de reportarlo. Durante ese episodio atribuí erróneamente el problema a un `<link>` que había movido en el layout; esa hipótesis era falsa y el cambio quedó revertido al camino de carga conocido. Lo dejo escrito porque el informe debe reflejar también las mediciones que resultaron no serlo.

### Durante la auditoría

El repositorio recibió tres commits de otra sesión mientras esto se ejecutaba (`c33e7ad`, `6b279e3`, `a7dde13`), uno de los cuales extrajo la paleta de color de `ProjectView.tsx` al nuevo `components/project/PaletteGrid.tsx`. La corrección del hallazgo nº 10 se aplicó al componente vivo tras detectarlo. **Todos mis cambios están sin commitear en el árbol de trabajo.**

---

## 9. Roadmap priorizado

### Ya hecho — pendiente de revisión y despliegue

Los 20 hallazgos marcados ✅ / ⚠️ en §2. axe limpio, *build* y tipos limpios, nada commiteado. El siguiente paso es revisar el *diff* y desplegar; el fallo de la CSP tipográfica (nº 2) es el que cambia el aspecto del sitio en producción, así que merece una mirada visual antes de publicar.

### Sprint 1 — una tarde

1. Auto-hospedar Clash Display con `next/font/local` y eliminar el `@import` y la excepción de la CSP (nº 19).
2. Configurar ESLint o retirar el script (nº 23).
3. Borrar los archivos sin referencia, tras verificar `hero-bg*` (nº 25).
4. `FAQPage` en `/soporte` (nº 11).
5. Fijar la URL de reseñas o confirmar que no existe (nº 9).

### Sprint 2 — la semana

6. Las cuatro páginas de servicio con `Service` en JSON-LD y enlazado cruzado con los casos (nº 10 de §7). Es el trabajo de mayor impacto que queda, y sirve a SEO y GEO simultáneamente.
7. Pasar los `<img>` de los casos a `next/image`, bloque por bloque con el navegador delante (nº 20).
8. Revisión manual de accesibilidad de la galería 3D (§5.4).

### Sprint 3 — cuando haya margen

9. Tipografía en `vw` → `clamp()` sobre `rem` (nº 21).
10. Prueba con lector de pantalla real en los recorridos críticos: home, un caso, el formulario de contacto.
11. Verificación de zoom al 200 % y *reflow*.
12. Unificar la marca a una sola forma pública (nº 12).
13. Leer los Core Web Vitals reales en Speed Insights y decidir desde ahí si el 3D y las animaciones necesitan optimización. **Primero medir.** El sitio carga Three.js, GSAP, Lenis y Matter.js, y es perfectamente posible que eso cueste; también es posible que no sea el cuello de botella. La decisión de tocar las animaciones debería salir de datos de campo, no de la intuición de que «mucho JavaScript es lento».

---

## Criterios aplicados

- **Nada de métricas inventadas.** No hay puntuaciones de Lighthouse, datos de indexación, clientes, premios ni resultados comerciales en este informe. Lo que no se midió está marcado como no medido.
- **Nada de conformidad declarada por herramienta.** axe limpio ≠ WCAG 2.2 AA. §5 dice exactamente qué se probó y qué no.
- **Identidad visual preservada.** No se eliminó ninguna animación ni ninguna experiencia 3D. Los cambios de color son los mínimos para cruzar el umbral de contraste manteniendo tono y saturación; el único cambio estructural visible es un botón de pausa que WCAG 2.2.2 exige.
- **Cero dependencias nuevas.** `sharp`, `playwright` y `axe-core` ya estaban en el proyecto.
- **Nada desplegado.** Ningún commit, ningún *push*, ningún archivo borrado.
