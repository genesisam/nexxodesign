// ─── Portable Text ────────────────────────────────────────────────────────────
// Shape mirrors what *[_type=="project"][0]{ ... } returns after GROQ flattening.

export type PTMarkDef = {
  _type: string
  _key:  string
  href?: string
}

export type PTSpan = {
  _type:  'span'
  _key:   string
  text:   string
  marks?: string[]
}

export type PTBlock = {
  _type:     'block'
  _key:      string
  style:     'normal' | 'h2' | 'h3' | 'h4' | 'blockquote'
  children:  PTSpan[]
  markDefs?: PTMarkDef[]
  listItem?: 'bullet' | 'number'
  level?:    number
}

export type PTImage = {
  _type:      'image'
  _key:       string
  url:        string | null
  alt?:       string
  caption?:   string
  fullBleed?: boolean
}

export type PTContent = PTBlock | PTImage

// ─── Story blocks (Cuberto block model) ───────────────────────────────────────

export type OverviewBlock = {
  _type:    'overview'
  _key:     string
  label?:   string
  heading?: string
  body:     PTContent[]
  link?:    { label: string; href: string }
}

export type SectionHeaderBlock = {
  _type:    'sectionHeader'
  _key:     string
  heading:  string
  divider?: boolean
}

export type MediaBlock = {
  _type:     'media'
  _key:      string
  mediaType: 'image' | 'video'
  url:       string | null
  caption?:  string
  /** `bleed` va de borde a borde, sin márgenes ni esquinas redondeadas: es la
   *  pieza que separa un capítulo del siguiente. */
  size?:     'sm' | 'lg' | 'bleed'
  /** A quién pertenece la pieza, cuando no es nuestra. La fotografía de
   *  producto y el vídeo de campaña son del cliente; el diseño y el
   *  desarrollo, nuestros. Se dice. */
  credito?:  string
  /** La proporción real del archivo. Ver la nota en `SplitItem.ratio`: el
   *  hueco fijo de 16/9 le cortaba la cabeza a la modelo en la portada de
   *  Maison, que es una composición de 2078×1590. */
  ratio?:    number
}

export type SplitItem = {
  _key:      string
  mediaType: 'image' | 'video'
  url:       string | null
  /**
   * El hueco, cuando no se sabe cuánto mide la pieza: `sm` cuadrado, `ms`
   * retrato. Es una aproximación, y se nota — ver `ratio`.
   */
  size:      'sm' | 'ms'
  /**
   * La proporción real del archivo (ancho ÷ alto).
   *
   * Sin esto el hueco solo podía ser cuadrado o retrato, y la pieza se
   * recortaba para encajar: a la grabación de la home móvil le cortaba la
   * cabeza y a la de la ficha le quitaba la columna derecha. Las imágenes la
   * traen de los metadatos del asset; los vídeos la llevan escrita en el
   * documento, porque Sanity no mide los archivos de vídeo.
   */
  ratio?:    number
  caption?:  string
}

/**
 * Cómo se reparte un bloque de piezas.
 *
 * Medido sobre la referencia de Cakao: su caso alterna secciones de 900 px con
 * otras de 8.000, rejillas de cuatro, parejas a media página y galerías más
 * anchas que la ventana. Nuestros casos usaban casi siempre lo mismo —dos
 * columnas desfasadas— y por eso se leían monótonos.
 *
 *   pair   dos columnas desfasadas (lo de siempre; bien para pares escritorio/móvil)
 *   strip2 dos piezas a la misma altura, sin desfase
 *   grid4  rejilla de cuatro: iconos, aplicaciones, detalles de interfaz
 *   bleed  una pieza a todo el ancho, sin márgenes laterales
 */
export type SplitLayout = 'pair' | 'strip2' | 'grid4' | 'bleed'

export type SplitShowBlock = {
  _type:   'splitShow'
  _key:    string
  layout?: SplitLayout
  items:   SplitItem[]
}

export type QuoteBlock = {
  _type: 'quote'
  _key:  string
  text:  string
}

export type FeedbackBlock = {
  _type:    'feedback'
  _key:     string
  quote:    string
  name:     string
  role:     string
  company?: string
  link?:    { label: string; href: string }
}

/**
 * La paleta del proyecto, dibujada por el propio sitio.
 *
 * Va como datos y no como imagen a propósito: un PNG de muestras envejece mal,
 * pesa, no se puede copiar y en un lector de pantalla no dice nada. Así los
 * valores son texto seleccionable y el color lo pinta el navegador.
 */
export type PaletteBlock = {
  _type:    'palette'
  _key:     string
  label?:   string
  heading?: string
  note?:    string
  /** `textura` es una fotografía macro del material —papel, tinta, tela— que
   *  aparece al pasar por encima de la muestra. El color sigue siendo el
   *  dato; la textura solo dice de qué está hecho. */
  colors:   { _key: string; name: string; hex: string; note?: string; textura?: string | null }[]
}

/**
 * El espécimen tipográfico.
 *
 * `family` es la pila CSS con la que se dibuja la muestra. Cuando la fuente
 * real no se puede servir, `substitute` lo dice en la propia lámina en vez de
 * enseñar otra letra haciéndola pasar por la del proyecto.
 */
