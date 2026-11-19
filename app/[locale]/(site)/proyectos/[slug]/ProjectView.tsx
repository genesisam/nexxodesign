import { notFound }          from 'next/navigation'
import { coverFor }          from '@/lib/covers'
import { PaletteGrid }       from '@/components/project/PaletteGrid'
import { aRgb, esClaro, legibleSobre } from '@/lib/color'
import Link                  from 'next/link'
import { getTranslations }   from 'next-intl/server'
import type {
  Metric, ProjectPreview, Project,
  StoryBlock, OverviewBlock, SectionHeaderBlock,
  MediaBlock, SplitShowBlock, QuoteBlock, FeedbackBlock, SplitItem,
  PaletteBlock, TypographyBlock, StatementBlock, LogoBlock, EscenarioBlock,
} from '@/types/project'
import { absoluteUrl, SITE_URL } from '@/lib/seo'
import { getProjectBySlug } from '@/sanity/lib/project-data'
import { NexxoPortableText } from '@/components/portable-text'
import { ProjectMotion } from '@/components/project/ProjectMotion'
import { chapterId } from '@/lib/chapters'

/**
 * A case study, rendered either as its own page or inside the modal that
 * opens over the index.
 *
 * It lives apart from `page.tsx` so both can show the same thing. Writing the
 * body twice would mean every future change to a case study had to be made in
 * two places, and the modal would drift from the page it is supposed to be.
 * The route keeps what belongs to a route — metadata, static params, ISR.
 */

// ─── SEO meta — ES ───────────────────────────────────────────────────────────

/**
 * El `title` va sin « | Nexxo »: la plantilla de `app/layout.tsx` lo añade.
 * Ponerlo aquí también dejaba el título del navegador en «… | Nexxo | Nexxo».
 */
export const SEO_META: Record<string, { title: string; description: string }> = {
  'solivus': {
    title:       'Solivus — UX para Software Industrial de Monitoreo Solar',
    description: 'Rediseñé el dashboard y la app móvil de Solivus, plataforma de monitoreo solar: 48 métricas auditadas, 9 en primer plano y alertas que llegan con la acción dentro.',
  },
  'merxo': {
    title:       'Merxo CRM — Diseño de Producto para Pipeline Comercial B2B',
    description: 'Diseñé la marca y la plataforma CRM de Merxo: un pipeline de cinco etapas, inventario y soporte en un solo sitio, y workflows que se montan en tres clics.',
  },
  'nexo-go': {
    title:       'Nexo Go — App IoT de Tracking para Bicicletas Eléctricas',
    description: 'Diseño de app IoT y marca para bicicletas eléctricas: el estado de la bici en una pantalla, modo anti-robo que se arma solo y aviso con ubicación en menos de dos minutos.',
  },
  'greenery-420': {
    title:       'Greenery 420 CBD — E-commerce en Sector Regulado',
    description: 'E-commerce CBD premium para Greenery 420, en Madrid: cinco líneas de producto ordenadas por beneficio, análisis de laboratorio en cada ficha y pagos alternativos a tarjeta.',
  },
  'maison-oliva': {
    title:       'Maison Oliva — E-commerce de Alta Costura en Shopify',
    description: 'E-commerce editorial de alta costura en Shopify. Dirección de arte e implementación para Maison Oliva: un tema a medida en Liquid, sin una sola plantilla.',
  },
  'mente': {
    title:       'Mente — Marca y Portal de Factoring para Empresas',
    description: 'Marca, web, portal de operación y app para Mente, fintech de factoring: el sistema completo salido de un mismo lenguaje, con una sola ruta por tarea.',
  },
  'nbl': {
    title:       'NBL — E-commerce de Cuidado de Barba, Diseño y Desarrollo',
    description: 'Diseñé y desarrollé la tienda de National Beard League: cinco productos, una ficha que responde antes de que preguntes y un kit que es el pedido que interesa.',
  },
  'cornish-arquitectos': {
    // Solo desarrollo: el diseño es de Cakao Studio y el caso lo dice.
    title:       'Cornish Arquitectos — Desarrollo Web para un Estudio de Arquitectura',
    description: 'Implementación del sitio de Cornish Arquitectos sobre el diseño de Cakao Studio: 13 rutas en producción y un cliente que publica solo.',
  },
  'tolvia': {
    title:       'Tolvia — IA Conversacional que Humaniza la Atención al Cliente',
    description: 'Diseñé la marca, la web, la app de escritorio y el audiovisual de Tolvia, la IA conversacional que atiende con voz natural y contexto real.',
  },
}

// ─── Contextual CTA — ES ─────────────────────────────────────────────────────

const CTA_DATA: Record<string, { label: string; heading: string }> = {
  'solivus':      { label: '¿Tu software industrial?', heading: 'Datos críticos merecen una interfaz que los haga entendibles.' },
  'merxo':        { label: '¿Tu equipo comercial?',    heading: 'Un CRM que tu equipo abandona no es un CRM. Es ruido caro.' },
  'nexo-go':      { label: '¿Tu app IoT?',             heading: 'La experiencia define si el hardware se usa o se olvida.' },
  'greenery-420': { label: '¿Tu e-commerce?',          heading: 'Sector regulado no es excusa para un diseño que no convierte.' },
  'maison-oliva': { label: '¿Tu marca?',               heading: 'Tu producto merece un e-commerce a su altura.' },
  'tolvia':       { label: '¿Tu atención al cliente?', heading: 'La IA que entiende el contexto es la que retiene al cliente.' },
}

const DEFAULT_CTA = { label: '¿Tu proyecto?', heading: 'Un resultado así te puede tocar.' }

// ─── Design constants ─────────────────────────────────────────────────────────

const VERTICAL_BG: Record<string, string> = {
  SaaS:     'linear-gradient(148deg, #0c0c1e 0%, #12112c 40%, #1c1050 72%, #5B3DF5 100%)',
  Fintech:  'linear-gradient(148deg, #091410 0%, #0e1c17 40%, #0f2e24 72%, #1B6B5A 100%)',
  Web:      'linear-gradient(148deg, #16100c 0%, #241710 40%, #3a2114 72%, #C9A88F 100%)',
  Branding: 'linear-gradient(148deg, #0a0a0a 0%, #141414 40%, #222222 72%, #484848 100%)',
  IA:       'linear-gradient(148deg, #0d0814 0%, #1e0f38 40%, #2e1268 72%, #6B35C8 100%)',
}

const getBg = (vertical: string) => VERTICAL_BG[vertical] ?? VERTICAL_BG['SaaS']

// ─── Shared sub-components ────────────────────────────────────────────────────

