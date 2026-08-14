import type { Post } from '@/types/post'

// ─── Fixture mock ─────────────────────────────────────────────────────────────
// Shape is IDENTICAL to what the real GROQ postBySlugQuery returns after URL flattening.
// Slugs match Journal.tsx home-section POSTS so carousel links resolve correctly.
// null image URLs → gradient placeholders rendered by the UI layer.

const AUTHOR = {
  name:   'Alexander Moreno',
  role:   'Senior UI/UX Designer · Fundador de Nexxo',
  avatar: null,
}

export const MOCK_POSTS: Post[] = [

  // ── Post 1: El diseño como ventaja competitiva ─────────────────────────────
  {
    _id:         'post-1',
    title:       'El diseño como ventaja competitiva',
    slug:        { current: 'diseno-ventaja-competitiva' },
    excerpt:     'Cómo una interfaz premium puede ser la diferencia entre convertir o perder a un usuario en los primeros 3 segundos.',
    cover:       '/images/journal/diseno-ventaja-competitiva.webp',
    publishedAt: '2025-03-10T09:00:00.000Z',
    category:    'Diseño',
    tags:        ['diseño', 'producto', 'conversión'],
    featured:    true,
    readingTime: 5,
    author:      AUTHOR,
    body: [
      {
        _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's1', marks: [],
          text: 'En un mercado donde el software se commoditiza a velocidad récord, la interfaz es el diferenciador real. No el algoritmo — que casi siempre es parecido al de la competencia — sino la capa que el usuario realmente toca.',
        }],
      },
      {
        _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's2', marks: [],
          text: 'Diseño no es decoración. Es la arquitectura de la experiencia que determina si alguien activa, retiene y recomienda un producto. Y aun así, la mayoría de los fundadores lo tratan como si fuera un gasto de marketing.',
        }],
      },
      {
        _type: 'block', _key: 'h1', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs1', marks: [], text: 'El primer segundo decide todo' }],
      },
      {
        _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's3', marks: [],
          text: 'La investigación de Google muestra que los usuarios forman juicios visuales en 50 milisegundos. No hay texto, no hay copy, no hay propuesta de valor que procese en ese tiempo. Solo hay una impresión: "esto se ve sólido" o "esto se ve descuidado".',
        }],
      },
      {
        _type: 'block', _key: 'b4', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's4', marks: [],
          text: 'Ese juicio primitivo contamina todo lo que viene después. Un buen producto detrás de una interfaz mediocre tiene que luchar uphill en cada interacción. Un producto promedio con diseño excepcional crea percepción de valor antes de que el usuario lea la primera línea.',
        }],
      },
      {
        _type: 'block', _key: 'bq1', style: 'blockquote', markDefs: [],
        children: [{ _type: 'span', _key: 'bqs1', marks: [],
          text: 'No compites con el diseño de tu industria. Compites con el mejor diseño que tu usuario ha visto hoy.',
        }],
      },
      {
        _type: 'block', _key: 'h2', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs2', marks: [], text: 'Diseño como inversión, no como costo' }],
      },
      {
        _type: 'block', _key: 'b5', style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: 's5a', marks: [], text: 'La mayoría de los founders meten diseño en la categoría de "cuando tengamos presupuesto". Es un error de categorización. Con ' },
          { _type: 'span', _key: 's5b', marks: ['em'], text: 'TechFlow' },
          { _type: 'span', _key: 's5c', marks: [], text: ' vimos esto en números concretos: un rediseño de flujo de onboarding redujo el time-to-activate de 3 días a menos de 2 horas. La tasa de conversión subió ' },
          { _type: 'span', _key: 's5d', marks: ['strong'], text: '340% en 90 días' },
          { _type: 'span', _key: 's5e', marks: [], text: '.' },
        ],
      },
      {
        _type: 'block', _key: 'b6', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's6', marks: [],
          text: 'El ROI del diseño es medible si sabes dónde mirar: activación, churn, NPS, tiempo en tarea. Pero para verlo necesitas tratar el diseño como una disciplina de producto, no como un proyecto de branding.',
        }],
      },
      {
        _type: 'block', _key: 'h3', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs3', marks: [], text: 'La diferencia entre bonito y efectivo' }],
      },
      {
        _type: 'block', _key: 'b7', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's7', marks: [],
          text: 'Diseño efectivo no es diseño bonito. Es diseño que resuelve un problema de negocio medible. Una pantalla puede ganar un Awwwards y tener una tasa de activación del 12%. Eso no es diseño — es decoración cara.',
        }],
      },
      {
        _type: 'block', _key: 'b8', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's8', marks: [],
          text: 'El benchmark que usamos en Nexxo es simple: ¿esta decisión de diseño hace que el usuario avance o retrocede en su objetivo? Si la respuesta no es clara, el diseño todavía no está listo.',
        }],
      },
    ],
  },

  // ── Post 2: IA generativa en el workflow de producto ──────────────────────
  {
    _id:         'post-2',
    title:       'IA generativa en el workflow de producto',
    slug:        { current: 'ia-generativa-workflow-producto' },
    excerpt:     'Las herramientas de IA no reemplazan al diseñador; lo amplifican. Así integramos modelos generativos sin perder criterio de diseño.',
    cover:       '/images/journal/ia-generativa-workflow-producto.webp',
    publishedAt: '2025-02-28T09:00:00.000Z',
    category:    'IA',
    tags:        ['IA', 'workflow', 'herramientas', 'producto'],
    featured:    false,
    readingTime: 7,
    author:      AUTHOR,
    body: [
      {
        _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's1', marks: [],
          text: 'Llevamos dos años usando IA generativa en producción real — no en demostraciones, sino en proyectos de producto que después se deployan y miden. Este es nuestro reporte honesto.',
        }],
      },
      {
        _type: 'block', _key: 'h1', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs1', marks: [], text: 'El miedo equivocado' }],
      },
      {
        _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's2', marks: [],
          text: 'El debate "IA va a reemplazar a los diseñadores" es la conversación equivocada. La pregunta real es: ¿qué parte del trabajo de diseño consume tiempo sin requerir criterio, y qué parte requiere criterio que ningún modelo puede sustituir?',
        }],
      },
      {
        _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's3', marks: [],
          text: 'La respuesta define exactamente dónde entra la IA: en la producción, no en el criterio. En la velocidad de exploración, no en la decisión de qué explorar.',
        }],
      },
      {
        _type: 'block', _key: 'bq1', style: 'blockquote', markDefs: [],
        children: [{ _type: 'span', _key: 'bqs1', marks: [],
          text: 'La IA que reemplaza a un diseñador es la IA entrenada con el criterio de un diseñador. Eso no existe todavía.',
        }],
      },
      {
        _type: 'block', _key: 'h2', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs2', marks: [], text: 'Cómo integramos IA sin perder criterio' }],
      },
      {
        _type: 'block', _key: 'b4', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's4', marks: [],
          text: 'En Nexxo usamos IA en cuatro puntos concretos del workflow:',
        }],
      },
      {
        _type: 'block', _key: 'li1', style: 'normal', markDefs: [],
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', _key: 'lis1', marks: [],
          text: 'Generación de variantes: en vez de explorar 3 direcciones visuales manualmente, exploramos 12 en el mismo tiempo y filtramos con criterio las 2 que avanzan.',
        }],
      },
      {
        _type: 'block', _key: 'li2', style: 'normal', markDefs: [],
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', _key: 'lis2', marks: [],
          text: 'Microcopy: la IA genera el primer draft de mensajes de error, estados vacíos y confirmaciones. Nosotros editamos con voz de marca y criterio UX.',
        }],
      },
      {
        _type: 'block', _key: 'li3', style: 'normal', markDefs: [],
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', _key: 'lis3', marks: [],
          text: 'Análisis de inconsistencias: detectar componentes con espaciado irregular o jerarquías rotas en un design system de 200+ elementos. Una tarea que tomaría 4 horas toma 20 minutos.',
        }],
      },
      {
        _type: 'block', _key: 'li4', style: 'normal', markDefs: [],
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', _key: 'lis4', marks: [],
          text: 'Prototipado de flujos: convertir wireframes en código de componentes para validar con usuarios reales antes del handoff final.',
        }],
      },
      {
        _type: 'block', _key: 'h3', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs3', marks: [], text: 'Lo que la IA no puede reemplazar' }],
      },
      {
        _type: 'block', _key: 'b5', style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: 's5a', marks: [], text: 'La IA no puede hablar con un usuario y detectar la incomodidad en su tono cuando describe un flujo. No puede leer el contexto político de una reunión de stakeholders. No puede decidir que ' },
          { _type: 'span', _key: 's5b', marks: ['em'], text: 'este feature concreto' },
          { _type: 'span', _key: 's5c', marks: [], text: ' va contra el objetivo de negocio aunque el cliente lo pida con convicción.' },
        ],
      },
      {
        _type: 'block', _key: 'b6', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's6', marks: [],
          text: 'Criterio, contexto y responsabilidad siguen siendo humanos. La IA expande la capacidad de producción para que el diseñador gaste más energía en lo que realmente importa.',
        }],
      },
    ],
  },

  // ── Post 4: UX software industrial ───────────────────────────────────────
  {
    _id:         'post-4',
    title:       'Por qué el software industrial necesita diseño UX — no solo funcionalidad',
    slug:        { current: 'ux-software-industrial' },
    excerpt:     'Los ingenieros construyen software que funciona. Los diseñadores construyen software que la gente usa. En el sector industrial, esa diferencia vale millones.',
    cover:       '/images/journal/ux-software-industrial.webp',
    publishedAt: '2025-05-15T09:00:00.000Z',
    category:    'Producto',
    tags:        ['UX', 'software industrial', 'SaaS', 'dashboard', 'producto'],
    featured:    true,
    readingTime: 8,
    author:      AUTHOR,
    body: [
      {
        _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's1', marks: [],
          text: 'Existe un problema silencioso en el software industrial: sistemas que cuestan cientos de miles de euros, que funcionan técnicamente, pero que el equipo evita usar. Managers que vuelven a Excel. Operadores que prefieren el cuaderno. Directores que toman decisiones a ciegas porque los datos están "en algún lugar del sistema".',
        }],
      },
      {
        _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's2', marks: [],
          text: 'El software funciona. El problema es que nadie lo usa. Y si nadie lo usa, los datos no se registran, los procesos no se optimizan y el ROI de la inversión tecnológica cae a cero.',
        }],
      },
      {
        _type: 'block', _key: 'h1', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs1', marks: [], text: 'El mito del "el usuario industrial aguanta cualquier interfaz"' }],
      },
      {
        _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's3', marks: [],
          text: 'Durante décadas, el software B2B industrial operó bajo el supuesto de que los usuarios "profesionales" tienen tiempo de aprender interfaces complejas. Que el onboarding de dos semanas es normal. Que la fealdad del sistema es parte del precio de la robustez.',
        }],
      },
      {
        _type: 'block', _key: 'b4', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's4', marks: [],
          text: 'Ese supuesto se rompió. Los mismos usuarios que toleraban SAP en el trabajo ahora usan apps que hacen cosas complejas en tres toques. La tolerancia al software difícil colapsó. El estándar de referencia ya no es la competencia directa — es la mejor app que el usuario abre en su teléfono.',
        }],
      },
      {
        _type: 'block', _key: 'bq1', style: 'blockquote', markDefs: [],
        children: [{ _type: 'span', _key: 'bqs1', marks: [],
          text: 'Un operador de planta que usa Instagram en el descanso sabe perfectamente que las interfaces pueden ser mejores. No tolera la complejidad: la sufre.',
        }],
      },
      {
        _type: 'block', _key: 'h2', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs2', marks: [], text: 'Lo que aprendimos diseñando Solivus' }],
      },
      {
        _type: 'block', _key: 'b5', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's5', marks: [],
          text: 'Solivus es una plataforma de monitoreo solar industrial. Sus usuarios son ingenieros de campo y managers de operaciones que necesitan tomar decisiones sobre instalaciones de múltiples megavatios en tiempo real. Los datos que manejan son críticos: alertas de fallo, rendimiento por panel, predicciones de producción.',
        }],
      },
      {
        _type: 'block', _key: 'b6', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's6', marks: [],
          text: 'La plataforma anterior mostraba esos datos. Los mostraba todos. Sin jerarquía, sin filtros inteligentes, sin distinción entre una alerta crítica y un aviso informativo. El resultado: el tiempo de respuesta a alertas críticas era de 2 horas y 20 minutos en promedio. Un fallo de un inversor podía costar miles de euros por hora perdida.',
        }],
      },
      {
        _type: 'block', _key: 'b7', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's7', marks: [],
          text: 'Rediseñamos la interfaz con un principio central: el ingeniero que llega a las 7 de la mañana debe saber en 10 segundos si hay algo que requiere su atención inmediata. Todo lo demás es secundario.',
        }],
      },
      {
        _type: 'block', _key: 'h3', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs3', marks: [], text: 'Los tres principios del UX industrial' }],
      },
      {
        _type: 'block', _key: 'li1', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis1', marks: [],
          text: 'Jerarquía de urgencia visible: no todos los datos tienen el mismo peso. El diseño debe hacer evidente, sin que el usuario lo analice, qué requiere acción inmediata vs. qué es información de contexto.',
        }],
      },
      {
        _type: 'block', _key: 'li2', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis2', marks: [],
          text: 'Reducción de carga cognitiva en contextos de alta presión: un ingeniero que responde a una alerta está bajo estrés. La interfaz debe guiarlo, no hacerle pensar. Cada pantalla debe tener una acción primaria obvia.',
        }],
      },
      {
        _type: 'block', _key: 'li3', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis3', marks: [],
          text: 'Diseño para contexto físico: el software industrial se usa en plantas ruidosas, con guantes, con luz solar directa en la pantalla. Las fuentes deben ser legibles a distancia, los botones táctiles lo suficientemente grandes, el contraste extremo.',
        }],
      },
      {
        _type: 'block', _key: 'h4', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs4', marks: [], text: 'El resultado que importa' }],
      },
      {
        _type: 'block', _key: 'b8', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's8', marks: [],
          text: 'Después del rediseño, el tiempo de respuesta a alertas críticas en Solivus bajó de 2h20min a 74 minutos. Una reducción del 47%. No por un cambio en la infraestructura de alertas — el sistema era el mismo. Sino porque los ingenieros podían ver qué importaba en segundos, no en minutos de análisis.',
        }],
      },
      {
        _type: 'block', _key: 'b9', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's9', marks: [],
          text: 'En software industrial, el ROI del diseño se mide en tiempo de respuesta, en errores evitados y en adopción real del sistema. No en premios de diseño. Eso es lo que perseguimos.',
        }],
      },
    ],
  },

  // ── Post 5: E-commerce sectores regulados ─────────────────────────────────
  {
    _id:         'post-5',
    title:       'Cómo diseñar un e-commerce en sectores regulados (CBD, salud, lujo)',
    slug:        { current: 'ecommerce-sectores-regulados' },
    excerpt:     'Vender CBD, suplementos o lujo online tiene restricciones que el diseño convencional ignora. Así navegamos la tensión entre conversión y compliance.',
    cover:       '/images/journal/ecommerce-sectores-regulados.webp',
    publishedAt: '2025-06-02T09:00:00.000Z',
    category:    'E-commerce',
    tags:        ['e-commerce', 'CBD', 'sectores regulados', 'Shopify', 'conversión', 'compliance'],
    featured:    false,
    readingTime: 9,
    author:      AUTHOR,
    body: [
      {
        _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's1', marks: [],
          text: 'Diseñar un e-commerce para una tienda de ropa es difícil. Diseñar uno para una tienda de CBD en España es difícil más un campo de minas legal. Las plataformas de anuncios restringen el producto. Google penaliza ciertos términos. Los bancos rechazan pasarelas de pago. Y encima de todo eso, tienes que convertir.',
        }],
      },
      {
        _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's2', marks: [],
          text: 'Trabajamos con Greenery 420, tienda CBD premium en Madrid, y lo que aprendimos sobre diseñar en sectores regulados va más allá del CBD. Se aplica a salud, suplementos, lujo, alcohol, farmacia — cualquier categoría donde el compliance define la cancha antes de que el diseño empiece.',
        }],
      },
      {
        _type: 'block', _key: 'h1', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs1', marks: [], text: 'El problema del diseño con miedo' }],
      },
      {
        _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's3', marks: [],
          text: 'La mayoría de los e-commerce en sectores regulados caen en el mismo error: diseñan con miedo. Ponen disclaimers en todas partes. Usan colores neutros para no "llamar demasiado la atención". Evitan cualquier copy que suene a beneficio. El resultado es un sitio que no convierte y que tampoco cumple mejor con la regulación — solo parece más asustado.',
        }],
      },
      {
        _type: 'block', _key: 'bq1', style: 'blockquote', markDefs: [],
        children: [{ _type: 'span', _key: 'bqs1', marks: [],
          text: 'El compliance no prohíbe el buen diseño. Prohíbe las afirmaciones falsas. Son cosas muy distintas.',
        }],
      },
      {
        _type: 'block', _key: 'h2', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs2', marks: [], text: 'Las restricciones que sí importan' }],
      },
      {
        _type: 'block', _key: 'b4', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's4', marks: [],
          text: 'Para el mercado CBD en España, las restricciones concretas que afectan el diseño son:',
        }],
      },
      {
        _type: 'block', _key: 'li1', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis1', marks: [],
          text: 'No se pueden hacer afirmaciones de salud directas: "cura", "trata", "elimina" son términos prohibidos. El diseño del copy debe comunicar bienestar sin prometer resultados médicos.',
        }],
      },
      {
        _type: 'block', _key: 'li2', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis2', marks: [],
          text: 'Las imágenes de producto deben ser precisas: no se puede fotografiar el producto de forma que sugiera propiedades que no se pueden afirmar legalmente.',
        }],
      },
      {
        _type: 'block', _key: 'li3', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis3', marks: [],
          text: 'La verificación de edad (donde aplica) no puede ser un bloqueador de conversión: debe ser fluida, discreta y no intimidante.',
        }],
      },
      {
        _type: 'block', _key: 'h3', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs3', marks: [], text: 'Cómo convertir dentro de las restricciones' }],
      },
      {
        _type: 'block', _key: 'b5', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's5', marks: [],
          text: 'La solución que implementamos en Greenery 420 fue convertir la restricción en posicionamiento. Si no podemos decir "cura el insomnio", podemos decir "parte de la rutina de noches de quienes priorizan el descanso". El primer mensaje es una afirmación médica. El segundo es un estilo de vida.',
        }],
      },
      {
        _type: 'block', _key: 'b6', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's6', marks: [],
          text: 'El diseño visual siguió el mismo principio: no intentamos "parecer" una farmacia para ganar credibilidad. Diseñamos como una marca de wellness premium — porque eso es lo que es. Paleta de tierra, tipografía editorial, fotografía que habla de ritual y cuidado.',
        }],
      },
      {
        _type: 'block', _key: 'h4', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs4', marks: [], text: 'Lo que funciona en Shopify para sectores regulados' }],
      },
      {
        _type: 'block', _key: 'b7', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's7', marks: [],
          text: 'Shopify tiene limitaciones específicas para productos restringidos, pero es la plataforma más flexible para cumplirlas gracefully. Lo que aprendimos:',
        }],
      },
      {
        _type: 'block', _key: 'li4', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis4', marks: [],
          text: 'Usar pasarelas de pago alternativas desde el diseño inicial — no como afterthought. Stripe tiene restricciones para CBD, pero PaynoPain o PPRO funcionan y se pueden integrar sin romper el flujo de checkout.',
        }],
      },
      {
        _type: 'block', _key: 'li5', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis5', marks: [],
          text: 'La descripción del producto es el único lugar donde puedes controlar el SEO sin arriesgarte a claims legales. Optimizar con términos de bienestar y estilo de vida, no médicos.',
        }],
      },
      {
        _type: 'block', _key: 'li6', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis6', marks: [],
          text: 'El email marketing es el canal más seguro — sin restricciones de plataforma — y suele generar el mayor LTV. Diseñar el flujo de captura de email desde el primer día, no cuando ya está el sitio.',
        }],
      },
      {
        _type: 'block', _key: 'b8', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's8', marks: [],
          text: 'El resultado con Greenery 420: +185% de conversión versus el benchmark de la categoría wellness en España. No porque ignoramos las restricciones — sino porque las convertimos en ventaja de posicionamiento.',
        }],
      },
    ],
  },

  // ── Post 3: Jerarquía visual ──────────────────────────────────────────────
  {
    _id:         'post-3',
    title:       'Jerarquía visual: el arte de guiar la mirada',
    slug:        { current: 'jerarquia-visual-guiar-mirada' },
    excerpt:     'Sin jerarquía no hay diseño, solo ruido. Principios para estructurar pantallas que comunican instantáneamente.',
    cover:       '/images/journal/jerarquia-visual-guiar-mirada.webp',
    publishedAt: '2025-02-14T09:00:00.000Z',
    category:    'UX',
    tags:        ['UX', 'jerarquía visual', 'composición', 'tipografía'],
    featured:    false,
    readingTime: 4,
    author:      AUTHOR,
    body: [
      {
        _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's1', marks: [],
          text: 'Cuando un usuario llega a una pantalla, su cerebro hace en 150ms una pregunta que no verbaliza: "¿qué es lo más importante aquí?" Si el diseño no tiene una respuesta clara, el usuario siente fricción aunque no sepa nombrarlo. Esa fricción mata la conversión.',
        }],
      },
      {
        _type: 'block', _key: 'h1', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs1', marks: [], text: 'Por qué la jerarquía falla' }],
      },
      {
        _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's2', marks: [],
          text: 'La mayoría de los problemas de jerarquía vienen del mismo lugar: demasiados elementos compitiendo por atención primaria. Cuando todo es importante, nada lo es.',
        }],
      },
      {
        _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's3', marks: [],
          text: 'El error clásico es usar el tamaño como único mecanismo de jerarquía. Tamaño grande = primario, tamaño mediano = secundario, tamaño pequeño = terciario. Funciona, pero es rudimentario. Las interfaces premium usan cuatro palancas simultáneas.',
        }],
      },
      {
        _type: 'block', _key: 'bq1', style: 'blockquote', markDefs: [],
        children: [{ _type: 'span', _key: 'bqs1', marks: [],
          text: 'Una buena jerarquía es invisible. El usuario simplemente sabe qué hacer sin saber por qué.',
        }],
      },
      {
        _type: 'block', _key: 'h2', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs2', marks: [], text: 'Las cuatro palancas del control visual' }],
      },
      {
        _type: 'block', _key: 'b4', style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: 's4a', marks: ['strong'], text: 'Tamaño y escala' },
          { _type: 'span', _key: 's4b', marks: [], text: ': el diferencial entre el elemento más grande y el más pequeño crea tensión visual. En interfaces modernas ese diferencial suele ser de 6:1 a 10:1, no de 2:1.' },
        ],
      },
      {
        _type: 'block', _key: 'b5', style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: 's5a', marks: ['strong'], text: 'Contraste y opacidad' },
          { _type: 'span', _key: 's5b', marks: [], text: ': texto al 100% de opacidad para primario, 55-65% para secundario, 30-40% para terciario. Un sistema de tres niveles en opacidad crea profundidad sin añadir colores.' },
        ],
      },
      {
        _type: 'block', _key: 'b6', style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: 's6a', marks: ['strong'], text: 'Peso tipográfico' },
          { _type: 'span', _key: 's6b', marks: [], text: ': semibold para títulos, regular para cuerpo. El bold sin tamaño comunica importancia dentro de un bloque de texto, no entre bloques.' },
        ],
      },
      {
        _type: 'block', _key: 'b7', style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: 's7a', marks: ['strong'], text: 'Espacio en blanco' },
          { _type: 'span', _key: 's7b', marks: [], text: ': el espacio alrededor de un elemento le da peso sin añadir píxeles. Un H1 con 80px de margen inferior dice "lo que viene después es secundario" más que cualquier color.' },
        ],
      },
      {
        _type: 'block', _key: 'h3', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs3', marks: [], text: 'Aplicación práctica: el test de 5 segundos' }],
      },
      {
        _type: 'block', _key: 'b8', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's8', marks: [],
          text: 'Muestra tu pantalla a alguien durante 5 segundos y pregunta: "¿qué era lo más importante?" Si la respuesta no coincide con lo que el negocio necesita que sea lo más importante, tienes un problema de jerarquía — no de content.',
        }],
      },
      {
        _type: 'block', _key: 'b9', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's9', marks: [],
          text: 'Hacemos este test en cada iteración de diseño. Es la herramienta más rápida y barata para detectar jerarquía rota antes de que llegue al usuario real.',
        }],
      },
    ],
  },

  // ── Post 6: Diseño apps IoT — Nexo Go ─────────────────────────────────────
  {
    _id:         'post-6',
    title:       'Diseño para apps IoT: lo que aprendimos construyendo Nexo Go',
    slug:        { current: 'diseno-apps-iot-nexo-go' },
    excerpt:     'Una app de tracking para bicicletas eléctricas parece simple. La complejidad está en sincronizar hardware, conectividad en tiempo real y decisiones de usuario bajo estrés.',
    cover:       '/images/journal/diseno-apps-iot-nexo-go.webp',
    publishedAt: '2025-06-16T09:00:00.000Z',
    category:    'Producto',
    tags:        ['IoT', 'app móvil', 'UX', 'tracking', 'bicicletas eléctricas', 'hardware'],
    featured:    false,
    readingTime: 7,
    author:      AUTHOR,
    body: [
      {
        _type: 'block', _key: 'b1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's1', marks: [],
          text: 'Las apps de IoT tienen un problema de diseño que la mayoría de frameworks de UX no contemplan: el estado del sistema no está en el servidor — está en el mundo físico. Un botón que debería estar activo puede estarlo o no dependiendo de si el dispositivo tiene señal, si está en rango Bluetooth, si la batería del hardware llegó al mínimo.',
        }],
      },
      {
        _type: 'block', _key: 'b2', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's2', marks: [],
          text: 'Diseñar Nexo Go — la app de tracking y seguridad para bicicletas eléctricas de la misma marca — nos hizo entender que el diseño IoT es fundamentalmente diseño de estados de incertidumbre. Cada pantalla tiene que funcionar cuando el dispositivo está conectado, cuando está en proceso de conectarse, cuando perdió señal y cuando el hardware está offline.',
        }],
      },
      {
        _type: 'block', _key: 'h1', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs1', marks: [], text: 'El mapa de estados como primer entregable' }],
      },
      {
        _type: 'block', _key: 'b3', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's3', marks: [],
          text: 'En un proyecto convencional de app, el mapa de navegación suele ser el primer entregable estructural. En Nexo Go, lo primero que construimos fue el mapa de estados de conectividad. Definimos cuatro estados base del dispositivo y cómo cada pantalla de la app debía comportarse en cada uno.',
        }],
      },
      {
        _type: 'block', _key: 'li1', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis1', marks: [],
          text: 'Conectado y activo: todos los features disponibles, mapa en tiempo real, alertas funcionando.',
        }],
      },
      {
        _type: 'block', _key: 'li2', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis2', marks: [],
          text: 'Conectando: skeleton states en lugar de spinners genéricos, con el último estado conocido visible para no dejar al usuario sin información.',
        }],
      },
      {
        _type: 'block', _key: 'li3', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis3', marks: [],
          text: 'Señal perdida: la app muestra el último estado conocido con timestamp claro, y el mapa congela la última posición registrada. No se muestra error — se muestra información.',
        }],
      },
      {
        _type: 'block', _key: 'li4', style: 'normal', markDefs: [], listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'lis4', marks: [],
          text: 'Hardware offline: modo histórico automático con datos de los últimos 7 días, sin que el usuario tenga que cambiar de vista manualmente.',
        }],
      },
      {
        _type: 'block', _key: 'bq1', style: 'blockquote', markDefs: [],
        children: [{ _type: 'span', _key: 'bqs1', marks: [],
          text: 'En IoT, el error más caro de diseño es mostrar "sin conexión" cuando deberías mostrar el último estado conocido.',
        }],
      },
      {
        _type: 'block', _key: 'h2', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs2', marks: [], text: 'El reto del onboarding con hardware físico' }],
      },
      {
        _type: 'block', _key: 'b4', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's4', marks: [],
          text: 'Emparejar un dispositivo IoT es el primer punto de fricción. El usuario tiene la app, tiene la bicicleta, tiene el rastreador GPS en la mano, y tiene que hacer que todo se comunique. Si ese flujo falla o confunde, el usuario desinstala antes de ver el valor del producto.',
        }],
      },
      {
        _type: 'block', _key: 'b5', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's5', marks: [],
          text: 'Diseñamos el onboarding de Nexo Go con una regla: cada paso debe tener retroalimentación visible de que el sistema está progresando. Nada de pantallas estáticas que el usuario no sabe si están "cargando" o "esperando". Animaciones sutiles de progreso, confirmaciones de cada etapa completada, y un fallback explícito si el emparejamiento falla.',
        }],
      },
      {
        _type: 'block', _key: 'h3', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs3', marks: [], text: 'Diseño de alertas bajo estrés' }],
      },
      {
        _type: 'block', _key: 'b6', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's6', marks: [],
          text: 'Nexo Go tiene un sistema de alertas de robo. El momento en que un usuario recibe una alerta de movimiento sospechoso no es el momento en que puede analizar una interfaz compleja. Está en estrés, posiblemente en movimiento, con el teléfono en la mano y quizás poca luz.',
        }],
      },
      {
        _type: 'block', _key: 'b7', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's7', marks: [],
          text: 'El diseño de la pantalla de alerta tiene una sola acción primaria: ver ubicación en tiempo real. Las acciones secundarias (notificar a contacto de emergencia, marcar como falsa alarma) están accesibles pero no compiten visualmente. El mapa ocupa el 70% de la pantalla. El resto es mínimo.',
        }],
      },
      {
        _type: 'block', _key: 'h4', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'hs4', marks: [], text: 'El resultado que validó el diseño' }],
      },
      {
        _type: 'block', _key: 'b8', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's8', marks: [],
          text: 'Desde el lanzamiento de Nexo Go, los usuarios activos que tienen el rastreador instalado tienen cero robos reportados. No es solo el hardware — es que la app les da suficiente visibilidad y suficiente rapidez de respuesta para actuar antes de que el robo se complete.',
        }],
      },
      {
        _type: 'block', _key: 'b9', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 's9', marks: [],
          text: 'El UX de IoT no es difícil por razones técnicas. Es difícil porque el mundo físico introduce variables que el diseño convencional de apps no contempla. Una vez que tienes ese modelo mental, el diseño se vuelve más honesto — y más útil.',
        }],
      },
    ],
  },

  // ── Post 7: De brief a entrega en 4 semanas ────────────────────────────────
  {
    _id:         'post-7',
    title:       'De brief a entrega en 4 semanas',
    slug:        { current: 'proceso-brief-entrega-4-semanas' },
    excerpt:     'El sprint de diseño que desarrollamos internamente para pasar de cero a producto premium sin pérdida de calidad.',
    cover:       '/images/journal/proceso-brief-entrega-4-semanas.webp',
    publishedAt: '2025-01-30T09:00:00.000Z',
    category:    'Proceso',
    tags:        ['proceso', 'sprint', 'metodología'],
    featured:    false,
    readingTime: 6,
    author:      AUTHOR,
    body: [
      {
        _type: 'block', _key: 'p7b1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s1', marks: [],
          text: 'Cuatro semanas no es una promesa comercial. Es una restricción de diseño, y como toda buena restricción, obliga a decidir antes en vez de decidir tarde. Un proyecto que se estira tres meses casi nunca es un proyecto complejo: es un proyecto en el que nadie ha querido cerrar una discusión.',
        }],
      },
      {
        _type: 'block', _key: 'p7h1', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p7hs1', marks: [], text: 'Por qué cuatro semanas y no tres meses' }],
      },
      {
        _type: 'block', _key: 'p7b2', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s2', marks: [],
          text: 'El coste real de un proyecto largo no son las horas facturadas. Es el contexto que se evapora entre reuniones, las decisiones que se reabren porque ya nadie recuerda por qué se tomaron, y el momento de mercado que pasa mientras el equipo sigue puliendo una pantalla que todavía no ha visto un usuario.',
        }],
      },
      {
        _type: 'block', _key: 'p7b3', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s3', marks: [],
          text: 'Un plazo corto no baja la calidad si lo que recorta es el alcance y no el cuidado. La diferencia está en qué decides no hacer. Nosotros entregamos menos superficie, terminada, en vez de más superficie a medio resolver.',
        }],
      },
      {
        _type: 'block', _key: 'p7bq1', style: 'blockquote', markDefs: [],
        children: [{ _type: 'span', _key: 'p7bqs1', marks: [],
          text: 'Un plazo no aprieta el trabajo. Aprieta las decisiones, que es donde de verdad se pierde el tiempo.',
        }],
      },
      {
        _type: 'block', _key: 'p7h2', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p7hs2', marks: [], text: 'Semana 1 — Encontrar el número' }],
      },
      {
        _type: 'block', _key: 'p7b4', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s4', marks: [],
          text: 'No empezamos por la marca ni por el mapa del sitio. Empezamos por la cifra que el negocio quiere mover: leads al mes, coste por oportunidad, velocidad de cierre, tasa de activación. Si esa cifra no está clara al terminar la primera semana, el resto del sprint no tiene contra qué medirse y lo paramos ahí.',
        }],
      },
      {
        _type: 'block', _key: 'p7b5', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s5', marks: [],
          text: 'En esta semana hablamos con quien vende, no solo con quien decide. El equipo comercial sabe dónde se cae el proceso mucho antes de que aparezca en un panel.',
        }],
      },
      {
        _type: 'block', _key: 'p7h3', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p7hs3', marks: [], text: 'Semana 2 — Estructura antes que estética' }],
      },
      {
        _type: 'block', _key: 'p7b6', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s6', marks: [],
          text: 'Arquitectura de información, jerarquía y flujo. Sin color, sin tipografía definitiva, sin nada que invite a opinar sobre el tono cuando todavía no está resuelto el orden. Es la semana más incómoda para el cliente y la que más trabajo ahorra después.',
        }],
      },
      {
        _type: 'block', _key: 'p7b7', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s7', marks: [],
          text: 'Aquí también se decide qué queda fuera. Una funcionalidad aplazada en la semana 2 cuesta una conversación. La misma funcionalidad aplazada en la semana 4 cuesta rehacer tres pantallas.',
        }],
      },
      {
        _type: 'block', _key: 'p7h4', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p7hs4', marks: [], text: 'Semana 3 — Diseño y construcción a la vez' }],
      },
      {
        _type: 'block', _key: 'p7b8', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s8', marks: [],
          text: 'El diseño no se entrega y luego se maqueta. Se construye mientras se diseña, porque la mitad de los problemas de una interfaz solo aparecen cuando tiene datos reales dentro. Un estado vacío, un nombre de cliente de sesenta caracteres o una tabla con doce filas rompen más pantallas que cualquier revisión estética.',
        }],
      },
      {
        _type: 'block', _key: 'p7h5', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p7hs5', marks: [], text: 'Semana 4 — Instrumentar y entregar' }],
      },
      {
        _type: 'block', _key: 'p7b9', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s9', marks: [],
          text: 'Un proyecto que se entrega sin medición es un proyecto del que nunca sabrás si funcionó. La última semana conecta la analítica, los eventos que de verdad importan y el panel donde el cliente los va a mirar. Sin eso, la conversación de los tres meses siguientes es una discusión de gustos.',
        }],
      },
      {
        _type: 'block', _key: 'p7h6', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p7hs6', marks: [], text: 'Lo que este sprint no es' }],
      },
      {
        _type: 'block', _key: 'p7b10', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s10', marks: [],
          text: 'Ser honesto con los límites es parte del método. Cuatro semanas no dan para todo:',
        }],
      },
      {
        _type: 'block', _key: 'p7li1', style: 'normal', markDefs: [],
        listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p7lis1', marks: [],
          text: 'No es investigación de usuarios a fondo. Es la investigación suficiente para decidir, no para publicar un estudio.',
        }],
      },
      {
        _type: 'block', _key: 'p7li2', style: 'normal', markDefs: [],
        listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p7lis2', marks: [],
          text: 'No es una plataforma completa. Es el camino crítico terminado, con el resto planificado y priorizado.',
        }],
      },
      {
        _type: 'block', _key: 'p7li3', style: 'normal', markDefs: [],
        listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p7lis3', marks: [],
          text: 'No funciona sin alguien que decida del lado del cliente. Si cada revisión necesita tres firmas, el plazo no es realista y lo decimos antes de empezar, no en la semana 3.',
        }],
      },
      {
        _type: 'block', _key: 'p7b11', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p7s11', marks: [],
          text: 'Por eso tomamos pocos clientes a la vez. Un sprint de cuatro semanas exige atención completa, y un estudio que corre seis en paralelo no está corriendo ninguno.',
        }],
      },
    ],
  },

  // ── Post 8: Motion que convierte ───────────────────────────────────────────
  {
    _id:         'post-8',
    title:       'Motion que convierte: micro-interacciones',
    slug:        { current: 'motion-design-microinteracciones' },
    excerpt:     'Las animaciones decorativas son ruido. Las funcionales reducen la carga cognitiva y aumentan el deleite percibido.',
    cover:       '/images/journal/motion-design-microinteracciones.webp',
    publishedAt: '2025-01-15T09:00:00.000Z',
    category:    'Diseño',
    tags:        ['motion', 'interacción', 'accesibilidad'],
    featured:    false,
    readingTime: 5,
    author:      AUTHOR,
    body: [
      {
        _type: 'block', _key: 'p8b1', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p8s1', marks: [],
          text: 'Casi todo el motion que se ve en producto sobra. Elementos que entran flotando, tarjetas que rebotan, secciones que aparecen con retardo porque queda bien en el vídeo de presentación. Nada de eso ayuda a nadie a hacer lo que vino a hacer.',
        }],
      },
      {
        _type: 'block', _key: 'p8h1', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p8hs1', marks: [], text: 'La diferencia entre decorar y explicar' }],
      },
      {
        _type: 'block', _key: 'p8b2', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p8s2', marks: [],
          text: 'Una animación útil responde a una pregunta que el usuario se estaba haciendo. Qué acaba de pasar. De dónde salió esto. Dónde estaba antes lo que ahora veo aquí. Si no responde ninguna de esas tres, es decoración, y está cobrando un peaje en tiempo de espera.',
        }],
      },
      {
        _type: 'block', _key: 'p8bq1', style: 'blockquote', markDefs: [],
        children: [{ _type: 'span', _key: 'p8bqs1', marks: [],
          text: 'Si quitas la animación y nadie se pierde, la animación no estaba explicando nada.',
        }],
      },
      {
        _type: 'block', _key: 'p8h2', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p8hs2', marks: [], text: 'Las cuatro que sí valen la pena' }],
      },
      {
        _type: 'block', _key: 'p8li1', style: 'normal', markDefs: [],
        listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p8lis1', marks: [],
          text: 'Continuidad espacial: un panel que se abre desde el botón que lo invoca mantiene la relación entre causa y efecto. El usuario no tiene que reconstruir de dónde vino.',
        }],
      },
      {
        _type: 'block', _key: 'p8li2', style: 'normal', markDefs: [],
        listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p8lis2', marks: [],
          text: 'Confirmación de acción: que un botón cambie de estado al pulsarlo evita el segundo clic por duda, que es una de las causas más comunes de acciones duplicadas.',
        }],
      },
      {
        _type: 'block', _key: 'p8li3', style: 'normal', markDefs: [],
        listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p8lis3', marks: [],
          text: 'Percepción de velocidad: una transición de 200 ms bien puesta hace que una espera de 800 ms se sienta más corta que la misma espera con un salto seco.',
        }],
      },
      {
        _type: 'block', _key: 'p8li4', style: 'normal', markDefs: [],
        listItem: 'bullet', level: 1,
        children: [{ _type: 'span', _key: 'p8lis4', marks: [],
          text: 'Dirección de la atención: cuando algo cambia fuera del campo de visión, un movimiento pequeño es la única forma de avisar sin interrumpir.',
        }],
      },
      {
        _type: 'block', _key: 'p8h3', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p8hs3', marks: [], text: 'El coste de animar de más' }],
      },
      {
        _type: 'block', _key: 'p8b3', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p8s3', marks: [],
          text: 'Cada animación tiene un precio en milisegundos que el usuario paga cada vez que repite la acción. Media segundo de transición en un flujo que alguien recorre cuarenta veces al día son veinte segundos diarios de espera que impuso el diseño, no el sistema.',
        }],
      },
      {
        _type: 'block', _key: 'p8b4', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p8s4', marks: [],
          text: 'Por eso el motion en herramientas de uso intensivo tiene que ser más corto que en una landing. En una landing el visitante pasa una vez y la impresión importa. En un CRM el usuario pasa cien veces y lo único que importa es que no estorbe.',
        }],
      },
      {
        _type: 'block', _key: 'p8h4', style: 'h2', markDefs: [],
        children: [{ _type: 'span', _key: 'p8hs4', marks: [], text: 'Reducir movimiento no es un extra' }],
      },
      {
        _type: 'block', _key: 'p8b5', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p8s5', marks: [],
          text: 'Hay personas para quienes el movimiento en pantalla provoca mareo o migraña. El sistema operativo ya expone esa preferencia y el navegador la entrega. Respetarla cuesta una línea de código, y no respetarla convierte una animación bonita en una razón para cerrar la pestaña.',
        }],
      },
      {
        _type: 'block', _key: 'p8b6', style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: 'p8s6', marks: [],
          text: 'La regla que seguimos es simple: si al desactivar todas las animaciones la interfaz deja de entenderse, el problema no era el motion. Era que la estructura se estaba apoyando en él.',
        }],
      },
    ],
  },

]