export type TypographyBlock = {
  _type:    'typography'
  _key:     string
  label?:   string
  heading?: string
  note?:    string
  /** Tres frases para la escalera de tamaños, de 64 a 18 px. Si faltan, se usa
   *  un texto neutro: poner aquí el copy de otro proyecto fue justo el error. */
  muestra?: [string, string, string]
  faces: {
    _key:        string
    role:        string          // «Títulos», «Texto»
    name:        string          // cómo se llama la fuente
    family?:     string          // pila CSS para dibujar la muestra
    webfont?:    string          // hoja de estilo que sirve la fuente, si la hay
    source?:     string          // fundición o autor
    year?:       string
    note?:       string
    substitute?: boolean         // true si la muestra NO va en la fuente real
  }[]
}

/**
 * Una sección de solo texto, a página entera.
 *
 * Es el recurso que sostiene la referencia de Cakao: entre galería y galería,
 * cuatro secciones seguidas de altura idéntica sin una sola imagen, cada una
 * con un rótulo pequeño y una palabra enorme. Da respiro y marca el pulso del
 * caso, que es lo que a los nuestros les faltaba.
 *
 * `fondo` acepta un color de la propia marca del proyecto: así la sección
 * también enseña la paleta, sin dibujarla.
 */
export type StatementBlock = {
  _type:  'statement'
  _key:   string
  label?: string        // «Valor central»
  lead:   string        // la palabra grande
  body?:  string        // la frase que la sostiene
  fondo?: string        // #RRGGBB; si falta, el ink del sitio
}

/**
 * El logotipo, en sus dos estados.
 *
 * A la izquierda sobre el color de la marca; a la derecha en blanco sobre
 * fotografía. Es la prueba de que el logo aguanta los dos sitios, y se cuenta
 * en dos paneles sin una línea de explicación — como en la referencia.
 *
 * El archivo es el logo real del cliente, en negro sobre transparente. El
 * color se le da con un filtro, de modo que no hay dos versiones que
 * mantener.
 */
export type LogoBlock = {
  _type:    'logo'
  _key:     string
  label?:   string
  heading?: string
  note?:    string
  src:      string | null   // PNG o SVG del logotipo, en negro sobre transparente
  fondo?:   string          // #RRGGBB del panel izquierdo
  foto?:    string | null   // la fotografía del panel derecho
  /** Cierto cuando la fotografía es oscura y el logo va en blanco encima.
   *  Por defecto va en tinta: la fotografía de moda suele ser de fondo
   *  claro, y el blanco sobre blanco no se lee. */
  fotoOscura?: boolean
  /** Fuerza el logotipo en blanco sobre el panel de color, por encima de lo
   *  que diga el cálculo de legibilidad. */
  logoBlanco?: boolean
  /** El pie que nombra la pareja de color, como «Terracota sobre papel». */
  pie?:     string
  credito?: string
}

/**
 * Un escenario: un fondo y hasta tres aparatos encima, en capas.
 *
 * Antes esto era una sola imagen plana con los teléfonos ya colocados. En
 * capas, el central puede estar solo al llegar la sección y los dos laterales
 * salir de detrás al bajar, que es lo que cuenta la escena: una herramienta,
 * y luego el resto del sistema.
 */
export type EscenarioBlock = {
  _type:   'escenario'
  _key:    string
  fondo:   string | null
  /** El aparato que manda, al frente y en el centro. */
  centro:  string | null
  /** Los dos que salen de detrás. Si faltan, queda el central solo. */
  izq?:    string | null
  der?:    string | null
  alt?:    string
  credito?: string
  /** `escritorio` dibuja los aparatos más anchos y más bajos. */
  forma?:  'movil' | 'escritorio'
}

export type StoryBlock =
  | OverviewBlock
  | SectionHeaderBlock
  | MediaBlock
  | SplitShowBlock
  | QuoteBlock
  | FeedbackBlock
  | PaletteBlock
  | TypographyBlock
  | StatementBlock
  | LogoBlock
  | EscenarioBlock

// ─── Project metadata ─────────────────────────────────────────────────────────

export type Metric = {
  _key:  string
  label: string
  value: string
}

export type ProjectPreview = {
  title:    string
  slug:     { current: string }
  cover:    string | null
  vertical: string
}

// ─── Project (matches GROQ projection) ───────────────────────────────────────

export type Project = {
  _id:          string
  title:        string
  subtitle?:    string
  slug:         { current: string }
  client:       string
  year:         number
  timeline?:    string
  services:     string[]
  vertical:     string
  cover:        string | null
  heroMedia?:   string | null
  metric:       string | null
  metrics?:     Metric[]
  excerpt:      string
  liveUrl?:     string | null
  /**
   * El color de la marca del cliente, para el capítulo de cierre.
   *
   * Normalmente se saca de la lámina de paleta del propio caso. Los casos que
   * no la tienen lo llevan aquí, medido sobre sus propias pantallas y no
   * elegido a ojo.
   */
  colorMarca?:  string | null
  story:        StoryBlock[]
  nextProject?: ProjectPreview | null
  /**
   * Fuera del sitio, pero no del repositorio.
   *
   * Un caso marcado así no se lista, no se pre-renderiza, no entra en el
   * sitemap y su URL responde 404: está despublicado en el sentido literal.
   * El contenido se queda escrito para cuando se retome, que es la diferencia
   * entre despublicar y borrar.
   */
  unlisted?:    boolean
}