function ResultsBar({ metrics }: { metrics: Metric[] }) {
  return (
    <section id="resultados" aria-label="Cifras del proyecto" className="bg-ink gutter-x py-12 md:py-16 border-y border-line scroll-mt-24">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-0 md:divide-x md:divide-line">
        {metrics.map((m, i) => (
          <div key={m._key} className={i > 0 ? 'md:pl-10' : ''}>
            <dd
              className="font-display font-semibold text-accent leading-none tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)' }}
            >
              {m.value}
            </dd>
            <dt className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.22em] mt-2.5">
              {m.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  )
}

function CtaSection({
  label, heading, ctaBtn, moreBtn,
}: {
  label: string; heading: string; ctaBtn: string; moreBtn: string
}) {
  return (
    <section className="relative z-10 bg-ink gutter-x py-20 md:py-28 border-t border-line">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.24em] mb-4">
            {label}
          </p>
          <h2
            className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em] text-seccion"
          >
            {heading}
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 md:gap-4 max-w-full min-w-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-mono text-[12px] md:text-[14px] uppercase tracking-[0.22em] bg-accent text-paper px-8 py-4 hover:bg-accent/90 transition-colors duration-200"
          >
            {ctaBtn}
          </Link>
          <Link
            href="/proyectos"
            className="inline-flex items-center justify-center font-mono text-[12px] md:text-[14px] uppercase tracking-[0.22em] border border-paper/20 text-paper/70 px-8 py-4 hover:border-paper/50 hover:text-paper transition-colors duration-200"
          >
            {moreBtn}
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Story block renderers ────────────────────────────────────────────────────

function OverviewRenderer({ block }: { block: OverviewBlock }) {
  /*
   * Título, texto debajo, en una sola columna.
   *
   * Antes esto era una rejilla de dos: titular a la izquierda, texto a la
   * derecha. Y como el capítulo ya trae su propio título encima, salían dos
   * títulos del mismo tamaño seguidos peleándose, con el texto en una columna
   * estrecha al lado. Medido contra la referencia: allí hay un título, debajo
   * el texto en una columna, y después la pieza. Nada más.
   *
   * El titular del bloque se queda, pero como subtítulo: la mitad de grande
   * que el nombre del capítulo, para que se lea como lo que es.
   */
  return (
    <section className="relative z-10 bg-ink gutter-x pt-6 md:pt-8 pb-12 md:pb-16">
      {block.label && (
        <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.24em] mb-3">
          {block.label}
        </p>
      )}
      {block.heading && (
        <h3
          className="font-display font-semibold text-paper leading-tight tracking-[-0.015em] mb-7 max-w-[46ch] text-balance"
          style={{ fontSize: 'clamp(1.35rem, 2.1vw, 2rem)' }}
        >
          {block.heading}
        </h3>
      )}
      {/* El texto ocupa el ancho del capítulo.
        *
        * Llevaba un tope de 72rem y la caja disponible son 1.472 px a 1.600
        * de ventana: sobraban 320 px de negro a la derecha en todos los
        * capítulos. La referencia deja la línea correr hasta el margen; el
        * tope que queda solo evita que en una pantalla de 2.560 la medida se
        * vuelva impracticable. */}
      <div className="w-full max-w-[110rem]">
        <NexxoPortableText value={block.body} dark escala="caso" />
        {block.link && (
          <a
            href={block.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[12px] md:text-[14px] uppercase tracking-[0.2em] text-paper/65 hover:text-accent mt-5 transition-colors duration-200"
          >
            {block.link.label} →
          </a>
        )}
      </div>
    </section>
  )
}

function SectionHeaderRenderer({ block, id }: { block: SectionHeaderBlock; id?: string }) {
  return (
    // `scroll-mt` keeps the heading clear of the fixed nav when it is jumped
    // to — without it the chapter you asked for lands under the top bar.
    <section id={id} className="relative z-10 bg-ink gutter-x pt-20 md:pt-28 pb-5 md:pb-7 scroll-mt-24">
      <h2
        className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em] max-w-[16ch] text-balance text-declaracion"
      >
        {block.heading}
      </h2>
      {block.divider && (
        <div className="mt-8 md:mt-10 border-t border-line" />
      )}
    </section>
  )
}

/**
 * Texto alternativo de una pieza del caso.
 *
 * El pie de foto ya describe la imagen, así que sirve de alternativa textual:
 * un lector de pantalla no puede dar por hecha la relación entre `figure` y
 * `figcaption`, y con `alt=""` la pieza desaparecía del todo. Cuando no hay
 * pie, al menos queda dicho de qué proyecto es.
 */
function mediaAlt(caption: string | undefined, title: string) {
  return caption?.trim() || `${title} — pieza del caso`
}

/**
 * La paleta, dibujada por el navegador.
 *
 * No es una captura de muestras: cada tono es un `div` con su color de fondo y
 * su valor en texto. Pesa nada, se puede copiar, se lee en un lector de
 * pantalla y no envejece cuando la marca cambia un tono.
 */
function PaletteRenderer({ block }: { block: PaletteBlock }) {
  // Si la proyección no trajo los colores, mejor no pintar nada que reventar
  // la página entera por una lámina.
  if (!block.colors?.length) return null
  return (
    <section className="relative z-10 bg-ink gutter-x py-14 md:py-20">
      <div className="grid gap-8 lg:gap-20 items-start md:grid-cols-[1.4fr_1fr] mb-10 md:mb-14">
        <div>
          {block.label && (
            <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.24em] mb-4">
              {block.label}
            </p>
          )}
          {block.heading && (
            <h3
              className="font-display font-semibold text-paper leading-tight tracking-[-0.01em] text-balance"
              style={{ fontSize: 'clamp(1.35rem, 2.1vw, 2rem)' }}
            >
              {block.heading}
            </h3>
          )}
        </div>
        {block.note && (
          <p className="font-sans text-smoke/95 leading-[1.5] text-pretty text-cuerpo">{block.note}</p>
        )}
      </div>

      <PaletteGrid colors={block.colors} />
    </section>
  )
}

/**
 * La entrada de las láminas, sin una línea de JavaScript.
 *
 * `animation-timeline: view()` ata la animación al recorrido del elemento por
 * la ventana, así que el navegador la mueve en su propio hilo. Donde no se
 * admite —y lo dice `@supports`— no pasa nada: la pieza aparece ya puesta,
 * que es el estado final. Y quien haya pedido menos movimiento en su sistema
 * no ve ninguno.
 */
const REVELADO = `
  /*
   * En el teléfono la apertura no puede ser una tira de 16/9 metida entre
   * márgenes. A 375 píxeles eso son 193 de imagen flotando en una pantalla
   * negra de 667, y encima el recorte de la foto se decide contra una caja
   * vertical, así que de una apertura apaisada solo se ve la banda central.
   * Aquí va a sangre, en 3/4 y sin esquinas: la primera imagen del caso
   * ocupa el teléfono, que es lo que tiene que hacer.
   */
  @media (max-width: 767px) {
    .apertura-seccion { padding-left: 0; padding-right: 0; padding-bottom: 0 }
    /* Ni 16/9 entre márgenes ni un 3/4 a sangre: las dos cosas imponen una
       caja y recortan la pieza para que entre. La pieza trae su proporción y
       es la buena —se grabó así—, de modo que aquí manda ella: ancho
       completo, alto el que le toque, y la sección mide lo que mida. */
    .apertura {
      aspect-ratio: auto !important;
      height: auto !important;
      border-radius: 0 !important;
    }
    .apertura .acerca {
      height: auto !important;
      object-fit: contain;
    }
  }

  /*
   * La apertura empieza contenida —16/9, con márgenes y esquinas— y se abre
   * al bajar hasta ocupar la pantalla entera, acercándose un poco.
   *
   * Sin la animación se queda como estaba, que es el estado de base: eso es
   * lo que ve quien use un navegador que no la admita o haya pedido menos
   * movimiento.
   *
   * Lo que se anima es el recorte de la imagen, no la caja: la caja ya mide
   * la pantalla entera y el 'clip-path' la va descubriendo. Así no hay
   * reflujo de maquetación en cada píxel de scroll.
   */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .apertura-seccion { padding-left: 0; padding-right: 0; padding-bottom: 0 }
      .apertura {
        aspect-ratio: auto !important;
        height: 100svh;
        border-radius: 0;
        /* 'clip', no 'hidden': recorta igual, pero no crea contenedor de
           scroll, así que la línea de tiempo sigue avanzando. Con 'visible'
           la imagen al 1,06 del acercamiento se salía de la ventana. */
        overflow: clip;
        --lado: clamp(1rem, 4vw, 4rem);
        --redondeo: 1.25rem;
        --acercamiento: 1.07;
        --alto-tarjeta: calc((100vw - var(--lado) * 2) * 9 / 16);
        --arriba: max(0px, calc((100svh - var(--alto-tarjeta)) / 2));
      }

      /*
       * En el teléfono el recorte de partida no se calcula contra un 16/9:
       * esa cuenta dejaba 237 píxeles de negro arriba y otros tantos abajo,
       * y el gesto consistía en abrir una rendija. Aquí parte de una tarjeta
       * que ya ocupa casi todo y se termina de soltar al bajar.
       */
      @media (max-width: 767px) {
        /* El margen del recorte va en porcentaje y no en píxeles: la caja ya
           no mide una fracción de la ventana, sino lo que mide la pieza, y
           un 3,5svh fijo dentro de una banda de 220 píxeles se come la
           mitad. */
        .apertura {
          --lado: 4%;
          --arriba: 7%;
          --redondeo: 1rem;
          /* Sin acercar. El 1,07 de escritorio se come un 7% por cada borde,
             y lo que se pedía aquí es justamente verla entera. */
          --acercamiento: 1;
        }
        /* Un tramo más corto: en una pantalla de 667 el recorrido de salida
           se agota antes, y con el 65% la apertura terminaba de abrirse ya
           medio fuera de cuadro. */
        .apertura .acerca { animation-range: exit 0% exit 45% }
      }
      @keyframes abrir {
        from {
          clip-path: inset(var(--arriba) var(--lado) var(--arriba) var(--lado) round var(--redondeo));
          transform: scale(1);
        }
        to {
          clip-path: inset(0 0 0 0 round 0);
          transform: scale(var(--acercamiento));
        }
      }
      .apertura .acerca {
        animation: abrir linear both;
        animation-timeline: --apertura;
        /* El tramo de salida: la apertura ya está en pantalla al cargar, así
           que 'entry' tiene longitud cero y no se movía nada. */
        animation-range: exit 0% exit 65%;
        transform-origin: 50% 45%;
        will-change: transform, clip-path;
      }
    }
  }

  /* El color del panel del logotipo entra al pasar por encima. Se hace con
     un velo propio y no con background para que la transición sea suave. */
  .pareja .velo {
    background: var(--marca);
    opacity: 0;
    transition: opacity .55s cubic-bezier(.2,.7,.3,1);
  }
  .pareja:hover .velo { opacity: 1 }
  @media (prefers-reduced-motion: reduce) { .pareja .velo { transition: none } }

  /* El espécimen reacciona al puntero: se abre y engorda. Con una fuente
     variable el peso viaja de verdad; con una estatica el navegador ignora
     font-variation-settings y queda solo el gesto del espaciado. */
  .especimen {
    transition: letter-spacing .45s cubic-bezier(.2,.7,.3,1),
                font-variation-settings .45s cubic-bezier(.2,.7,.3,1),
                opacity .45s ease;
    font-variation-settings: 'wght' 400;
  }
  .especimen:hover {
    letter-spacing: 0.012em;
    font-variation-settings: 'wght' 700;
  }
  @media (prefers-reduced-motion: reduce) { .especimen { transition: none } }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      @keyframes asoma {
        from { opacity: 0; transform: translateY(26px) scale(0.985); }
        to   { opacity: 1; transform: none; }
      }
      .revelado {
        animation: asoma linear both;
        animation-timeline: view();
        /* Durante la entrada, no después: con 'cover 20%' el recorrido
           terminaba antes de que la muestra llegara a verse y la animación
           no se notaba nunca. */
        animation-range: entry 10% entry calc(85% + var(--retraso, 0%));
      }
    }
  }

  /*
   * El escenario: un central al frente y dos laterales que salen de detrás.
   *
   * Las proporciones salen de la escena que ya estaba montada a mano. El
   * aparato se exporta con margen para la sombra, así que la imagen mide un
   * 25% más de alto que el aparato de verdad: por eso el 78svh del central
   * son unos 62svh de teléfono.
   *
   * El desplazamiento va en porcentaje del ancho de la propia imagen, no en
   * píxeles ni en vw. Así la escena se mantiene igual de compuesta en una
   * ventana estrecha que en una de escritorio, sin una sola consulta de
   * medios.
   */
  .escenario .aparato {
    position: absolute;
    left: 50%;
    top: 50%;
    width: auto;
    height: var(--alto);
    transform: translate(-50%, -50%) translateX(var(--x, 0)) rotate(var(--giro, 0deg));
  }
  .escenario .centro  { --alto: 86svh; z-index: 3 }
  .escenario .lateral { --alto: 70svh; z-index: 2; --x: var(--fin) }
  .escenario .izq     { --fin: -120%; --giro: -4.5deg }
  .escenario .der     { --fin:  120%; --giro:  4.5deg }

  /* El estado de base es la escena ya abierta: eso es lo que ve quien use un
     navegador sin líneas de tiempo o haya pedido menos movimiento. */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .escenario { view-timeline-name: --escenario }
      @keyframes sale-de-detras {
        from {
          transform: translate(-50%, -50%) translateX(0) rotate(0deg) scale(.92);
          opacity: 0;
        }
        to {
          transform: translate(-50%, -50%) translateX(var(--fin)) rotate(var(--giro)) scale(1);
          opacity: 1;
        }
      }
      /* El central llega algo más grande y cede sitio al abrirse la escena:
         sin esto el gesto parecía que los laterales se colaban por detrás de
         un aparato que no se entera. */
      @keyframes cede-sitio {
        from { transform: translate(-50%, -50%) scale(1.07) }
        to   { transform: translate(-50%, -50%) scale(1) }
      }
      .escenario .centro {
        animation: cede-sitio linear both;
        animation-timeline: --escenario;
        animation-range: cover 20% cover 48%;
        will-change: transform;
      }
      .escenario .lateral {
        animation: sale-de-detras linear both;
        animation-timeline: --escenario;
        /* Termina en el 48%, que es justo cuando el escenario llena la
           pantalla: con el 60% la escena acababa de abrirse cuando ya se
           estaba yendo por arriba, y el gesto no se veía entero nunca. */
        animation-range: cover 20% cover 48%;
        will-change: transform, opacity;
      }
    }
  }

  /*
   * El escenario en el teléfono: una columna, no un escenario.
   *
   * El desplazamiento lateral va en porcentaje del ancho del propio aparato,
   * que es lo que mantiene la escena compuesta de 768 para arriba. En 375 no:
   * un teléfono de 70svh mide unos 215 de ancho, y el 120 % lo manda a 258
   * píxeles del centro de una pantalla que solo tiene 187 a cada lado. Los
   * dos laterales se quedaban fuera y solo asomaba una astilla por el borde.
   *
   * Así que en móvil la escena se deshace: los tres aparatos pasan a una
   * columna, el central primero, y cada uno aparece subiendo al entrar en
   * pantalla. El fondo sigue detrás de todos, cubriendo la columna entera.
   */
  /*
   * El estado de base en el teléfono: una columna.
   *
   * El desplazamiento de los laterales va en porcentaje del ancho del propio
   * aparato, que es lo que mantiene la escena compuesta de 768 para arriba.
   * En 375 no: un teléfono de 70svh mide unos 215 de ancho, y el 120 % lo
   * manda a 258 píxeles del centro de una pantalla que solo tiene 187 a cada
   * lado. Los dos laterales se quedaban fuera.
   *
   * Esto es lo que ve quien no tenga líneas de tiempo o haya pedido menos
   * movimiento. Con ellas, justo debajo, la sección se recoge a una sola
   * pantalla y los tres se relevan en el sitio.
   */
  @media (max-width: 767px) {
    .escenario {
      height: auto !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 3rem 1rem 3.5rem;
    }
    .escenario .aparato {
      position: static;
      height: auto;
      width: min(72%, 290px);
      transform: none;
    }
    .escenario .centro { order: 1; width: min(86%, 340px) }
    .escenario .izq    { order: 2 }
    .escenario .der    { order: 3 }
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) and (max-width: 767px) {
      /*
       * El relevo.
       *
       * Una columna con los tres aparatos uno debajo de otro medía 1.482
       * píxeles —casi cuatro pantallas— para enseñar tres capturas. Aquí la
       * sección vuelve a durar una pantalla y son los aparatos los que se
       * turnan en el mismo hueco mientras pasa: se baja lo mismo que por
       * cualquier otra sección y se ven las tres.
       */
      .escenario {
        height: 100svh !important;
        display: block;
        padding: 0;
      }
      .escenario .aparato {
        position: absolute;
        left: 50%;
        top: 50%;
        height: 62svh;
        width: auto;
        /* De frente, sin el giro ni el desplazamiento de la escena abierta:
           aquí no hay laterales, hay turnos. */
        --x: 0;
        --giro: 0deg;
        transform: translate(-50%, -50%);
        animation: releva linear both;
        animation-timeline: --escenario;
        will-change: transform, opacity;
      }

      /* Entra subiendo un poco, se queda su turno y sale. */
      @keyframes releva {
        0%   { opacity: 0; transform: translate(-50%, -50%) translateY(6%)  scale(.97) }
        20%  { opacity: 1; transform: translate(-50%, -50%) }
        74%  { opacity: 1; transform: translate(-50%, -50%) }
        100% { opacity: 0; transform: translate(-50%, -50%) translateY(-4%) scale(.985) }
      }
      /* El último no sale: si saliera, la sección terminaría en negro justo
         cuando se está yendo por arriba. */
      @keyframes entra-y-queda {
        0%   { opacity: 0; transform: translate(-50%, -50%) translateY(6%) scale(.97) }
        24%  { opacity: 1; transform: translate(-50%, -50%) }
        100% { opacity: 1; transform: translate(-50%, -50%) }
      }

      /*
       * Los tramos se solapan a propósito: el que sale y el que entra se
       * cruzan, de modo que nunca hay un instante con el hueco vacío.
       *
       * Van del 8 % al 92 % del recorrido y no de punta a punta: en 'cover',
       * el 0 % es la sección asomando por abajo y el 100 % ya fuera por
       * arriba, así que los extremos caen donde no se ve.
       */
      .escenario .centro { animation-range: cover  8% cover 44%; z-index: 3 }
      .escenario .izq    { animation-range: cover 34% cover 70%; z-index: 2 }
      .escenario .der    { animation-range: cover 60% cover 92%; z-index: 1;
                           animation-name: entra-y-queda }
    }
  }
`


/**
 * El espécimen tipográfico.
 *
 * La muestra se dibuja con la pila que indique `family`. Cuando la fuente real
 * no se puede servir, `substitute` lo dice en la propia lámina: enseñar otra
 * letra sin avisar sería presentar como del proyecto algo que no lo es.
 */
function TypographyRenderer({ block }: { block: TypographyBlock }) {
  if (!block.faces?.length) return null
  /* Un proyecto puede resolverse con una sola familia —Merxo lo hace— y
     entonces la lámina de dos columnas deja media sección en negro. Con una
     sola muestra, el nombre y la escalera se reparten el ancho entre ellos. */
  const sola = block.faces.length === 1
  return (
    <section className="relative z-10 bg-ink gutter-x py-14 md:py-20">
      <div className="grid gap-8 lg:gap-20 items-start md:grid-cols-[1.4fr_1fr] mb-10 md:mb-14">
        <div>
          {block.label && (
            <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.24em] mb-4">
              {block.label}
            </p>
          )}
          {block.heading && (
            <h3
              className="font-display font-semibold text-paper leading-tight tracking-[-0.01em] text-balance"
              style={{ fontSize: 'clamp(1.35rem, 2.1vw, 2rem)' }}
            >
              {block.heading}
            </h3>
          )}
        </div>
        {block.note && (
          <p className="font-sans text-smoke/95 leading-[1.5] text-pretty text-cuerpo">{block.note}</p>
        )}
      </div>

      <div className={`grid gap-12 md:gap-0 border-t border-line ${sola ? '' : 'md:grid-cols-2'}`}>
        {block.faces.map((f, i) => (
          <div
            key={f._key}
            /* Las dos muestras se tocan por una línea, como las dos páginas de
               un catálogo tipográfico. Antes flotaban separadas y la lámina
               no llegaba a leerse como una sola pieza. */
            className={`py-10 md:py-14 ${sola ? '' : i === 0 ? 'md:pr-12 lg:pr-20' : 'md:pl-12 lg:pl-20 md:border-l border-line'}`}
          >
            {f.webfont && <link rel="stylesheet" href={f.webfont} />}

            <div className="flex items-baseline justify-between gap-4 mb-2">
              <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.24em]">
                {f.role}
              </p>
              <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.2em]">
                {[f.source, f.year].filter(Boolean).join(' · ')}
              </p>
            </div>

            {/* El nombre, en su propia letra. */}
            <p
              className="text-paper leading-[0.9] tracking-[-0.02em] mb-6"
              style={{ fontFamily: f.family, fontSize: 'clamp(1.9rem, 3.4vw, 3.2rem)' }}
            >
              {f.name}
            </p>

            <div className={sola
              ? 'grid gap-6 lg:gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-center'
              : ''}>

              {/*
               * La «Aa» enorme.
               *
               * Es lo que de verdad enseña una letra: su asta, su ojo y el
               * salto de caja alta a baja, al tamaño en que esas cosas se
               * ven. Al pasar por encima se estira y gana peso, que es la
               * manera de notar que la familia es variable sin explicarlo.
               */}
              <p
                className={`especimen text-paper leading-[0.82] tracking-[-0.045em] select-none
                            ${sola ? '' : 'mb-6'}`}
                style={{
                  fontFamily: f.family,
                  // Con dos familias cada una vive en media página, así que la
                  // muestra tiene que medirse contra su columna: a 17vw se
                  // comía la escalera de tamaños que va justo debajo.
                  fontSize: sola ? 'clamp(7rem, 17vw, 15rem)' : 'clamp(4.5rem, 9.5vw, 10rem)',
                }}
                aria-hidden="true"
              >
                Aa
              </p>

              {/* Escalera de tamaños: cómo se comporta en uso. */}
              <div className="space-y-3">
                {(block.muestra ?? ['Aa Bb Cc', 'Titular de sección', 'Texto corrido de interfaz'])
                  .map((txt, n) => ({ px: ['64', '32', '18'][n], txt }))
                  .map(l => (
                  <div key={l.px} className="flex items-baseline gap-5">
                    <span className="font-mono text-smoke/70 text-[12px] md:text-[14px] w-8 shrink-0 text-right">
                      {l.px}
                    </span>
                    <span
                      className="text-paper/90 leading-[1.08] truncate"
                      style={{ fontFamily: f.family, fontSize: `clamp(${+l.px * 0.42}px, ${+l.px * 0.075}vw + ${+l.px * 0.34}px, ${l.px}px)` }}
                    >
                      {l.txt}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p
              className="text-paper/55 leading-snug break-words border-t border-line pt-5 mt-8"
              style={{ fontFamily: f.family, fontSize: 'clamp(0.95rem, 1.3vw, 1.2rem)' }}
            >
              ABCDEFGHIJKLMNÑOPQRSTUVWXYZ abcdefghijklmnñopqrstuvwxyz 0123456789
            </p>

            <div className="mt-4 space-y-1">
              {f.note && (
                <p className="font-sans text-smoke/75 leading-snug text-pretty"
                   style={{ fontSize: 'clamp(0.95rem, 0.7vw + 0.6rem, 1.15rem)' }}>{f.note}</p>
              )}
              {f.substitute && (
                <p className="font-mono text-smoke/80 text-[12px] md:text-[14px] tracking-[0.06em]">
                  Muestra compuesta con una fuente equivalente: la original no se sirve aquí.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * Sección de solo texto, a página entera.
 *
 * Alta a propósito: el valor está en el silencio que deja alrededor. Si el
 * bloque trae color de marca, el texto se calcula en blanco o negro según su
 * luminancia, igual que en la lámina de paleta.
 */
function StatementRenderer({ block }: { block: StatementBlock }) {
  const sobreColor = !!block.fondo
  const tinta = sobreColor ? legibleSobre(block.fondo!) : undefined
  /*
   * Todo en tinta sobre el color.
   *
   * El blanco solo era legal en el titular: sobre el terracota de Maison da
   * 3,49:1, que pasa el umbral de texto grande (3:1) pero no el de texto
   * normal (4,5:1). Eso dejaba el bloque a dos colores sin que la diferencia
   * significara nada. En tinta va entero a 5,5:1.
   */

  return (
    <section
      className="gutter-x flex items-center"
      style={{
        background: block.fondo ?? 'rgb(var(--color-ink-rgb))',
        minHeight: 'min(68vh, 680px)',
        paddingBlock: 'clamp(3.5rem, 8vh, 6rem)',
      }}
    >
      <div className="w-full">
        {block.label && (
          <p
            className="font-mono text-[12px] md:text-[14px] uppercase tracking-[0.26em] mb-8"
            style={{ color: sobreColor ? tinta : undefined, opacity: sobreColor ? 0.7 : 1 }}
          >
            <span className={sobreColor ? '' : 'text-smoke/65'}>{block.label}</span>
          </p>
        )}
        <p
          className="font-display font-semibold leading-[0.9] tracking-[-0.035em] max-w-[16ch] text-balance"
          style={{ fontSize: 'clamp(3rem, 8.5vw, 8rem)', color: tinta }}
        >
          <span className={sobreColor ? '' : 'text-paper'}>{block.lead}</span>
        </p>
        {block.body && (
          <p
            className="font-sans leading-[1.35] mt-7 max-w-[72ch] text-pretty"
            style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.9rem)', color: tinta, opacity: sobreColor ? 0.85 : 1 }}
          >
            <span className={sobreColor ? '' : 'text-smoke/95'}>{block.body}</span>
          </p>
        )}
      </div>
    </section>
  )
}

function MediaRenderer({ block, bg, title }: { block: MediaBlock; bg: string; title: string }) {
  const isSmall = block.size === 'sm'
  // A sangre: sin márgenes laterales ni esquinas. Es la pieza que separa un
  // capítulo del siguiente, y para eso tiene que tocar los dos bordes.
  const sangre = block.size === 'bleed'
  const alt = mediaAlt(block.caption, title)
  // El hueco era 16/9 siempre, y la portada de Maison es de 1,31: la pieza se
  // recortaba por arriba y por abajo, de modo que la apertura del caso
  // enseñaba a la modelo sin cabeza.
  const { aspectRatio, ajuste } = hueco(block)
  return (
    <section className={`relative z-10 bg-ink ${sangre ? 'py-0' : 'gutter-x py-5 md:py-8'}`}>
      <figure className={`${isSmall ? 'max-w-[75%]' : 'w-full'} ${sangre ? 'relative' : ''}`}>
        {/* A sangre son 100svh y `object-cover`: en escritorio eso llena la
            ventana con una pieza apaisada y funciona. En un teléfono es una
            caja vertical contra una pieza horizontal, así que de un vídeo de
            1280x800 se veía una franja central de 390 de ancho. Aquí, como
            en la apertura, manda la pieza: ancho completo y el alto que le
            toque. */}
        <div
          className={`relative overflow-hidden ${sangre ? 'max-md:h-auto md:h-[100svh]' : 'rounded-pieza'}`}
          style={sangre || !aspectRatio ? undefined : { aspectRatio }}
        >
          {block.url ? (
            block.mediaType === 'video' ? (
              <video
                src={block.url}
                autoPlay muted loop playsInline
                aria-label={alt}
                className={`w-full ${sangre ? 'max-md:h-auto md:h-full' : aspectRatio ? 'h-full' : 'h-auto'} ${ajuste}`}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.url}
                alt={alt}
                className={`w-full ${sangre ? 'max-md:h-auto md:h-full' : aspectRatio ? 'h-full' : 'h-auto'} ${ajuste}`}
                loading="lazy"
                draggable={false}
              />
            )
          ) : (
            <div className="w-full h-full" style={{ background: bg }} />
          )}
        </div>
        {block.credito && (
          <figcaption
            className={`font-mono text-[12px] md:text-[14px] uppercase tracking-[0.2em] ${sangre
              ? 'absolute bottom-6 left-0 gutter-x text-white/70 mix-blend-difference'
              : 'text-smoke/95 mt-3'}`}
          >
            {block.credito}
          </figcaption>
        )}
      </figure>
    </section>
  )
}

/**
 * Un escenario: fondo y aparatos, en capas.
 *
 * La versión plana —una sola imagen con los tres teléfonos ya colocados— no
 * dejaba contar nada: la escena entera llegaba hecha. Aquí el central llega
 * solo y los dos laterales salen de detrás al bajar, que es el orden en que
 * se entiende el producto.
 *
 * Las medidas van en `svh` para los dos, de modo que la proporción entre el
 * central y los laterales no depende del tamaño de la ventana, y el
 * desplazamiento lateral va en porcentaje del ancho del propio aparato, por
 * lo mismo.
 */
function EscenarioRenderer({ block, title }: { block: EscenarioBlock; title: string }) {
  const alt = block.alt?.trim() || `${title} — pantallas del producto`
  const lados = ([['izq', block.izq], ['der', block.der]] as const).filter(([, src]) => !!src)
  return (
    <section className="relative z-10 bg-ink">
      {/* 'clip' y no 'hidden': recorta igual pero no crea contenedor de
          scroll, que es lo que dejaba muertas las líneas de tiempo. */}
      <div className="escenario relative h-[100svh] overflow-clip">
        {block.fondo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={block.fondo} alt="" aria-hidden
               className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        )}
        {lados.map(([lado, src]) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={lado} src={src!} alt="" aria-hidden
               className={`aparato lateral ${lado}`} draggable={false} />
        ))}
        {block.centro && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={block.centro} alt={alt} className="aparato centro" draggable={false} />
        )}
        {block.credito && (
          <figcaption className="absolute bottom-6 left-0 gutter-x font-mono text-[12px] md:text-[14px] uppercase tracking-[0.2em] text-white/70 mix-blend-difference">
            {block.credito}
          </figcaption>
        )}
      </div>
    </section>
  )
}

/**
 * El hueco de una pieza, a partir de lo que mide de verdad.
 *
 * Antes solo había dos huecos —cuadrado y retrato— y la pieza se recortaba
 * para entrar en el que le tocara. Con una grabación de móvil de 1280×2770
 * eso significaba cortarle la cabeza a la modelo, y con una de escritorio de
 * 1280×800, quitarle la columna derecha a la ficha.
 *
 * Ahora el hueco toma la proporción del archivo. Fuera de la banda razonable
 * —una grabación de móvil entera es casi el doble de alta que ancha— el hueco
 * se queda en el extremo y la pieza pasa a `contain`: se ve entera, con aire a
 * los lados, que es infinitamente mejor que verla decapitada.
 */
const BANDA: [number, number] = [0.62, 1.78]

/** Sin medida conocida se cae a lo de antes: el bloque suelto a 16/9 y la
 *  pieza de pareja a cuadrado o retrato según su `size`. */
function porDefecto(pieza: SplitItem | MediaBlock) {
  // `SplitItem` no lleva `_type`: eso es justo lo que distingue a los dos.
  if ('_type' in pieza) return '16 / 9'
  return pieza.size === 'sm' ? '1 / 1' : '100 / 128'
}

function hueco(pieza: SplitItem | MediaBlock) {
  const real = pieza.ratio
  if (!real || !Number.isFinite(real)) {
    // Una pieza suelta sin medida en el CMS caía en un 16/9 de oficio, y con
    // eso una grabación de escritorio de 1280x800 —que es 1,6— se recortaba
    // un 11 % por arriba y por abajo. Pasaba en los ocho casos. Sin medida no
    // hay nada que adivinar: se quita la caja y el alto lo pone el archivo,
    // que es quien lo sabe. La pareja sí conserva su hueco, porque ahí las
    // dos fichas tienen que medir lo mismo.
    if ('_type' in pieza) return { aspectRatio: null, ajuste: '' }
    return { aspectRatio: porDefecto(pieza), ajuste: 'object-cover' }
  }
  const limitado = Math.min(Math.max(real, BANDA[0]), BANDA[1])
  // Si hubo que limitar, la proporción del hueco ya no es la de la pieza:
  // recortar ahí es justo lo que rompía las dos grabaciones.
  return {
    aspectRatio: String(limitado),
    ajuste: Math.abs(limitado - real) > 0.02 ? 'object-contain' : 'object-cover',
  }
}

function SplitItemCard({ item, bg, title }: { item: SplitItem; bg: string; title: string }) {
  const { aspectRatio, ajuste } = hueco(item)
  const alt = mediaAlt(item.caption, title)
  return (
    <figure>
      <div
        className="relative overflow-hidden rounded-pieza"
        /* La pareja siempre trae hueco: sin medida cae en el de oficio, que
           es lo que mantiene las dos fichas a la misma altura. */
        style={{ aspectRatio: aspectRatio ?? undefined }}
      >
        {item.url ? (
          item.mediaType === 'video' ? (
            <video
              src={item.url}
              autoPlay muted loop playsInline
              aria-label={alt}
              className={`w-full h-full ${ajuste}`}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={alt}
              className={`w-full h-full ${ajuste}`}
              loading="lazy"
              draggable={false}
            />
          )
        ) : (
          <div className="w-full h-full" style={{ background: bg }} />
        )}
      </div>
    </figure>
  )
}

function SplitShowRenderer({ block, bg, title }: { block: SplitShowBlock; bg: string; title: string }) {
  // Una pieza sola no puede quedarse en media página —al retirar su compañera
  // dejaba medio folio en negro— pero tampoco irse a borde completo: siendo
  // vertical, llenaba la pantalla entera. Va centrada y contenida.
  const layout = block.items.length === 1 ? 'sola' : (block.layout ?? 'pair')
  const card = (item: SplitItem) =>
    <SplitItemCard key={item._key} item={item} bg={bg} title={title} />

  // Una pieza sola: centrada, sin pasar de dos tercios del ancho.
  if (layout === 'sola') {
    return (
      <section className="relative z-10 bg-ink gutter-x py-10 md:py-14">
        <div className="mx-auto w-full md:max-w-[66%] lg:max-w-[58%]">
          {block.items.map(card)}
        </div>
      </section>
    )
  }

  // De borde a borde, cuando el bloque lo pide expresamente.
  if (layout === 'bleed') {
    return (
      <section className="relative z-10 bg-ink py-10 md:py-14">
        <div className="flex flex-col gap-8">{block.items.map(card)}</div>
      </section>
    )
  }

  // Rejilla de cuatro: iconos, detalles de interfaz, aplicaciones. Piezas
  // pequeñas que se leen juntas y que en dos columnas quedaban enormes.
  if (layout === 'grid4') {
    return (
      <section className="relative z-10 bg-ink gutter-x py-10 md:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {block.items.map(card)}
        </div>
      </section>
    )
  }

  // Dos a la misma altura, sin desfase: compara escritorio contra móvil.
  if (layout === 'strip2') {
    return (
      <section className="relative z-10 bg-ink gutter-x py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          {block.items.map(card)}
        </div>
      </section>
    )
  }

  /*
   * Por defecto: dos columnas desfasadas, el ritmo de siempre.
   *
   * Esto se dibujaba dos veces —un árbol `hidden md:grid` y otro `md:hidden`—
   * así que cada pieza existía por duplicado en la página: las imágenes se
   * pedían dos veces y los vídeos se reproducían dos veces, uno de ellos
   * dentro de un contenedor invisible. Ahora hay un solo árbol.
   *
   * El truco son las columnas en `display: contents`: en móvil desaparecen
   * como cajas y sus piezas pasan a ser hijas directas de la columna única,
   * donde `order` les devuelve el orden original. A partir de `md` vuelven a
   * ser dos columnas de verdad, cada una con su propio alto, que es lo que
   * produce el desfase.
   */
  const columna = (resto: 0 | 1, extra: string) => (
    <div className={`contents md:flex md:flex-col md:gap-10 lg:gap-14 ${extra}`}>
      {block.items.filter((_, i) => i % 2 === resto).map(item => (
        <div key={item._key} style={{ order: block.items.indexOf(item) }} className="md:order-none">
          {card(item)}
        </div>
      ))}
    </div>
  )
  return (
    <section className="relative z-10 bg-ink gutter-x py-10 md:py-14">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-10 lg:gap-14">
        {columna(0, '')}
        {columna(1, 'md:mt-20')}
      </div>
    </section>
  )
}

function QuoteRenderer({ block }: { block: QuoteBlock }) {
  return (
    <section className="relative z-10 bg-ink gutter-x py-16 md:py-24">
      <blockquote className="w-full max-w-[74rem] border-l-2 border-accent pl-8 md:pl-12">
        <p
          className="font-display font-semibold text-paper leading-[0.98] tracking-[-0.035em] text-balance"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}
        >
          {block.text}
        </p>
      </blockquote>
    </section>
  )
}

function FeedbackRenderer({ block, feedbackLabel }: { block: FeedbackBlock; feedbackLabel: string }) {
  return (
    <section className="relative z-10 bg-ink gutter-x py-14 md:py-20 border-t border-line">
      <div className="grid md:grid-cols-[0.85fr_2fr] gap-10 lg:gap-20 items-start">
        <div className="md:pt-1">
          <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.24em]">
            {feedbackLabel}
          </p>
        </div>
        <div>
          <p
            className="font-display font-semibold text-paper leading-[0.95] tracking-[-0.03em] mb-8 max-w-[52ch] text-balance"
            style={{ fontSize: 'clamp(1.25rem, 2.2vw, 2.1rem)' }}
          >
            "{block.quote}"
          </p>
          <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.2em]">
            {block.name} · {block.role}{block.company ? `, ${block.company}` : ''}
          </p>
          {block.link && (
            <a
              href={block.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[12px] md:text-[14px] uppercase tracking-[0.2em] text-paper/65 hover:text-accent mt-5 transition-colors duration-200"
            >
              {block.link.label} →
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─── Tonos del caso ──────────────────────────────────────────────────────────
 *
 * Un caso entero en negro se lee como una sola masa: no hay manera de notar
 * que has pasado de un capítulo al siguiente. La referencia alterna papel,
 * negro y color de marca, y ese cambio es lo que marca el compás.
 *
 * Aquí no hace falta tocar un solo renderizador. Los colores del sitio son
 * variables CSS con los canales sueltos —`--color-ink-rgb: 14 14 14`— así que
 * redefinirlas en el envoltorio del capítulo le da la vuelta a todo lo que
 * hay dentro: `bg-ink` se vuelve claro, `text-paper` se vuelve oscuro, y las
 * opacidades (`text-smoke/60`) siguen funcionando porque son canales.
 */
type Tono = Record<string, string>

const TINTA: Tono = {}   // el de siempre; no redefine nada

const PAPEL: Tono = {
  '--color-ink-rgb':   '239 235 227',
  '--color-paper-rgb': '14 14 14',
  '--color-smoke-rgb': '64 62 58',
  '--color-line-rgb':  '206 200 190',
  '--color-ink':       '#EFEBE3',
  '--color-paper':     '#0E0E0E',
  '--color-smoke':     '#403E3A',
  '--color-line':      '#CEC8BE',
}

/**
 * El color de marca del propio proyecto.
 *
 * Primero su lámina de paleta, que es la fuente buena. Los casos que no la
 * tienen lo llevan escrito en el documento, medido sobre sus propias
 * pantallas: sin esto cerraban en papel en vez de en su color.
 */
function marcaDe(story: StoryBlock[], escrito?: string | null): string | null {
  const paleta = story.find(b => b._type === 'palette') as PaletteBlock | undefined
  if (!paleta?.colors?.length) return escrito ?? null
  // El acento es el tono con color de verdad: se descartan los casi blancos y
  // los casi negros, que en estas paletas son el papel y la tinta.
  const vivo = paleta.colors.find(c => {
    const [r, g, b] = aRgb(c.hex)
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    return max - min > 40 && max > 60
  })
  return vivo?.hex ?? escrito ?? null
}

function tonoMarca(hex: string): Tono {
  const sobre = esClaro(hex)
  return {
    '--color-ink-rgb':   aRgb(hex).join(' '),
    '--color-paper-rgb': sobre ? '14 14 14' : '255 255 255',
    // Sobre color, el secundario se dibuja casi al mismo valor que el
    // principal: un gris a media opacidad sobre naranja se cae a 3:1.
    '--color-smoke-rgb': sobre ? '20 19 17' : '255 255 255',
    '--color-line-rgb':  sobre ? '0 0 0' : '255 255 255',
    '--color-ink':       hex,
    '--color-paper':     sobre ? '#0E0E0E' : '#FFFFFF',
    '--color-smoke':     sobre ? '#34322E' : '#ECECEC',
    '--color-line':      sobre ? '#000000' : '#FFFFFF',
  }
}

/**
 * Parte la historia en capítulos y le pone tono a cada uno.
 *
 * Un capítulo empieza en cada `sectionHeader`; lo que va antes del primero es
 * el capítulo de apertura. El compás se repite cada cuatro, de modo que el
 * color de marca aparece una vez por vuelta y no se gasta.
 */
/**
 * ¿Este capítulo va sobre fondo claro?
 *
 * El tono redefine `--color-ink`, que en este sistema es el fondo. Sin
 * redefinir —el tono tinta— el fondo es el negro de siempre.
 */
function tonoClaro(tono: Tono) {
  const fondo = tono['--color-ink']
  return fondo ? esClaro(fondo) : false
}

function enCapitulos(story: StoryBlock[], marca: string | null) {
  const caps: { desde: number; tono: Tono; bloques: StoryBlock[] }[] = []
  story.forEach((b, i) => {
    if (!caps.length || b._type === 'sectionHeader') caps.push({ desde: i, tono: TINTA, bloques: [] })
    caps[caps.length - 1].bloques.push(b)
  })

  /*
   * El compás, y una excepción.
   *
   * Los capítulos alternan negro y papel. El último se viste del color de la
   * marca: es donde está el resultado y el testimonio del cliente, y conviene
   * que el caso cierre con la marca puesta y no con otro capítulo más.
   *
   * La identidad —paleta y tipografía— cae en papel por el ciclo, y eso es lo
   * que interesa: unas muestras de color sobre el propio color de la marca no
   * se distinguirían de su fondo.
   */
  const compas = [TINTA, PAPEL, PAPEL]
  caps.forEach((c, i) => {
    const ultimo = i === caps.length - 1
    c.tono = ultimo && marca ? tonoMarca(marca) : compas[i % compas.length]
  })
  return caps
}

/**
 * El logotipo, en dos paneles y sin explicación.
 *
 * Izquierda: sobre el color de la marca. Derecha: en blanco sobre fotografía.
 * El archivo es uno solo —el logo real, negro sobre transparente— y el color
 * se lo da un filtro, así que no hay dos versiones que mantener ni ninguna
 * recoloreada a mano que pueda quedarse desfasada.
 */
function LogoRenderer({ block, claro }: { block: LogoBlock; claro: boolean }) {
  if (!block.src) return null
  const fondo = block.fondo ?? '#EFEBE3'
  const oscuro = esClaro(fondo)
  /*
   * En reposo el panel no tiene fondo propio: enseña el del capítulo. Antes
   * el rótulo iba siempre en tinta, y en un capítulo de tono oscuro —que es
   * donde cae la identidad en cuanto el caso tiene un capítulo más— quedaba
   * negro sobre negro, invisible.
   */
  const reposo = claro ? 'brightness(0)' : 'brightness(0) invert(1)'
  return (
    <section className="relative z-10 bg-ink gutter-x py-12 md:py-16">
      {(block.label || block.heading || block.note) && (
        <div className="grid gap-8 lg:gap-20 md:grid-cols-[1fr_1fr] mb-8 md:mb-10">
          <div>
            {block.label && (
              <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.24em] mb-3">
                {block.label}
              </p>
            )}
            {block.heading && (
              <h3
                className="font-display font-semibold text-paper leading-tight tracking-[-0.015em] text-balance"
                style={{ fontSize: 'clamp(1.35rem, 2.1vw, 2rem)' }}
              >
                {block.heading}
              </h3>
            )}
          </div>
          {block.note && (
            <p className="font-sans text-smoke/95 leading-[1.5] text-pretty"
               style={{ fontSize: 'clamp(1rem, 0.8vw + 0.7rem, 1.25rem)' }}>
              {block.note}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {/*
          * El panel arranca en papel y el color entra al pasar por encima,
          * como en la referencia: primero se ve el logotipo como es, y el
          * color llega después, que es el orden en que se explica una marca.
          *
          * El logotipo son dos copias del mismo archivo, una en tinta y otra
          * en blanco, cruzándose. Un filtro de color no interpola entre
          * `brightness(0)` e `invert(1)`, así que el cambio daría un salto.
          */}
        <figure className="pareja group relative" style={{ ['--marca' as string]: fondo }}>
          <div className="relative flex items-center justify-center p-10 md:p-16 overflow-hidden rounded-pieza"
               style={{ aspectRatio: '4 / 3' }}>
            <span className="velo absolute inset-0" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt="" aria-hidden="true"
                 className="relative w-[62%] max-w-[420px] transition-opacity duration-500 group-hover:opacity-0"
                 style={{ filter: reposo }} draggable={false} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt="" aria-hidden="true"
                 className="absolute w-[62%] max-w-[420px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                 style={{ filter: (oscuro && !block.logoBlanco) ? 'brightness(0)' : 'brightness(0) invert(1)' }}
                 draggable={false} />
          </div>
          {block.pie && (
            <figcaption className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.2em] mt-3">
              {block.pie}
            </figcaption>
          )}
        </figure>

        <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', background: fondo }}>
          {block.foto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.foto} alt="" aria-hidden="true"
                 className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          )}
          <div className="absolute inset-0 flex items-center justify-center p-10 md:p-16">
            {/* Sobre fotografía, en tinta salvo que la imagen sea oscura: la
                fotografía de moda se hace sobre fondo claro —la más oscura de
                esta casa da 182 de 255— y el blanco encima no se lee. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.src}
              alt=""
              aria-hidden="true"
              className="w-[62%] max-w-[420px]"
              style={{ filter: block.fotoOscura ? 'brightness(0) invert(1)' : 'brightness(0)' }}
              draggable={false}
            />
          </div>
        </div>
      </div>

      {block.credito && (
        <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.2em] mt-3">
          {block.credito}
        </p>
      )}
    </section>
  )
}

function StoryBlockRenderer({
  block, bg, feedbackLabel, index, title, claro,
}: {
  block: StoryBlock; bg: string; feedbackLabel: string; index: number; title: string
  /** Cierto cuando el capítulo va sobre fondo claro. */
  claro: boolean
}) {
  switch (block._type) {
    case 'overview':      return <OverviewRenderer      block={block} />
    // The id comes from the heading and its position, the same way the nav
    // builds it, so the two always agree on where a chapter is.
    case 'sectionHeader': return <SectionHeaderRenderer block={block} id={block.heading ? chapterId(block.heading, index) : undefined} />
    case 'media':         return <MediaRenderer         block={block} bg={bg} title={title} />
    case 'splitShow':     return <SplitShowRenderer     block={block} bg={bg} title={title} />
    case 'quote':         return <QuoteRenderer         block={block} />
    case 'feedback':      return <FeedbackRenderer      block={block} feedbackLabel={feedbackLabel} />
    // Paleta y tipografía se dibujan, no se fotografían.
    case 'palette':       return <PaletteRenderer       block={block} />
    case 'typography':    return <TypographyRenderer    block={block} />
    case 'statement':     return <StatementRenderer     block={block} />
    case 'logo':          return <LogoRenderer          block={block} claro={claro} />
    case 'escenario':     return <EscenarioRenderer     block={block} title={title} />
    default:              return null
  }
}

// ─── Siguiente proyecto ───────────────────────────────────────────────────────

function NextProjectSection({
  next, nextLabel, backLabel,
}: {
  next: ProjectPreview; nextLabel: string; backLabel: string
}) {
  const bg = getBg(next.vertical)
  // La portada compuesta manda sobre la del CMS, igual que en la tarjeta del
  // índice. Los casos que nacieron en el repositorio y pasaron al CMS no
  // tienen `coverImage`, así que aquí salía el degradado de relleno.
  const portada = coverFor(next.slug?.current, '1x1') ?? next.cover
  return (
    <section className="relative z-10 bg-ink gutter-x py-16 md:py-20 border-t border-line">
      <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.24em] mb-8">
        {nextLabel}
      </p>

      <Link
        href={`/proyectos/${next.slug.current}`}
        className="group inline-flex items-end gap-6 md:gap-10"
      >
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: 'clamp(96px, 13vw, 190px)', aspectRatio: '1 / 1' }}
          aria-hidden
        >
          {portada ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portada}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full" style={{ background: bg }} />
          )}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgba(14,14,14,0.35)' }}
          />
        </div>

        <h3
          className="font-display font-semibold text-paper/60 group-hover:text-paper transition-colors duration-300 leading-[0.9] tracking-[-0.04em] pb-1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 6.5rem)' }}
        >
          {next.title}
          <span className="text-smoke/55 group-hover:text-accent transition-colors duration-300"> →</span>
        </h3>
      </Link>

      <div className="mt-10">
        <Link
          href="/proyectos"
          className="font-mono text-smoke/95 hover:text-paper text-[12px] md:text-[14px] uppercase tracking-[0.22em] transition-colors duration-200"
        >
          {backLabel}
        </Link>
      </div>
    </section>
  )
}

// ─── View ─────────────────────────────────────────────────────────────────────

export async function ProjectView({
  slug, locale, inModal = false,
}: {
  slug: string; locale: string
  /** Inside the modal there is no site header above, so the title sits higher. */
  inModal?: boolean
}) {
  const project: Project | null = await getProjectBySlug(slug)
  if (!project) notFound()

  const t    = await getTranslations('proyectos')

  // One locale, one source: whatever the CMS holds is what the page shows.
  // This used to pick between Spanish and English arrays wholesale, and the
  // English side was a mock that carried the prose but none of the image
  // blocks — which is why every English case study rendered without its work.
  const { subtitle, excerpt, metrics, story } = project

  /*
   * La imagen de apertura.
   *
   * Primero la portada cinematográfica que ya compusimos para la rejilla:
   * lleva la captura real del proyecto en una ventana sobre su escenario. La
   * del CMS se queda de respaldo, pero en varios casos es un degradado sin
   * nada dentro —Merxo abría con un violeta vacío a pantalla completa—, y eso
   * no es una apertura, es un hueco.
   */
  const apertura = coverFor(project.slug?.current, '16x9') ?? project.cover

  const bg = getBg(project.vertical)

  const ctaData = CTA_DATA[slug] ?? DEFAULT_CTA

  // JSON-LD — Quick Win #5
  const jsonLd = {
    '@context':    'https://schema.org',
    '@type':       'CreativeWork',
    name:          project.title,
    description:   excerpt,
    url:           absoluteUrl(locale, `/proyectos/${project.slug.current}`),
    image:         project.cover ?? undefined,
    // `year` is optional in the Sanity schema — guard it, or a project saved
    // without one throws and takes down the whole case study page.
    ...(project.year != null && { dateCreated: project.year.toString() }),
    keywords:      [project.vertical, 'automatización IA', 'diseño de producto', 'UX/UI', 'Nexxo'].join(', '),
    creator: {
      '@type': 'Organization',
      name:    'Nexxo',
      url:     SITE_URL,
    },
    ...(metrics && metrics.length > 0 && {
      comment: metrics.map(m => `${m.label}: ${m.value}`).join(' · '),
    }),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio',    item: absoluteUrl(locale) },
      { '@type': 'ListItem', position: 2, name: 'Proyectos', item: absoluteUrl(locale, '/proyectos') },
      { '@type': 'ListItem', position: 3, name: project.title },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <main>
      {/* La hoja de estilo del caso: el velo del logotipo, el acercamiento de
          la apertura y la entrada de las muestras de color. Vivía dentro de
          la lámina de paleta, de modo que en los casos que no la tienen
          —Mente, Solivus, Nexo Go— no se cargaba ninguna de las tres. */}
      <style>{REVELADO}</style>

      {/* ── 1. Tophead ─────────────────────────────────────────────────────── */}
      <section
        id="resumen"
        className={`bg-ink gutter-x pb-12 md:pb-16 flex flex-col items-center text-center scroll-mt-24
                    ${inModal ? 'pt-16 md:pt-20' : 'pt-32 md:pt-44'}`}
      >

        {/* Breadcrumb visual. The modal has its own header and a close button,
            and a trail back to a page you are already standing on would be
            noise there. */}
        <nav aria-label="Breadcrumb" className={`absolute top-[5.5rem] gutter-l ${inModal ? 'hidden' : ''}`}>
          <ol className="flex items-center gap-2 font-mono text-[12px] md:text-[14px] uppercase tracking-[0.2em] text-paper/55">
            <li><Link href={`/${locale}`} className="hover:text-paper/60 transition-colors">Inicio</Link></li>
            <li aria-hidden className="text-paper/15">›</li>
            <li><Link href={`/${locale}/proyectos`} className="hover:text-paper/60 transition-colors">{t('volver').replace('← Volver a ', '')}</Link></li>
            <li aria-hidden className="text-paper/15">›</li>
            <li className="text-paper/70">{project.title}</li>
          </ol>
        </nav>

        <p className="font-mono text-smoke/95 text-[12px] md:text-[14px] uppercase tracking-[0.28em] mb-7">
          {/* Every part is optional in the schema — join only what exists so a
              missing field doesn't leave a dangling separator. */}
          {[project.client, project.year, project.vertical, project.timeline]
            .filter(Boolean)
            .join(' · ')}
        </p>

        <h1
          className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em] text-cubierta"
        >
          {project.title}
        </h1>

        {subtitle && (
          <p
            className="font-display font-light text-paper/70 leading-tight tracking-[-0.025em] mt-5 md:mt-7 max-w-[56ch] text-balance"
            style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2.6rem)' }}
          >
            {subtitle}
          </p>
        )}

        {/* 'pretty' evita que la última línea se quede con una sola palabra.
            Centrado se nota el doble: «tomar.» solo, debajo de una línea
            llena, parece un error de maquetación. */}
        <p
          className="font-sans text-paper/55 leading-relaxed mt-6 md:mt-8 max-w-[92ch] text-pretty text-cuerpo"
        >
          {excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-7 md:mt-9">
          {project.services.map(s => (
            <span
              key={s}
              className="font-mono text-paper/65 text-[12px] md:text-[14px] uppercase tracking-[0.2em] border border-paper/15 px-3 py-1.5"
            >
              {s}
            </span>
          ))}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-accent text-[12px] md:text-[14px] uppercase tracking-[0.2em] border border-accent/40 px-3 py-1.5 hover:border-accent transition-colors duration-200"
            >
              {t('verSitio')}
            </a>
          )}
        </div>
      </section>

      {/*
        * ── 2. La apertura ──────────────────────────────────────────────────
        *
        * A pantalla completa y con un acercamiento al bajar. Iba en un 16/9
        * con márgenes y esquinas redondeadas, de modo que la primera imagen
        * del caso —la que tiene que agarrar— entraba como una tarjeta más.
        *
        * El zoom lo mueve el navegador contra el recorrido del elemento por
        * la ventana, sin una línea de JavaScript. Donde no se admite, la
        * imagen se queda quieta y llena igual.
        */}
      <section
        className="apertura-seccion relative z-10 bg-ink gutter-x pb-14 md:pb-20"
        style={{ viewTimelineName: '--apertura' }}
      >
        <div
          className="apertura relative overflow-hidden rounded-pieza w-full"
          style={{ aspectRatio: '16/9' }}
          data-parallax="cover"
        >
          {project.heroMedia ? (
            <video
              src={project.heroMedia}
              autoPlay muted loop playsInline
              aria-label={`${project.title} — apertura del caso`}
              className="acerca w-full h-full object-cover"
            />
          ) : apertura ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={apertura}
              alt={project.title}
              className="acerca w-full h-full object-cover"
              fetchPriority="high"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full" style={{ background: bg }} />
          )}
        </div>
      </section>

      {/* ── 3. Results bar ─────────────────────────────────────────────────── */}
      {metrics && metrics.length > 0 && (
        <ResultsBar metrics={metrics} />
      )}

      {/* ── 4. Story blocks ────────────────────────────────────────────────── */}
      {story.length > 0 && (
        <div className="bg-ink">
          {enCapitulos(story, marcaDe(story, project.colorMarca)).map(cap => (
            <div key={cap.desde} style={cap.tono} className="bg-ink">
              {cap.bloques.map((block, i) => (
                <StoryBlockRenderer
                  key={block._key}
                  block={block}
                  index={cap.desde + i}
                  bg={bg}
                  feedbackLabel={t('feedbackLabel')}
                  title={project.title}
                  claro={tonoClaro(cap.tono)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── 5. Next project ────────────────────────────────────────────────── */}
      {project.nextProject && (
        <NextProjectSection
          next={project.nextProject}
          nextLabel={t('siguienteLabel')}
          backLabel={t('volver')}
        />
      )}

      {/* ── 6. CTA final ───────────────────────────────────────────────────── */}
      <CtaSection
        label={ctaData.label}
        heading={ctaData.heading}
        ctaBtn={t('cotiza')}
        moreBtn={t('verMas')}
      />

      {/* Room for the floating bar, so it never sits on top of the last line
          of the page it is navigating. */}
      <div aria-hidden className="h-20 bg-ink md:h-24" />

      {/* Vive aquí y no en una página concreta: esta vista la comparten los
          seis casos y el modal, así que todos entran igual. */}
      <ProjectMotion />

    </main>
    </>
  )
}
