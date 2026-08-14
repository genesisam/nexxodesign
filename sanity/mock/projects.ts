import type { Project } from '@/types/project'

// ─── Fixture mock ─────────────────────────────────────────────────────────────
// Shape is IDENTICAL to what the real GROQ query returns after asset URL flattening.
// null image/video URLs → gradient placeholders rendered by the UI layer.

export const MOCK_PROJECTS: Project[] = [
  // ── Merxo ─────────────────────────────────────────────────────────────────
  {
    _id:         'mock-merxo',
    title:       'Merxo',
    subtitle:    'El CRM que convierte caos comercial en pipeline predecible.',
    slug:        { current: 'merxo' },
    client:      'Merxo',
    year:        2025,
    timeline:    '6 semanas · Q1 2025',
    services:    ['Brand Design', 'Logo', 'Product Design', 'UX/UI', 'Web App'],
    vertical:    'SaaS',
    cover:       null,
    heroMedia:   null,
    metric:      '+280% velocidad de cierre',
    metrics: [
      { _key: 'm1', label: 'Velocidad de cierre',       value: '+280%' },
      { _key: 'm2', label: 'Tiempo en tareas manuales', value: '−65%'  },
      { _key: 'm3', label: 'Leads por vendedor',        value: '×2.8'  },
      { _key: 'm4', label: 'Adopción mes 1',            value: '94%'   },
    ],
    excerpt:
      'Merxo llegó con un equipo de ventas que trabajaba en hojas de cálculo, correos sin hilo ' +
      'y llamadas sin registro. Diseñamos la marca, el sistema de identidad y la plataforma CRM ' +
      'completa — desde el pipeline de leads hasta el módulo de inventario y soporte.',
    liveUrl: null,
    story: [
      {
        _type: 'overview', _key: 'ob1', label: 'El desafío',
        body: [
          { _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's1', marks: [],
              text: 'El equipo comercial de Merxo registraba sus ventas en hojas de Excel compartidas por WhatsApp. Cada vendedor tenía su propio sistema. El resultado era predecible: leads perdidos, follow-ups olvidados y cero visibilidad para la dirección sobre el estado del pipeline.',
            }] },
          { _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's2', marks: [],
              text: 'La plataforma CRM que usaban era genérica, costosa y requería tres semanas de onboarding. La mayoría del equipo la abandonaba en la semana dos.',
            }] },
        ],
      },
      { _type: 'sectionHeader', _key: 'sh1', heading: 'Marca antes que plataforma', divider: true },
      {
        _type: 'overview', _key: 'ob2', label: 'Identidad', heading: 'Un sistema que comunica seriedad comercial',
        body: [
          { _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's3', marks: [],
              text: 'Antes de diseñar una sola pantalla, construimos la identidad de Merxo. Desarrollamos el logotipo, el sistema tipográfico, la paleta de color y el tono de voz: directo, sin tecnicismos, orientado a resultados.',
            }] },
        ],
      },
      { _type: 'sectionHeader', _key: 'sh2', heading: 'El CRM que el equipo sí usa', divider: true },
      {
        _type: 'overview', _key: 'ob3', label: 'Pipeline', heading: 'Claridad en cada etapa del proceso',
        body: [
          { _type: 'block', _key: 'b4', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's4', marks: [],
              text: 'El pipeline de Merxo tiene cinco etapas configurables. Cada lead tiene su tarjeta con historial de contacto, próxima acción programada y probabilidad de cierre calculada automáticamente.',
            }] },
        ],
      },
      { _type: 'quote', _key: 'q1',
        text: '"Un CRM que el equipo abandona en dos semanas no es un CRM. Es un sistema de archivo caro."' },
      { _type: 'sectionHeader', _key: 'sh3', heading: 'Resultados a 90 días', divider: true },
      {
        _type: 'overview', _key: 'ob4', label: 'Impacto',
        body: [
          { _type: 'block', _key: 'b5', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's5', marks: [],
              text: 'A los 90 días del lanzamiento, la velocidad de cierre aumentó 280%. Los vendedores pasaron de gestionar 12 leads activos en promedio a 34. La adopción fue del 94% en el primer mes, sin training obligatorio.',
            }] },
        ],
      },
      {
        _type: 'feedback', _key: 'fb1',
        quote:   'Teníamos el equipo de ventas correcto. Nos faltaba el sistema. Merxo no solo es un CRM — es la diferencia entre saber que vamos a cerrar y esperar que pase.',
        name:    'Equipo Merxo',
        role:    'Founders',
        company: 'Merxo',
      },
    ],
    nextProject: {
      title:    'Nexo Go',
      slug:     { current: 'nexo-go' },
      cover:    '/images/projects/nexo-go/cover.png',
      vertical: 'SaaS',
    },
  },

  // ── Nexo Go ───────────────────────────────────────────────────────────────
  {
    _id:         'mock-nexo-go',
    title:       'Nexo Go',
    subtitle:    'Tu bicicleta eléctrica, siempre visible. Siempre segura.',
    slug:        { current: 'nexo-go' },
    client:      'Nexo Go',
    year:        2025,
    timeline:    '10 semanas · Q2 2025',
    services:    ['Brand Design', 'Mobile Design', 'UX/UI', 'IoT UX', 'Wearable Integration'],
    vertical:    'SaaS',
    cover:       '/images/projects/nexo-go/cover.webp',
    heroMedia:   null,
    metric:      '0 robos entre usuarios activos',
    metrics: [
      { _key: 'm1', label: 'Robos (usuarios activos)', value: '0'      },
      { _key: 'm2', label: 'Tiempo de uso diario',     value: '+340%'  },
      { _key: 'm3', label: 'Valoración App Store',     value: '4.9 ★' },
      { _key: 'm4', label: 'Respuesta a alertas',      value: '<2 min' },
    ],
    excerpt:
      'Las bicicletas eléctricas cuestan entre $800 y $3.000 USD. Sus dueños no saben dónde están ' +
      'cuando las dejan estacionadas, ni reciben alertas si alguien las mueve. Diseñamos la app ' +
      'móvil y la identidad de Nexo Go desde cero: la compañera digital de tu e-bike.',
    liveUrl: null,
    story: [
      {
        _type: 'overview', _key: 'ob1', label: 'El problema',
        body: [
          { _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's1', marks: [],
              text: 'Una bicicleta eléctrica premium tiene más tecnología que un teléfono de hace cinco años. Pero todo ese hardware no tenía interfaz. El dueño no sabía nada de su bici a menos que estuviera montado en ella.',
            }] },
          { _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's2', marks: [],
              text: 'Los robos de e-bikes crecieron 340% en ciudades latinoamericanas en los últimos tres años. La respuesta del mercado era un candado. Nexo Go vio algo diferente: una categoría sin capa digital.',
            }] },
        ],
      },
      { _type: 'media', _key: 'md0', mediaType: 'image' as const,
        url: '/images/projects/nexo-go/screen-1.webp', caption: 'App interface — Nexo Go' },
      { _type: 'sectionHeader', _key: 'sh1', heading: 'Identidad en movimiento', divider: true },
      {
        _type: 'overview', _key: 'ob2', label: 'Branding', heading: 'Verde eléctrico: energía y confianza simultáneas',
        body: [
          { _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's3', marks: [],
              text: 'Nexo Go usa verde eléctrico (#00D97E) como acento primario, negro técnico y blanco puro. El logotipo es una N estilizada que sugiere trayectoria. No es un logo de bicicletas: es un logo de tecnología que vive en una bicicleta.',
            }] },
        ],
      },
      { _type: 'media', _key: 'md1', mediaType: 'image' as const,
        url: '/images/projects/nexo-go/story-1.webp', caption: 'Ciclista usando la app en ruta' },
      { _type: 'sectionHeader', _key: 'sh2', heading: 'La bici como nunca la habías visto', divider: true },
      {
        _type: 'overview', _key: 'ob3', label: 'Dashboard', heading: 'Todo lo que necesitas, en un vistazo',
        body: [
          { _type: 'block', _key: 'b4', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's4', marks: [],
              text: 'La pantalla principal muestra el estado de la bici en tiempo real: nivel de batería con autonomía restante en km, estado y el mapa con ubicación actual. Todo visible sin scroll, sin submenús, sin fricción.',
            }] },
        ],
      },
      { _type: 'quote', _key: 'q1',
        text: '"La mejor seguridad no es la que reacciona cuando te roban. Es la que evita el robo."' },
      { _type: 'media', _key: 'md2', mediaType: 'image' as const,
        url: '/images/projects/nexo-go/screen-2.webp', caption: 'Dashboard de seguridad' },
      { _type: 'sectionHeader', _key: 'sh3', heading: 'Seguridad que actúa, no que avisa tarde', divider: true },
      {
        _type: 'overview', _key: 'ob4', label: 'Anti-robo',
        body: [
          { _type: 'block', _key: 'b5', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's5', marks: [],
              text: 'Si alguien mueve la bicicleta sin autorización, Nexo Go envía una notificación push en menos de 2 minutos. El modo anti-robo se activa automáticamente cuando el usuario se aleja más de 50 metros.',
            }] },
        ],
      },
      { _type: 'media', _key: 'md3', mediaType: 'image' as const,
        url: '/images/projects/nexo-go/story-2.webp', caption: 'Mockups — Nexo Go iOS' },
      { _type: 'sectionHeader', _key: 'sh4', heading: 'En tu muñeca mientras pedaleas', divider: true },
      {
        _type: 'overview', _key: 'ob5', label: 'Wearable',
        body: [
          { _type: 'block', _key: 'b6', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's6', marks: [],
              text: 'La integración con Apple Watch y Wear OS permite ver la batería, velocidad actual y recibir alertas directamente en la muñeca. El tapping háptico diferenciado avisa batería baja, alertas de seguridad u objetivos de distancia.',
            }] },
        ],
      },
      {
        _type: 'feedback', _key: 'fb1',
        quote:   'Queríamos que la gente se sintiera segura con su bicicleta. Nexxo diseñó algo mejor: una app que hace que quieran usarla más. La retención a 6 meses es del 91%.',
        name:    'Equipo Nexo Go',
        role:    'Founders',
        company: 'Nexo Go',
      },
    ],
    nextProject: {
      title:    'Greenery 420',
      slug:     { current: 'greenery-420' },
      cover:    null,
      vertical: 'Web',
    },
  },

  // ── Greenery 420 ─────────────────────────────────────────────────────────
  {
    _id:         'mock-greenery-420',
    title:       'Greenery 420',
    subtitle:    'El bienestar del cáñamo, sin disculpas.',
    slug:        { current: 'greenery-420' },
    client:      'Greenery 420 CBD',
    year:        2025,
    timeline:    '4 semanas · Q3 2024',
    services:    ['Brand Design', 'E-commerce', 'UX/UI', 'Shopify', 'Fotografía de producto'],
    vertical:    'Web',
    cover:       null,
    heroMedia:   null,
    metric:      '+185% conversión vs benchmark wellness',
    metrics: [
      { _key: 'm1', label: 'Conversión vs benchmark',  value: '+185%' },
      { _key: 'm2', label: 'Valor medio del pedido',   value: '×3.2'  },
      { _key: 'm3', label: 'Clientes recurrentes 90d', value: '68%'   },
      { _key: 'm4', label: 'Valoración tienda',        value: '4.8 ★' },
    ],
    excerpt:
      'Las tiendas CBD en España parecen una farmacia genérica o un head shop de los 90. ' +
      'Greenery 420 llegó con un brief claro: ser la primera marca de wellness de cáñamo en Madrid ' +
      'que se ve y comunica como una casa de lujo accesible. Diseñamos la identidad y la tienda Shopify desde cero.',
    liveUrl: null,
    story: [
      {
        _type: 'overview', _key: 'ob1', label: 'El reto',
        body: [
          { _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's1', marks: [],
              text: 'El mercado CBD en España creció un 340% entre 2020 y 2024. Pero la estética del sector no creció con él. Greenery 420 tenía los productos correctos: aceites de espectro completo, flores premium, hachís CBD artesanal, vapes y una línea wellness. El producto era serio. La marca necesitaba serlo también.',
            }] },
        ],
      },
      { _type: 'sectionHeader', _key: 'sh1', heading: 'Una marca que no pide perdón', divider: true },
      {
        _type: 'overview', _key: 'ob2', label: 'Identidad',
        body: [
          { _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's2', marks: [],
              text: 'Verde musgo oscuro (#2D4A2B), negro noche y crema natural. Sin neones. Sin hojas de marihuana caricaturescas. Tipografía editorial: serif elegante para headlines, sans-serif técnica para información de producto.',
            }] },
        ],
      },
      { _type: 'sectionHeader', _key: 'sh2', heading: 'Vender por beneficio, no por producto', divider: true },
      {
        _type: 'overview', _key: 'ob3', label: 'E-commerce',
        body: [
          { _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's3', marks: [],
              text: 'El 73% de los compradores de CBD llegan sin saber qué necesitan. Diseñamos la arquitectura de la tienda por beneficio: Sueño · Estrés · Dolor · Foco · Wellness. Dentro de cada categoría, el usuario ve los productos recomendados con una explicación de por qué ese formato funciona para ese objetivo.',
            }] },
        ],
      },
      { _type: 'quote', _key: 'q1',
        text: '"Un cliente que entiende lo que compra no devuelve el pedido. Un cliente que confía en la marca vuelve a comprar."' },
      {
        _type: 'feedback', _key: 'fb1',
        quote:   'Teníamos miedo de que una marca premium alejara a nuestros clientes habituales. Pasó lo contrario: atrajo exactamente al cliente que queríamos. Nexxo entendió eso desde el primer brief.',
        name:    'Equipo Greenery 420',
        role:    'Founders',
        company: 'Greenery 420 CBD · Madrid',
      },
    ],
    nextProject: {
      title:    'Maison Oliva',
      slug:     { current: 'maison-oliva' },
      cover:    null,
      vertical: 'Web',
    },
  },

  // ── Maison Oliva ──────────────────────────────────────────────────────────
  {
    _id:         'mock-maison-oliva',
    title:       'Maison Oliva',
    subtitle:    'Alta costura española. Diseñada para vivir en pantalla.',
    slug:        { current: 'maison-oliva' },
    client:      'Maison Oliva',
    year:        2025,
    timeline:    '5 semanas · Q4 2024',
    services:    ['Art Direction', 'E-commerce Design', 'Shopify', 'UX/UI', 'Mobile Design'],
    vertical:    'Web',
    cover:       null,
    heroMedia:   null,
    metric:      '+240% tiempo en sitio vs benchmark moda',
    metrics: [
      { _key: 'm1', label: 'Tiempo en sitio vs benchmark', value: '+240%'      },
      { _key: 'm2', label: 'Valor medio del pedido',       value: '×4.6'       },
      { _key: 'm3', label: 'Tasa de retorno a 60 días',    value: '71%'        },
      { _key: 'm4', label: 'Diseño 100% custom',           value: '0 templates' },
    ],
    excerpt:
      'La alta costura tiene una relación complicada con el e-commerce. Un Shopify genérico mata el ' +
      'ritual de compra de una pieza de $800. Diseñamos e implementamos el e-commerce completo de ' +
      'Maison Oliva desde cero — desktop y móvil — para que la experiencia digital tenga el mismo peso que la física.',
    liveUrl: null,
    story: [
      {
        _type: 'overview', _key: 'ob1', label: 'La tensión',
        body: [
          { _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's1', marks: [],
              text: 'Un tema de Shopify genérico, fotografías inconsistentes, sin jerarquía tipográfica, sin narrativa de colección. La tienda comunicaba lo opuesto a la ropa que vendía. El brief fue claro: "Quiero que mi tienda online se sienta como entrar a mi atelier."',
            }] },
        ],
      },
      { _type: 'sectionHeader', _key: 'sh1', heading: 'Antes del diseño, el lenguaje', divider: true },
      {
        _type: 'overview', _key: 'ob2', label: 'Art direction',
        body: [
          { _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's2', marks: [],
              text: 'Fotografía oversize como protagonista, tipografía serif grande y arquitectónica, espacio en blanco que hace que cada pieza respire. El scroll es lento e intencionado. Cada colección se presenta como un capítulo: título, nota del diseñador, editorial fotográfica, y solo entonces el catálogo.',
            }] },
        ],
      },
      { _type: 'sectionHeader', _key: 'sh2', heading: 'Mobile-first, sin concesiones', divider: true },
      {
        _type: 'overview', _key: 'ob3', label: 'Mobile',
        body: [
          { _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's3', marks: [],
              text: 'El 74% del tráfico llega de Instagram. Galería con swipe horizontal nativo, carrito persistente como panel lateral, checkout en dos pasos. Sin crear cuenta obligatoria. La transición de Instagram a la ficha de producto en dos toques.',
            }] },
        ],
      },
      { _type: 'quote', _key: 'q1',
        text: '"Quien entra a comprar alta costura no quiere velocidad. Quiere certeza. El diseño tiene que convencer, no urgir."' },
      {
        _type: 'feedback', _key: 'fb1',
        quote:   'Llevo años construyendo una estética. Nunca había tenido una tienda online que la representara. Nexxo lo entendió desde el primer día: no era un proyecto de e-commerce, era un proyecto de identidad con carrito de compra.',
        name:    'Diseñador, Maison Oliva',
        role:    'Creative Director & Founder',
        company: 'Maison Oliva · Madrid',
      },
    ],
    nextProject: {
      title:    'Solivus',
      slug:     { current: 'solivus' },
      cover:    '/images/projects/solivus/cover.png',
      vertical: 'SaaS',
    },
  },

  // ── Solivus ───────────────────────────────────────────────────────────────
  {
    _id:         'mock-solivus',
    title:       'Solivus',
    subtitle:    'Plataforma de monitoreo solar que convierte datos complejos en decisiones simples.',
    slug:        { current: 'solivus' },
    client:      'Solivus',
    year:        2025,
    timeline:    '8 semanas · Q4 2024',
    services:    ['Product design', 'Dashboard UI/UX', 'Mobile design', 'Branding'],
    vertical:    'SaaS',
    cover:       '/images/projects/solivus/cover.png',
    heroMedia:   null,
    metric:      '−47% tiempo de respuesta a alertas',
    metrics: [
      { _key: 'm1', label: 'Respuesta a alertas', value: '−47%'  },
      { _key: 'm2', label: 'Adopción plataforma', value: '+210%' },
      { _key: 'm3', label: 'Sesiones diarias',    value: '×3.1'  },
      { _key: 'm4', label: 'NPS operadores',      value: '82'    },
    ],
    excerpt:
      'Solivus opera activos solares para empresas en 6 países. Su plataforma previa ' +
      'requería capacitación de 3 semanas para interpretar los datos. Diseñamos el dashboard, ' +
      'la app móvil y el sistema de alertas desde cero — priorizando la densidad de información ' +
      'sin sacrificar la claridad operativa.',
    liveUrl: null,

    story: [
      {
        _type: 'overview',
        _key:  'ob1',
        label: 'El desafío',
        body: [
          {
            _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's1', marks: [],
              text: 'Los operadores de plantas solares gestionan docenas de variables en tiempo real: temperatura de panel, eficiencia de conversión, consumo vs producción, impacto climático. La plataforma existente de Solivus mostraba todos estos datos, pero en una interfaz diseñada por ingenieros para ingenieros: números en tablas, sin jerarquía visual, sin contexto accionable.',
            }],
          },
          {
            _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's2', marks: [],
              text: 'El resultado: los operadores tardaban 3 semanas en capacitarse y, aun así, el tiempo medio de respuesta a alertas críticas era de 34 minutos. Cada minuto fuera de rango equivale a pérdida de energía generada y posibles daños de equipo.',
            }],
          },
        ],
      },

      {
        _type:     'media',
        _key:      'm1',
        mediaType: 'image',
        url:       '/images/projects/solivus/dashboard-imac.jpg',
        caption:   'Dashboard principal — Solar Plant Overview en iMac',
        size:      'lg',
      },

      { _type: 'sectionHeader', _key: 'sh1', heading: 'Arquitectura del dato', divider: true },

      {
        _type:   'overview',
        _key:    'ob2',
        label:   'Enfoque de diseño',
        heading: 'Del dato al insight en 3 segundos',
        body: [
          {
            _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's3', marks: [],
              text: 'Empezamos con un audit de las 48 métricas que la plataforma mostraba. Solo 9 requerían atención inmediata; el resto eran contexto. Diseñamos una jerarquía de tres capas: estado crítico (visible al primer vistazo), métricas operativas (accesibles con un clic) y datos históricos (bajo demanda).',
            }],
          },
          {
            _type: 'block', _key: 'b4', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's4', marks: [],
              text: 'El dashboard principal muestra output actual vs pico, temperatura de panel, eficiencia y potencia en tiempo real — todo en la pantalla inicial sin scroll.',
            }],
          },
        ],
      },

      {
        _type: 'splitShow',
        _key:  'ss1',
        items: [
          { _key: 'si1', mediaType: 'image', url: '/images/projects/solivus/analytics-desktop.webp', size: 'ms', caption: 'Analytics page — gráfico de generación vs consumo mensual' },
          { _key: 'si2', mediaType: 'image', url: '/images/projects/solivus/ipad-tilted.png',       size: 'sm', caption: 'Vista tablet — modo operador de campo, rotación natural' },
          { _key: 'si3', mediaType: 'image', url: '/images/projects/solivus/metric-cards.png',      size: 'sm', caption: 'Tarjetas de métricas — Energía generada y Consumo mensual' },
          { _key: 'si4', mediaType: 'image', url: '/images/projects/solivus/widget-power.png',      size: 'ms', caption: 'Widget de potencia actual — Solar, Grid y Battery en tiempo real' },
        ],
      },

      { _type: 'quote', _key: 'q1', text: '"Un panel solar que nadie entiende es un panel solar que nadie optimiza."' },

      { _type: 'sectionHeader', _key: 'sh2', heading: 'App móvil para operadores de campo', divider: true },

      {
        _type:   'overview',
        _key:    'ob3',
        label:   'Mobile experience',
        heading: 'Diagnóstico en segundos, en el campo',
        body: [
          {
            _type: 'block', _key: 'b5', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's5', marks: [],
              text: 'Los técnicos de campo necesitan diagnosticar un panel en segundos, con el sol de frente y guantes puestos. Diseñamos la app móvil con tap targets de mínimo 48px, modo alto contraste automático bajo luz solar y jerarquía de información invertida.',
            }],
          },
          {
            _type: 'block', _key: 'b6', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's6', marks: [],
              text: 'La pantalla de Panels muestra el selector de panel, estado (Efficient / Warning / Critical), métricas de rendimiento y el historial de mantenimiento — todo con una mano.',
            }],
          },
        ],
      },

      {
        _type: 'splitShow',
        _key:  'ss2',
        items: [
          { _key: 'si5', mediaType: 'image', url: '/images/projects/solivus/mobile-panels.png',    size: 'ms', caption: 'Panels screen — Beta-0296, estado Efficient, eficiencia 92%' },
          { _key: 'si6', mediaType: 'image', url: '/images/projects/solivus/mobile-phones.webp',   size: 'sm', caption: 'Dashboard + Panels — flujo completo en iPhone 15 Pro' },
          { _key: 'si7', mediaType: 'image', url: '/images/projects/solivus/mobile-analytics.png', size: 'sm', caption: 'Analytics móvil — resumen diario, generación y consumo mensual' },
          { _key: 'si8', mediaType: 'image', url: '/images/projects/solivus/mobile-landscape.webp',size: 'ms', caption: 'Dashboard en uso real — operador de campo, orientación paisaje' },
        ],
      },

      { _type: 'sectionHeader', _key: 'sh3', heading: 'Alertas que activan, no que informan', divider: true },

      {
        _type:   'overview',
        _key:    'ob4',
        label:   'Alert system',
        heading: 'Push notifications contextuales',
        body: [
          {
            _type: 'block', _key: 'b7', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's7', marks: [],
              text: 'Rediseñamos el sistema de notificaciones para que cada alerta incluya el contexto necesario para actuar sin abrir la app. El tiempo de respuesta cayó de 34 a 18 minutos (−47%).',
            }],
          },
        ],
      },

      {
        _type: 'splitShow',
        _key:  'ss3',
        items: [
          { _key: 'si9',  mediaType: 'image', url: '/images/projects/solivus/notification.png',    size: 'ms', caption: 'Push notification — alerta contextual con acción directa' },
          { _key: 'si10', mediaType: 'image', url: '/images/projects/solivus/panels-desktop.png',  size: 'sm', caption: 'Panels desktop — selector de panel y métricas detalladas' },
          { _key: 'si11', mediaType: 'image', url: '/images/projects/solivus/analytics-cards.png', size: 'sm', caption: 'Analytics cards — Autoconsumo 78%, Consumo $92/mes' },
          { _key: 'si12', mediaType: 'image', url: '/images/projects/solivus/laptop-analytics.png',size: 'ms', caption: 'Analytics en laptop — estado de inversor y tarifa y ahorro' },
        ],
      },

      { _type: 'sectionHeader', _key: 'sh4', heading: 'Identidad: tecnología solar con carácter', divider: true },

      {
        _type:   'overview',
        _key:    'ob5',
        label:   'Branding',
        heading: 'Un ícono que se reconoce en cualquier superficie',
        body: [
          {
            _type: 'block', _key: 'b9', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's9', marks: [],
              text: 'El logotipo de Solivus combina un símbolo solar (círculo + rayos) en forma de mano abierta — energía y acción. El naranja (#FF8C00) comunica calor solar y visibilidad en campo.',
            }],
          },
        ],
      },

      {
        _type: 'splitShow',
        _key:  'ss4',
        items: [
          { _key: 'si13', mediaType: 'image', url: '/images/projects/solivus/brand-cubes.png',    size: 'ms', caption: '3D brand exploration — sistema en tres aplicaciones de color' },
          { _key: 'si14', mediaType: 'image', url: '/images/projects/solivus/brand-wall.png',     size: 'sm', caption: 'Señalética de planta — "Optimizando energía solar."' },
          { _key: 'si15', mediaType: 'image', url: '/images/projects/solivus/brand-sticker.png',  size: 'sm', caption: 'Stickers — sistema de marca en superficies físicas' },
          { _key: 'si16', mediaType: 'image', url: '/images/projects/solivus/brand-signage.png',  size: 'ms', caption: 'Luz de caja — ícono neón en instalación permanente' },
        ],
      },

      { _type: 'quote', _key: 'q2', text: '"La energía solar es invisible. Nuestro trabajo fue hacer que los datos sean tan claros como el sol."' },

      { _type: 'sectionHeader', _key: 'sh5', heading: 'Impacto medible', divider: true },

      {
        _type:   'overview',
        _key:    'ob6',
        label:   'Resultados a 90 días',
        body: [
          {
            _type: 'block', _key: 'b11', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's11', marks: [],
              text: 'A los 90 días del lanzamiento, el tiempo de respuesta a alertas cayó de 34 a 18 minutos (−47%). La adopción de la plataforma creció 210% trimestral. El NPS del equipo técnico pasó de 41 a 82.',
            }],
          },
          {
            _type: 'block', _key: 'b12', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's12', marks: [],
              text: 'Solivus utilizó la app como argumento de venta con nuevos clientes industriales. La experiencia de la plataforma se convirtió en un diferenciador comercial.',
            }],
          },
        ],
      },

      {
        _type:   'feedback',
        _key:    'fb1',
        quote:   'Antes de trabajar con Nexxo, nuestra plataforma era un repositorio de datos. Ahora es una herramienta que nuestros operadores eligen usar. Eso cambió la operación y cambió cómo vendemos.',
        name:    'Equipo Solivus',
        role:    'Founders',
        company: 'Solivus',
      },
    ],


    nextProject: {
      title:    'Merxo',
      slug:     { current: 'merxo' },
      cover:    null,
      vertical: 'SaaS',
    },
  },

  // ── Tolvia ────────────────────────────────────────────────────────────────
  {
    _id:         'mock-tolvia',
    title:       'Tolvia',
    subtitle:    'La IA conversacional que atiende a tus clientes con voz humana, a cualquier hora.',
    slug:        { current: 'tolvia' },
    client:      'Tolvia',
    year:        2025,
    timeline:    '10 semanas · Q2 2025',
    services:    ['Brand Design', 'Logo', 'Web Design', 'App Design', 'Motion & Video', 'IA aplicada'],
    vertical:    'IA',
    cover:       null,
    heroMedia:   null,
    metric:      '87% conversaciones resueltas sin agente',
    metrics: [
      { _key: 'm1', label: 'Primera respuesta',            value: '−92%' },
      { _key: 'm2', label: 'Conversaciones automatizadas', value: '87%'  },
      { _key: 'm3', label: 'Satisfacción del cliente',     value: '+68%' },
      { _key: 'm4', label: 'Tickets a agente humano',      value: '−73%' },
    ],
    excerpt:
      'Los equipos de soporte de Tolvia respondían hasta 3.000 tickets al mes con agentes humanos. ' +
      'Los clientes esperaban horas. La IA genérica frustraba más de lo que ayudaba. ' +
      'Diseñamos la marca completa, la web, la aplicación desktop y los materiales audiovisuales — ' +
      'para posicionar a Tolvia como la voz de IA más natural del mercado latinoamericano.',
    liveUrl: null,
    story: [
      {
        _type: 'overview', _key: 'ob1', label: 'El desafío',
        body: [
          { _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's1', marks: [],
              text: 'La atención al cliente empresarial tiene un problema de escala: cada canal (web, WhatsApp, teléfono) operaba con un agente distinto, scripts diferentes y tiempos de respuesta impredecibles. Las soluciones de IA existentes sonaban a bot, no entendían el contexto y rompían la confianza del cliente en el primer mensaje ambiguo.',
            }] },
          { _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's2', marks: [],
              text: 'Tolvia tenía la tecnología — un modelo conversacional propio con comprensión de contexto real y síntesis de voz natural. Lo que no tenía era la identidad, la interfaz ni la narrativa para venderlo.',
            }] },
        ],
      },
      { _type: 'sectionHeader', _key: 'sh1', heading: 'Más que un chatbot. Una voz.', divider: true },
      {
        _type: 'overview', _key: 'ob2', label: 'Marca', heading: 'Una identidad que humaniza la IA',
        body: [
          { _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's3', marks: [],
              text: 'Diseñamos el logotipo, el sistema de identidad y el lenguaje visual de Tolvia desde cero. El brief era claro: nada de robots, nada de burbujas de chat genéricas. La marca debía transmitir calidez, precisión y confianza. Paleta oscura con acento verde — tecnología que no asusta.',
            }] },
          { _type: 'block', _key: 'b4', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's4', marks: [],
              text: 'El logo es una forma abstracta derivada de la onda de voz — reconocible, escalable y funciona igual en un ícono de app que en una pared de oficina. Las imágenes fueron generadas con IA y dirigidas editorialmente para mostrar personas en conversación real, no pantallas.',
            }] },
        ],
      },
      { _type: 'sectionHeader', _key: 'sh2', heading: 'La plataforma que opera sola', divider: true },
      {
        _type: 'overview', _key: 'ob3', label: 'App Desktop', heading: 'Control total para el equipo de soporte',
        body: [
          { _type: 'block', _key: 'b5', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's5', marks: [],
              text: 'La aplicación desktop de Tolvia es el centro de mando para los supervisores: panel de conversaciones en tiempo real, escalación inteligente a agente humano, configuración de flujos por canal y analítica de sentimiento. Diseñada exclusivamente para desktop — alta densidad de información, cero fricciones.',
            }] },
          { _type: 'block', _key: 'b6', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's6', marks: [],
              text: 'Cada conversación muestra el contexto acumulado, la emoción detectada y la confianza del modelo. El supervisor interviene cuando la IA lo necesita — no cuando el cliente ya se fue.',
            }] },
        ],
      },
      { _type: 'quote', _key: 'q1',
        text: '"La IA que no entiende el contexto no automatiza la atención — solo automatiza la frustración."' },
      { _type: 'sectionHeader', _key: 'sh3', heading: 'Web que convierte leads enterprise', divider: true },
      {
        _type: 'overview', _key: 'ob4', label: 'Web & Landing', heading: 'Una web hecha para decisores B2B',
        body: [
          { _type: 'block', _key: 'b7', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's7', marks: [],
              text: 'La web de Tolvia tiene un único objetivo: que el VP de Operaciones entienda en 10 segundos por qué Tolvia es diferente y agende una demo. Diseñamos la arquitectura de contenido, las secciones de prueba social y las animaciones — incluyendo una demo interactiva de conversación IA embebida en la hero.',
            }] },
          { _type: 'block', _key: 'b8', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's8', marks: [],
              text: 'Los videos de producto fueron producidos con IA generativa y dirección editorial — mostrando casos de uso reales sin grabar una sola cámara.',
            }] },
        ],
      },
      { _type: 'sectionHeader', _key: 'sh4', heading: 'Resultados en 60 días', divider: true },
      {
        _type: 'overview', _key: 'ob5', label: 'Impacto',
        body: [
          { _type: 'block', _key: 'b9', style: 'normal', markDefs: [],
            children: [{ _type: 'span', _key: 's9', marks: [],
              text: 'A los 60 días del lanzamiento, el 87% de las conversaciones se resolvían sin intervención humana. El tiempo de primera respuesta bajó 92% — de horas a segundos. La satisfacción del cliente subió 68 puntos en CSAT. Los agentes humanos pasaron a gestionar solo los casos que realmente lo necesitaban.',
            }] },
        ],
      },
      {
        _type: 'feedback', _key: 'fb1',
        quote:   'Pasamos de tener el equipo de soporte apagando incendios todo el día a tener supervisores gestionando excepciones. Tolvia no reemplazó a nuestros agentes — los hizo mejores.',
        name:    'Equipo Tolvia',
        role:    'Founders',
        company: 'Tolvia',
      },
    ],

    nextProject: {
      title:    'Solivus',
      slug:     { current: 'solivus' },
      cover:    null,
      vertical: 'SaaS',
    },
  },
]
