import type { Product } from '@/types/product'

/**
 * The store's fixtures. Same shape the CMS returns, so the pages render fully
 * before a single document exists in Sanity.
 *
 * Two things here are placeholders on purpose, and both are one-line edits:
 *
 * - `fallbackBuyUrl` points at REEMPLAZAR-… until the real Contra listings are
 *   pasted in. It is where the buy button goes while Lemon Squeezy is being
 *   verified, so a wrong URL is visible rather than silent.
 * - Prices are plausible, not final. They live in the licence tiers.
 *
 * `lemonCheckoutUrl` is deliberately absent everywhere: the day the shop is
 * approved, adding it to a licence is what flips that button from the
 * marketplace to the checkout overlay.
 */

const CONTRA = 'https://contra.com/alexander_moreno/REEMPLAZAR'

const pt = (key: string, text: string) => ({
  _type:    'block' as const,
  _key:     key,
  style:    'normal' as const,
  markDefs: [],
  children: [{ _type: 'span' as const, _key: `${key}s`, marks: [], text }],
})

export const MOCK_PRODUCTS: Product[] = [
  {
    _id:    'product-tech-specs-viewer',
    title:  'TechSpecsViewer',
    slug:   { current: 'tech-specs-viewer' },
    type:   'component',
    status: 'available',
    tagline: 'Ficha técnica interactiva con hotspots sobre la imagen del producto.',
    cover:  null,
    demoVideoUrl:  null,
    muxPlaybackId: null,
    price:  null,
    compatibility: ['Framer'],
    badge:    'Más vendido',
    featured: true,
    order:    1,
    fallbackBuyUrl: `${CONTRA}-tech-specs-viewer`,
    licenses: [
      { _key: 'l1', name: 'Personal',  price: 29, description: 'Un proyecto propio. Actualizaciones incluidas.' },
      { _key: 'l2', name: 'Unlimited', price: 79, description: 'Proyectos ilimitados, también de clientes.' },
    ],
    description: [
      pt('d1', 'Un visor de especificaciones para páginas de producto: la imagen al centro, puntos marcados sobre ella y, al tocarlos, la ficha de esa pieza. Pensado para hardware, pero sirve para cualquier producto con detalles que explicar.'),
      pt('d2', 'Todo se edita desde el panel de Framer: los puntos se colocan con coordenadas en porcentaje, así que la posición aguanta cualquier tamaño de pantalla.'),
    ],
    gallery: [],
    demoUrl:        'https://nexxo-techspecs.framer.website',
    freeVersionUrl: 'https://www.framer.com/marketplace/',
    features: [
      { _key: 'f1', title: 'Hotspots en porcentaje',  description: 'Los puntos se quedan donde los pones, en móvil y en escritorio.', isPro: false },
      { _key: 'f2', title: 'Panel de contenido',      description: 'Título, descripción y valor por cada punto, sin tocar código.',   isPro: false },
      { _key: 'f3', title: 'Animación de entrada',    description: 'Los puntos aparecen escalonados al entrar en pantalla.',          isPro: true  },
      { _key: 'f4', title: 'Modo comparación',        description: 'Dos variantes del producto lado a lado con las mismas fichas.',   isPro: true  },
    ],
    freeVsPro: [
      { _key: 'v1', feature: 'Hotspots',           free: 'Hasta 3',  pro: 'Ilimitados' },
      { _key: 'v2', feature: 'Animación de entrada', free: '—',      pro: 'Sí' },
      { _key: 'v3', feature: 'Modo comparación',   free: '—',        pro: 'Sí' },
      { _key: 'v4', feature: 'Soporte',            free: 'Comunidad', pro: 'Directo por correo' },
    ],
    includes: ['Remix link del componente', 'README con la guía de uso', 'Actualizaciones durante un año'],
    faq: [
      { _key: 'q1', question: '¿Funciona en Framer gratis?', answer: 'Sí. El componente funciona en cualquier plan de Framer, incluido el gratuito.' },
      { _key: 'q2', question: '¿Puedo usarlo en proyectos de clientes?', answer: 'Con la licencia Unlimited, sí, en todos los que quieras. La licencia Personal cubre un solo proyecto propio.' },
    ],
    changelog: [
      { _key: 'c1', version: '1.2.0', date: '2026-08-02', notes: 'Modo comparación y mejoras de accesibilidad con teclado.' },
      { _key: 'c2', version: '1.1.0', date: '2026-05-18', notes: 'Animación de entrada escalonada.' },
      { _key: 'c3', version: '1.0.0', date: '2026-03-04', notes: 'Primera versión.' },
    ],
    bundleItems: [],
  },

  {
    _id:    'product-feature-tabs',
    title:  'FeatureTabs',
    slug:   { current: 'feature-tabs' },
    type:   'component',
    status: 'available',
    tagline: 'Pestañas de características con transición sincronizada entre texto e imagen.',
    cover:  null,
    demoVideoUrl:  null,
    muxPlaybackId: null,
    price:  null,
    compatibility: ['Framer'],
    badge:    null,
    featured: false,
    order:    2,
    fallbackBuyUrl: `${CONTRA}-feature-tabs`,
    licenses: [
      { _key: 'l1', name: 'Personal',  price: 19, description: 'Un proyecto propio. Actualizaciones incluidas.' },
      { _key: 'l2', name: 'Unlimited', price: 49, description: 'Proyectos ilimitados, también de clientes.' },
    ],
    description: [
      pt('d1', 'El bloque de características que toda landing termina necesitando: una lista a la izquierda, el detalle a la derecha y una transición que no se siente brusca al cambiar de pestaña.'),
      pt('d2', 'Avanza solo cada cierto tiempo y se detiene en cuanto el visitante toma el control, que es como debe comportarse: la reproducción automática ayuda a descubrir, no a competir con quien está leyendo.'),
    ],
    gallery: [],
    demoUrl:        'https://nexxo-featuretabs.framer.website',
    freeVersionUrl: null,
    features: [
      { _key: 'f1', title: 'Avance automático',     description: 'Con pausa al pasar el cursor o al usar el teclado.',          isPro: false },
      { _key: 'f2', title: 'Navegable con teclado', description: 'Flechas para moverse entre pestañas, como un tablist real.',  isPro: false },
      { _key: 'f3', title: 'Transiciones a medida', description: 'Fundido, desplazamiento o escala, configurables.',            isPro: true  },
      { _key: 'f4', title: 'Vertical y horizontal', description: 'La misma pieza en dos orientaciones.',                        isPro: true  },
    ],
    freeVsPro: [
      { _key: 'v1', feature: 'Pestañas',     free: 'Hasta 3', pro: 'Ilimitadas' },
      { _key: 'v2', feature: 'Transiciones', free: 'Fundido', pro: 'Tres tipos' },
      { _key: 'v3', feature: 'Orientación',  free: 'Horizontal', pro: 'Horizontal y vertical' },
    ],
    includes: ['Remix link del componente', 'README con la guía de uso'],
    faq: [
      { _key: 'q1', question: '¿Se puede usar con contenido del CMS de Framer?', answer: 'Sí. Las pestañas aceptan contenido de una colección, igual que cualquier otro componente de Framer.' },
    ],
    changelog: [
      { _key: 'c1', version: '1.1.0', date: '2026-07-11', notes: 'Orientación vertical.' },
      { _key: 'c2', version: '1.0.0', date: '2026-04-22', notes: 'Primera versión.' },
    ],
    bundleItems: [],
  },

  {
    _id:    'product-rotary-slider',
    title:  'RotarySlider',
    slug:   { current: 'rotary-slider' },
    type:   'component',
    status: 'available',
    tagline: 'Carrusel circular que se controla arrastrando, con inercia real.',
    cover:  null,
    demoVideoUrl:  null,
    muxPlaybackId: null,
    price:  null,
    compatibility: ['Framer'],
    badge:    'Nuevo',
    featured: true,
    order:    3,
    fallbackBuyUrl: `${CONTRA}-rotary-slider`,
    licenses: [
      { _key: 'l1', name: 'Personal',  price: 24, description: 'Un proyecto propio. Actualizaciones incluidas.' },
      { _key: 'l2', name: 'Unlimited', price: 59, description: 'Proyectos ilimitados, también de clientes.' },
    ],
    description: [
      pt('d1', 'Un carrusel que gira sobre un eje: las piezas se acomodan en círculo y se arrastran con el cursor o con el dedo. Al soltar, sigue girando y frena solo.'),
      pt('d2', 'Con el movimiento reducido activado en el sistema, el giro desaparece y queda una lista normal. Nadie se queda sin ver el contenido por una preferencia de accesibilidad.'),
    ],
    gallery: [],
    demoUrl:        'https://nexxo-rotaryslider.framer.website',
    freeVersionUrl: null,
    features: [
      { _key: 'f1', title: 'Arrastre con inercia', description: 'Frena con una curva física, no con un corte seco.',        isPro: false },
      { _key: 'f2', title: 'Respeta reduced motion', description: 'Se convierte en lista cuando el sistema lo pide.',       isPro: false },
      { _key: 'f3', title: 'Autorrotación',        description: 'Giro continuo y lento mientras nadie lo toca.',            isPro: true  },
      { _key: 'f4', title: 'Enlace por elemento',  description: 'Cada pieza del círculo puede llevar a una página.',        isPro: true  },
    ],
    freeVsPro: [
      { _key: 'v1', feature: 'Elementos',     free: 'Hasta 6', pro: 'Ilimitados' },
      { _key: 'v2', feature: 'Autorrotación', free: '—',       pro: 'Sí' },
      { _key: 'v3', feature: 'Enlaces',       free: '—',       pro: 'Por elemento' },
    ],
    includes: ['Remix link del componente', 'README con la guía de uso'],
    faq: [
      { _key: 'q1', question: '¿Funciona bien en móvil?', answer: 'Sí. El arrastre está hecho con eventos de puntero, así que el dedo y el cursor se comportan igual.' },
    ],
    changelog: [
      { _key: 'c1', version: '1.0.0', date: '2026-09-01', notes: 'Primera versión.' },
    ],
    bundleItems: [],
  },

  {
    _id:    'product-product-reviews',
    title:  'ProductReviews',
    slug:   { current: 'product-reviews' },
    type:   'component',
    status: 'coming_soon',
    tagline: 'Reseñas con calificación, fotos y filtros, conectadas a Supabase.',
    cover:  null,
    demoVideoUrl:  null,
    muxPlaybackId: null,
    price:  null,
    compatibility: ['Framer', 'Framer Commerce', 'Supabase'],
    badge:    null,
    featured: false,
    order:    4,
    fallbackBuyUrl: `${CONTRA}-product-reviews`,
    licenses: [
      { _key: 'l1', name: 'Personal',  price: 39, description: 'Un proyecto propio. Actualizaciones incluidas.' },
      { _key: 'l2', name: 'Unlimited', price: 99, description: 'Proyectos ilimitados, también de clientes.' },
    ],
    description: [
      pt('d1', 'Reseñas de verdad en una tienda hecha en Framer: calificación, texto, fotos de quien compró y filtros por estrellas. Los datos viven en Supabase, no en el proyecto de Framer.'),
      pt('d2', 'Todavía está en construcción. Déjame tu correo y te aviso el día que salga.'),
    ],
    gallery: [],
    demoUrl:        null,
    freeVersionUrl: null,
    features: [
      { _key: 'f1', title: 'Conectado a Supabase', description: 'Las reseñas se guardan fuera de Framer y sobreviven a cualquier rediseño.', isPro: false },
      { _key: 'f2', title: 'Fotos de clientes',    description: 'Subida de imágenes con moderación previa.',                                 isPro: true  },
      { _key: 'f3', title: 'Filtros y orden',      description: 'Por estrellas, por fecha o por utilidad.',                                  isPro: true  },
    ],
    freeVsPro: [],
    includes: ['Remix link del componente', 'SQL de Supabase listo para pegar', 'README con la guía de instalación'],
    faq: [
      { _key: 'q1', question: '¿Necesito saber SQL?', answer: 'No. El paquete trae el SQL listo: lo pegas en Supabase una vez y queda funcionando.' },
    ],
    changelog: [],
    bundleItems: [],
  },

  {
    _id:    'product-nexxo-commerce-kit',
    title:  'Nexxo Commerce Kit',
    slug:   { current: 'nexxo-commerce-kit' },
    type:   'bundle',
    status: 'coming_soon',
    tagline: 'Los cuatro componentes de tienda, en un solo paquete.',
    cover:  null,
    demoVideoUrl:  null,
    muxPlaybackId: null,
    price:  199,
    compareAtPrice: 286,
    compatibility: ['Framer', 'Framer Commerce', 'Shopify', 'Supabase'],
    badge:    null,
    featured: true,
    order:    5,
    fallbackBuyUrl: `${CONTRA}-nexxo-commerce-kit`,
    licenses: [
      { _key: 'l1', name: 'Unlimited', price: 199, description: 'Los cuatro componentes, proyectos ilimitados.' },
    ],
    description: [
      pt('d1', 'Todo lo que necesita una tienda hecha en Framer para no parecer una plantilla: ficha técnica, pestañas de características, carrusel circular y reseñas.'),
      pt('d2', 'Sale cuando ProductReviews esté terminado.'),
    ],
    gallery: [],
    demoUrl:        null,
    freeVersionUrl: null,
    features: [
      { _key: 'f1', title: 'Los cuatro componentes', description: 'Con licencia Unlimited para todos.',                      isPro: false },
      { _key: 'f2', title: 'Un solo estilo',         description: 'Comparten tokens, así que se ven como un sistema.',        isPro: false },
      { _key: 'f3', title: 'Actualizaciones',        description: 'Las versiones nuevas de cada componente, incluidas.',      isPro: false },
    ],
    freeVsPro: [],
    includes: ['Remix link de los cuatro componentes', 'README de cada uno', 'SQL de Supabase para las reseñas'],
    faq: [
      { _key: 'q1', question: '¿Y si ya compré uno por separado?', answer: 'Escríbeme antes de comprar el bundle y te descuento lo que ya pagaste.' },
    ],
    changelog: [],
    bundleItems: [
      { _id: 'product-tech-specs-viewer', title: 'TechSpecsViewer', slug: { current: 'tech-specs-viewer' }, tagline: 'Ficha técnica interactiva con hotspots sobre la imagen del producto.', cover: null, type: 'component', status: 'available',   price: 29 },
      { _id: 'product-feature-tabs',      title: 'FeatureTabs',     slug: { current: 'feature-tabs'      }, tagline: 'Pestañas de características con transición sincronizada.',             cover: null, type: 'component', status: 'available',   price: 19 },
      { _id: 'product-rotary-slider',     title: 'RotarySlider',    slug: { current: 'rotary-slider'     }, tagline: 'Carrusel circular que se controla arrastrando, con inercia real.',     cover: null, type: 'component', status: 'available',   price: 24 },
      { _id: 'product-product-reviews',   title: 'ProductReviews',  slug: { current: 'product-reviews'   }, tagline: 'Reseñas con calificación, fotos y filtros, conectadas a Supabase.',    cover: null, type: 'component', status: 'coming_soon', price: 39 },
    ],
  },
]
