import type { Product, ProductFaqItem, ProductFeature } from '@/types/product'

/**
 * The real catalogue: Alexander's Framer Marketplace listings (@uixengine),
 * with covers downloaded into public/images/store as WebP.
 *
 * Every fact here — what a component does, what it needs, what it does not
 * include — comes from his own listing text, written out in Spanish. Nothing is
 * invented: the store repeats what the marketplace already promises, because a
 * claim that only exists on this site is a claim he would have to honour
 * without having made it.
 *
 * The caveats are deliberate. Bocadito needing a paid Framer plan, a Shopify
 * store and the Commerce Connect plugin belongs on the page, not in a refund
 * conversation afterwards.
 *
 * `licenses` is empty: Framer sells each listing at a single price, so the page
 * shows that price and one button. Adding a tier with a `lemonCheckoutUrl` is
 * what turns that button into a real checkout later.
 */

const COMPONENT = 'https://www.framer.com/marketplace/components'
const TEMPLATE  = 'https://www.framer.com/marketplace/templates'

let blockId = 0
const p = (text: string) => ({
  _type:    'block' as const,
  _key:     `b${blockId++}`,
  style:    'normal' as const,
  markDefs: [],
  children: [{ _type: 'span' as const, _key: `s${blockId}`, marks: [], text }],
})

const f = (title: string, description: string): ProductFeature =>
  ({ _key: `f${blockId++}`, title, description, isPro: false })

const q = (question: string, answer: string): ProductFaqItem =>
  ({ _key: `q${blockId++}`, question, answer })

type Entry = {
  slug:     string
  title:    string
  tagline:  string
  price:    number
  type:     'component' | 'template'
  order:    number
  featured?: boolean
  compatibility: string[]
  keywords: string[]
  description: string[]
  features:  ProductFeature[]
  includes:  string[]
  faq:       ProductFaqItem[]
}

const ENTRIES: Entry[] = [
  {
    slug: 'product-reviews', title: 'Product Reviews', price: 19, type: 'component', order: 1, featured: true,
    tagline: 'Reseñas con moderación para tu tienda en Framer, con los datos en tu propio Supabase.',
    compatibility: ['Framer', 'Framer Commerce', 'Supabase'],
    keywords: ['reseñas para Framer', 'componente de reseñas Framer', 'valoraciones con Supabase', 'reviews ecommerce Framer', 'estrellas de calificación Framer'],
    description: [
      'Reseñas reales en tu tienda de Framer sin pagar una app todos los meses. El cliente escribe desde la página de producto, tú apruebas, y la calificación queda sincronizada en todos lados: la sección de reseñas, el distintivo de estrellas junto al precio y los datos estructurados que lee Google.',
      'Los datos viven en tu propio proyecto de Supabase, que es gratis para empezar. No hay SDK ni paquetes de npm: el componente habla directo con tu base de datos, así que las reseñas son tuyas y sobreviven a cualquier rediseño del sitio.',
      'Al soltarlo en el lienzo muestra datos de ejemplo, así que puedes diseñar con él antes de conectar nada. La conexión toma unos diez minutos con el SQL y la guía que vienen incluidos.',
    ],
    features: [
      f('Dos componentes en uno', 'ProductReviews para la sección completa y ReviewsBadge para el "4.7 (128)" que va junto al título o al precio y lleva a las reseñas.'),
      f('Moderación que no depende de la confianza', 'Cada reseña entra como pendiente y solo se publica cuando la apruebas. La regla vive en la base de datos, no solo en el componente.'),
      f('Antispam incorporado', 'Campo trampa, control de tiempo y límite diario. Los correos de quien reseña nunca son públicos.'),
      f('Filtros y orden de verdad', 'Barras de calificación en las que se puede hacer clic para filtrar por estrellas, menú de orden, paginación con contador y porcentaje de "lo recomendaría".'),
      f('Se adapta a tu marca', 'Estilo en tarjetas o en líneas, estrellas redondeadas o rectas, cualquier color y tipografía, textos traducibles y fechas y números según el idioma.'),
    ],
    includes: ['Script SQL listo para pegar en Supabase', 'Guía paso a paso en español e inglés', 'Datos de ejemplo para diseñar antes de conectar', 'Instalación hecha por mí, opcional'],
    faq: [
      q('¿Tengo que pagar una suscripción mensual?', 'No. El componente es un pago único y los datos viven en tu propio proyecto de Supabase, que tiene un plan gratuito suficiente para la mayoría de tiendas.'),
      q('¿Puede alguien publicar una reseña ofensiva sin que yo la vea?', 'No. Toda reseña entra como pendiente y solo aparece cuando la apruebas. Esa regla está impuesta por la base de datos, así que no depende de una validación del navegador.'),
      q('¿Cuánto toma conectarlo?', 'Unos diez minutos. Creas el proyecto en Supabase, pegas el SQL que viene incluido y copias dos claves en el panel de Framer.'),
      q('¿Las reseñas ayudan al SEO?', 'Sí. El componente escribe los datos estructurados de calificación que Google usa para mostrar estrellas en los resultados de búsqueda.'),
    ],
  },

  {
    slug: 'booking-widget', title: 'Booking Widget', price: 12, type: 'component', order: 2,
    tagline: 'Flujo de reservas paso a paso para servicios, listo para personalizar sin código.',
    compatibility: ['Framer'],
    keywords: ['widget de reservas Framer', 'agendar citas en Framer', 'booking para barbería', 'componente de citas Framer', 'reservas para peluquería'],
    description: [
      'Un flujo de reservas completo para cualquier sitio hecho en Framer, sin construir la interfaz desde cero. El visitante elige servicio y profesional, escoge fecha y hora, deja sus datos y ve la confirmación.',
      'Está pensado para negocios que viven de agendar: barberías, salones, clínicas, consultorios, centros de bienestar y agencias. Todo el contenido, los colores y las etiquetas se cambian desde el panel de propiedades de Framer.',
    ],
    features: [
      f('Flujo de varios pasos', 'Servicio, profesional, fecha y hora, datos del cliente y confirmación, en una secuencia que se entiende sola.'),
      f('Textos y colores editables', 'Cada etiqueta y cada color se cambia desde el panel de Framer, sin tocar código.'),
      f('Escritorio y móvil', 'La misma pieza se reacomoda para pantallas pequeñas sin perder pasos por el camino.'),
    ],
    includes: ['Remix link del componente', 'Controles de propiedades para todo el contenido'],
    faq: [
      q('¿Guarda las reservas o envía correos?', 'No por sí solo. Es la interfaz de reserva, completamente configurable. Conectarla a una base de datos, a un calendario, a correos o a pagos requiere una integración aparte según lo que uses.'),
      q('¿Sirve para mi negocio?', 'Si cobras por citas o servicios, sí. Está construido pensando en barberías, salones, clínicas, consultores y agencias, y los servicios y profesionales se escriben desde el panel.'),
    ],
  },

  {
    slug: 'leadqualificationpro', title: 'LeadQualificationPro', price: 16, type: 'component', order: 3,
    tagline: 'Asistente de calificación de leads con puntaje, subida de archivos y ruteo a Calendly.',
    compatibility: ['Framer', 'Calendly', 'Cloudinary'],
    keywords: ['calificación de leads Framer', 'formulario multipaso Framer', 'lead scoring', 'wizard de contacto Framer', 'filtrar prospectos agencia'],
    description: [
      'Un asistente de seis pasos que reemplaza al formulario de contacto: cinco preguntas y una subida de archivo opcional, con un panel oscuro a la izquierda que marca el avance y el contenido a la derecha.',
      'Cada respuesta suma puntos. Si el prospecto pasa el umbral que tú defines, ve el botón para agendar en Calendly; si no lo pasa, recibe un PDF o guía en su lugar. Así la agenda se llena con quien de verdad encaja.',
      'Por debajo de 560 píxeles se reacomoda en vertical, y todo —preguntas, opciones, puntajes, colores, tipografía y enlaces— se edita desde el panel de propiedades.',
    ],
    features: [
      f('Puntaje con umbral configurable', 'Tú decides cuántos puntos vale cada respuesta y a partir de cuántos un lead está calificado.'),
      f('Dos salidas distintas', 'Calificado va a tu enlace de Calendly; no calificado recibe el imán de leads que tú definas.'),
      f('Subida de archivos', 'Arrastrar y soltar con barra de progreso, a través de Cloudinary, con tamaño y formatos permitidos configurables.'),
      f('Estética editorial', 'Sin glassmorphism: paneles sólidos, retícula de opciones 2×2 y relleno sólido al seleccionar.'),
    ],
    includes: ['Remix link del componente', 'Controles para preguntas, puntajes y enlaces'],
    faq: [
      q('¿Necesito cuenta de Cloudinary?', 'Solo si vas a usar la subida de archivos. Es gratuita para este volumen y se configura con el nombre de tu cuenta y un preset de subida.'),
      q('¿Puedo cambiar las preguntas?', 'Sí, todas: encabezados, subtítulos, etiquetas de cada opción, emojis y los puntos que suma cada respuesta.'),
    ],
  },

  {
    slug: 'techspecsviewer', title: 'TechSpecsViewer', price: 20, type: 'component', order: 4, featured: true,
    tagline: 'Ficha técnica interactiva: pestañas, fotos de detalle y variantes de color en un solo panel.',
    compatibility: ['Framer'],
    keywords: ['ficha técnica Framer', 'especificaciones de producto Framer', 'componente hardware Framer', 'tabla de specs interactiva', 'página de producto tecnológico'],
    description: [
      'Un visor de especificaciones para páginas de producto: títulos, deslizador horizontal y datos técnicos dentro de un panel ordenado y simétrico. Al cambiar de pestaña, la imagen salta al detalle de esa pieza; al tocar una muestra de color, cambia la galería principal.',
      'En móvil se convierte en paneles de acordeón ligeros, con indicadores animados, en lugar de dejar que una tabla ancha rompa la pantalla.',
      'Funciona bien donde hay datos duros que mostrar: hardware, electrónica, automotriz, diseño industrial o cualquier producto con una matriz técnica que explicar.',
    ],
    features: [
      f('Pestañas sincronizadas con la imagen', 'Cada pestaña proyecta la macro del componente que describe; las muestras de color actualizan la galería.'),
      f('Deslizador horizontal continuo', 'La navegación no se parte en dos filas ni rompe el diseño en pantallas largas.'),
      f('Acordeón en móvil', 'La misma información, reorganizada para el pulgar, con indicadores animados.'),
      f('Sin tocar código', 'Textos, colores y tipografías desde el panel de Framer; las características se separan con una barra vertical.'),
    ],
    includes: ['Remix link del componente', 'Controles nativos de propiedades para todo el contenido'],
    faq: [
      q('¿Cuántas pestañas y especificaciones admite?', 'Las que necesites: se agregan desde el panel y las características de cada una se separan con el carácter "|".'),
      q('¿Afecta el rendimiento de la página?', 'No. Está construido como un componente de React nativo para Framer, sin librerías externas que cargar.'),
    ],
  },

  {
    slug: 'featuretabs', title: 'FeatureTabs', price: 10, type: 'component', order: 5,
    tagline: 'Acordeón horizontal en escritorio y tarjetas verticales en móvil, con animaciones de resorte.',
    compatibility: ['Framer'],
    keywords: ['acordeón Framer', 'tabs de características Framer', 'sección de beneficios SaaS', 'componente interactivo Framer', 'features landing page'],
    description: [
      'El bloque de características que toda landing termina necesitando. En escritorio funciona como un acordeón horizontal que se expande; en móvil se convierte solo en tarjetas verticales fáciles de recorrer.',
      'Las transiciones usan física de resorte, así que el cambio entre pestañas se siente suave en lugar de brusco. Cada pestaña admite su propia imagen y su propio ícono en SVG, pegado desde el panel.',
      'Encaja en landings de SaaS, portafolios de agencia y cualquier página que tenga que mostrar información densa sin abrumar.',
    ],
    features: [
      f('Dos comportamientos, un componente', 'Acordeón horizontal en escritorio, tarjetas verticales en móvil, sin configurar nada aparte.'),
      f('Íconos y medios propios', 'Imagen por pestaña y código SVG personalizado para cada ícono, desde el panel de propiedades.'),
      f('Botón de acción lateral', 'Un botón "y más" para enviar a la página de precios o al detalle completo.'),
      f('Control total del estilo', 'Espaciado, radio de las esquinas y colores en estado normal, al pasar el cursor y activo.'),
    ],
    includes: ['Remix link del componente', 'Controles de propiedades para estilo y contenido'],
    faq: [
      q('¿Puedo usar mis propios íconos?', 'Sí. Puedes pegar el código SVG de cada ícono directamente en el panel, sin editar el componente.'),
      q('¿Cómo se ve en móvil?', 'El acordeón horizontal se transforma en una lista vertical de tarjetas, pensada para recorrer con el pulgar.'),
    ],
  },

  {
    slug: 'odysseyreserve', title: 'OdysseyReserve', price: 29, type: 'component', order: 6, featured: true,
    tagline: 'Modal de reserva con calendario propio y cálculo automático de noches y total.',
    compatibility: ['Framer'],
    keywords: ['modal de reserva Framer', 'calendario para Framer', 'booking hotel boutique', 'alquiler de lujo reservas', 'componente de reservas premium'],
    description: [
      'Un flujo de reserva completo dentro de un modal, con un calendario propio en lugar del selector de fechas del navegador, que nunca combina con el diseño.',
      'Hace las cuentas solo: calcula las noches según las fechas elegidas y el total según el tipo de alojamiento o servicio seleccionado. Tamaños de tipografía, colores, nombres y precios se controlan por separado para escritorio, tablet y móvil.',
      'Está pensado para alquileres de lujo, hotelería boutique y servicios de ticket alto, donde una experiencia de reserva pobre cuesta una reserva real.',
    ],
    features: [
      f('Calendario propio', 'Diseñado dentro del componente, no el selector nativo del navegador.'),
      f('Cálculo automático', 'Noches y total, según las fechas y el nivel de alojamiento elegido.'),
      f('Tipografía por dispositivo', 'Tamaños independientes en escritorio, tablet y móvil, desde el panel.'),
      f('Animaciones fluidas', 'Entradas suaves, estados al pasar el cursor y cierre automático bien resuelto.'),
    ],
    includes: ['Remix link del componente', 'Controles de precios, nombres y estilos'],
    faq: [
      q('¿Procesa pagos?', 'No. Es el flujo de reserva y el cálculo del total; cobrar requiere conectar tu pasarela o tu sistema de reservas aparte.'),
      q('¿Sirve para alquileres por noche?', 'Sí, es justo su caso: calcula las noches entre las dos fechas y multiplica por la tarifa del nivel elegido.'),
    ],
  },

  {
    slug: 'splitwipe', title: 'SplitWipe', price: 8, type: 'component', order: 7,
    tagline: 'Galería que se abre en dos mitades con el scroll y revela el siguiente proyecto.',
    compatibility: ['Framer'],
    keywords: ['galería scroll Framer', 'animación de transición Framer', 'portafolio de proyectos Framer', 'efecto split scroll', 'showcase para agencias'],
    description: [
      'Una galería pensada para mostrar proyectos: al hacer scroll, la lámina actual se abre por la mitad y deja ver la siguiente, con un movimiento continuo y cinematográfico.',
      'Las animaciones se recortan por trazado y corren aceleradas por hardware. Con consultas de contenedor pasa de una división vertical al 50 % en escritorio a una pila horizontal en tablet y móvil.',
      'Cada lámina tiene su propio logo central y sus colores de banner y texto, de modo que varias marcas distintas conviven en la misma secuencia.',
    ],
    features: [
      f('Animación guiada por el scroll', 'El avance de la página controla la apertura, sin reproducción automática que compita con la lectura.'),
      f('Respuesta por contenedor', 'Se adapta según el ancho disponible, no solo según el tamaño de la ventana.'),
      f('Personalización por lámina', 'Logo, color de fondo y color de texto distintos en cada proyecto.'),
    ],
    includes: ['Remix link del componente', 'Instrucciones de montaje en el panel'],
    faq: [
      q('¿Cómo se monta?', 'Se suelta en el punto de ruptura de escritorio y se le da alto de ventana (100vh) y ancho completo. Esa es toda la configuración.'),
      q('¿Cuántos proyectos admite?', 'Los que agregues desde el panel; cada uno con su propio logo y sus propios colores.'),
    ],
  },

  {
    slug: 'mokuhero', title: 'MokuHero', price: 5, type: 'component', order: 8,
    tagline: 'Hero con video que se expande al hacer scroll e imágenes flotantes en parallax.',
    compatibility: ['Framer'],
    keywords: ['hero animado Framer', 'video hero Framer', 'parallax scroll Framer', 'portada cinematográfica web', 'hero para hotel boutique'],
    description: [
      'Un hero con retícula asimétrica y un contenedor de medios al centro que se expande suavemente a medida que bajas. Las imágenes flotantes se mueven en parallax alrededor.',
      'Admite video local en mp4 o webm subido desde el propio lienzo de Framer, sin depender de un servicio externo de alojamiento. La tipografía y los espaciados se ajustan por separado en escritorio y en móvil.',
      'En pantallas pequeñas la retícula compleja cede el paso a una composición limpia y legible, en lugar de encogerse hasta volverse ilegible.',
    ],
    features: [
      f('Video sin hosting externo', 'Sube el archivo directamente en Framer; no hace falta un servicio de video aparte.'),
      f('Escala con el scroll', 'El medio central crece y redondea sus esquinas mientras avanza la página.'),
      f('Ligero', 'Escrito en React, sin capas de sobrescritura que frenen la carga.'),
    ],
    includes: ['Remix link del componente', 'Controles de tipografía y espaciado por dispositivo'],
    faq: [
      q('¿Qué formatos de video acepta?', 'mp4 y webm, subidos desde el lienzo de Framer.'),
      q('¿Funciona sin video?', 'Sí. El contenedor central admite imagen si prefieres no usar video.'),
    ],
  },

  {
    slug: 'projectestimator', title: 'ProjectEstimator', price: 9, type: 'component', order: 9,
    tagline: 'Calculadora de presupuesto que filtra consultas antes de que lleguen a tu correo.',
    compatibility: ['Framer'],
    keywords: ['calculadora de presupuesto web', 'cotizador para agencias Framer', 'estimador de proyectos', 'filtrar clientes bajo presupuesto', 'componente bento grid Framer'],
    description: [
      'Cambia el formulario de contacto por una calculadora: el visitante arma su propio proyecto y ve el precio en tiempo real, dentro de una retícula tipo bento con borde de un píxel que no se rompe en ningún tamaño.',
      'El cálculo responde al tipo de proyecto, al número de páginas elegido con un deslizador, al nivel de acabado y a los extras que marque. Al final, el botón redacta un correo a tu dirección con el estimado incluido en el asunto y el cuerpo.',
      'El efecto práctico es un filtro: quien no tiene presupuesto lo descubre antes de escribirte, y las consultas que llegan vienen con una cifra ya aceptada.',
    ],
    features: [
      f('Cálculo en tiempo real', 'Tipo de proyecto, páginas, nivel de acabado y extras, sumados mientras el visitante elige.'),
      f('Correo con el estimado', 'El botón final abre un correo dirigido a ti con la cifra ya escrita.'),
      f('Precios y moneda editables', 'Precio base, costo por página, moneda y todos los textos desde el panel.'),
      f('Bento grid sin huecos', 'La retícula se reacomoda en escritorio, tablet y móvil sin dejar espacios vacíos.'),
    ],
    includes: ['Remix link del componente', 'Controles de precios, moneda y textos'],
    faq: [
      q('¿Puedo poner mis propios precios?', 'Sí. Precio base por tipo de proyecto, costo por página, multiplicadores y extras se editan desde el panel.'),
      q('¿Dónde llegan las solicitudes?', 'Al correo que configures: el botón final abre el cliente de correo del visitante con el estimado ya redactado.'),
    ],
  },

  {
    slug: 'brarsherocarousel', title: 'BrarsHeroCarousel', price: 8, type: 'component', order: 10,
    tagline: 'Carrusel de portada con fondo, producto y botón distintos en cada lámina.',
    compatibility: ['Framer'],
    keywords: ['carrusel Framer', 'hero slider producto', 'slider con autoplay Framer', 'carrusel ecommerce Framer', 'portada rotativa web'],
    description: [
      'Un carrusel de portada donde cada lámina es independiente: su color de fondo, su imagen, su forma decorativa, su texto y su botón con su propio enlace.',
      'El control de tamaño de producto mantiene cada imagen bien encuadrada aunque las proporciones cambien de una a otra, así que nada se monta sobre los títulos ni sobre el botón.',
      'Se puede arrastrar, navegar por puntos y dejar en reproducción automática con el ritmo que elijas.',
    ],
    features: [
      f('Hasta ocho láminas', 'Cada una con fondo, imagen, forma decorativa y llamada a la acción propios.'),
      f('Encuadre por imagen', 'Un porcentaje de tamaño por producto evita que una foto desproporcionada tape el texto.'),
      f('Arrastre, puntos y autoplay', 'Las tres formas de navegar, configurables desde el panel.'),
    ],
    includes: ['Remix link del componente', 'Controles globales de tipografía, radio y opacidad'],
    faq: [
      q('¿Cada lámina puede llevar a una página distinta?', 'Sí. El texto del botón y su enlace se definen lámina por lámina.'),
      q('¿Se puede desactivar el avance automático?', 'Sí, la reproducción automática y su ritmo se controlan desde el panel.'),
    ],
  },

  {
    slug: 'leadqualification', title: 'LeadQualification', price: 9, type: 'component', order: 11,
    tagline: 'Cuestionario de cinco pasos con puntaje que envía a agendar o a descargar una guía.',
    compatibility: ['Framer', 'Calendly'],
    keywords: ['calificar prospectos Framer', 'formulario interactivo Framer', 'wizard de preguntas web', 'lead magnet PDF', 'filtro de clientes consultoría'],
    description: [
      'Cinco preguntas con puntaje en lugar de un formulario estático. Cada respuesta suma, y al final el visitante ve una cosa u otra según el umbral que definas: el enlace para agendar una llamada, o la descarga de una guía en PDF.',
      'El acabado usa un efecto de vidrio líquido con un brillo que sigue al cursor, con transiciones suaves y barras de progreso animadas entre pasos.',
      'Pensado para agencias, SaaS y consultores que prefieren filtrar antes de agendar, en vez de descubrir en la llamada que no había encaje.',
    ],
    features: [
      f('Puntaje por respuesta', 'Asignas los puntos y el umbral que separa a un lead calificado del resto.'),
      f('Dos destinos', 'Calificado va a tu enlace de agenda; el resto recibe el PDF o la guía que elijas.'),
      f('Todo editable', 'Las cinco preguntas, sus descripciones, emojis, textos de botones, puntos y color de acento, desde el panel.'),
    ],
    includes: ['Remix link del componente', 'Controles de preguntas, puntajes y enlaces'],
    faq: [
      q('¿En qué se diferencia de LeadQualificationPro?', 'Esta versión son cinco preguntas con acabado de vidrio líquido. La Pro agrega un sexto paso con subida de archivos, panel lateral con seguimiento de pasos y estética editorial.'),
      q('¿Necesito Calendly?', 'No es obligatorio: el botón de los calificados apunta a la URL que tú quieras, sea Calendly u otra agenda.'),
    ],
  },

  // ── Templates ────────────────────────────────────────────────────────────
  {
    slug: 'lazy-leaf-store', title: 'Lazy Leaf Store', price: 99, type: 'template', order: 12, featured: true,
    tagline: 'Template de ecommerce ilustrado para marcas de CBD, bienestar y estilo de vida.',
    compatibility: ['Framer'],
    keywords: ['template Framer ecommerce', 'plantilla tienda CBD', 'template de bienestar Framer', 'tienda online Framer', 'plantilla con CMS Framer'],
    description: [
      'Una tienda ilustrada y con carácter, para marcas que no quieren parecerse al resto del catálogo. Son diez páginas responsivas: inicio, tienda, producto, blog, artículo, nosotros, contacto, preguntas, políticas y una página de error.',
      'Trae cinco colecciones de CMS ya montadas —productos, categorías, artículos, tiendas y políticas— y la página de producto incluye galería, características, tabla comparativa, historia de marca y reseñas de clientes.',
      'La parte de SEO viene resuelta: un solo H1 por página, metadata en todas, títulos y descripciones alimentados desde el CMS y textos alternativos ligados al contenido.',
    ],
    features: [
      f('Diez páginas listas', 'Inicio, tienda, producto, blog, artículo, nosotros, contacto, preguntas, políticas y 404.'),
      f('Cinco colecciones de CMS', 'Productos, categorías, artículos, tiendas y políticas, ya conectadas.'),
      f('Tienda con filtros', 'Filtrado por categoría en vivo y un carrusel de portada con fondo ilustrado por producto.'),
      f('Marca intercambiable', 'Tokens de color y estilos de texto para cambiar la identidad sin rehacer el diseño.'),
      f('SEO ya resuelto', 'Un H1 por página, metadata completa, imágenes sociales desde el CMS y textos alternativos ligados al contenido.'),
    ],
    includes: ['Remix link del proyecto completo', 'Diseños para escritorio, tablet y móvil', 'Componentes reutilizables: botones, tarjetas, pestañas y más', 'Formularios de newsletter y contacto, acordeón de preguntas y localizador de tiendas'],
    faq: [
      q('¿Necesito una cuenta de pago en Framer?', 'Para publicar un sitio con dominio propio, sí: eso lo cobra Framer, no yo.'),
      q('¿Puedo cambiarle la marca?', 'Para eso está pensado: los colores y las tipografías son tokens, así que rehacer la identidad toma minutos, no días.'),
    ],
  },

  {
    slug: 'bocadito', title: 'Bocadito', price: 79, type: 'template', order: 13,
    tagline: 'Tienda de alimento para mascotas en Framer, funcionando sobre un Shopify real.',
    compatibility: ['Framer', 'Shopify', 'Commerce Connect'],
    keywords: ['template Framer Shopify', 'tienda de mascotas plantilla', 'Framer ecommerce template', 'plantilla pet food', 'Commerce Connect Framer'],
    description: [
      'Una tienda de alimento para mascotas construida en Framer y conectada a una tienda real de Shopify. Recibes el remix del proyecto completo: diez páginas y diez colecciones de CMS ya llenas, con diseño para escritorio, tablet y móvil.',
      'Al hacer el remix llega conectada a la tienda de demostración, así que se ve terminada desde el primer segundo. Cuando pones tu token de Shopify en el plugin, tus productos reemplazan a los de ejemplo.',
      'Es un escaparate, no un sitio independiente: los productos, el carrito y el pago vienen de Shopify a través del plugin.',
    ],
    features: [
      f('Diez páginas y diez colecciones', 'El proyecto completo, listo para editar y publicar bajo tu marca.'),
      f('Conectada desde el primer momento', 'Llega enlazada a la tienda de demostración y cambia a la tuya con un token.'),
      f('Tres tamaños de pantalla', 'Escritorio, tablet y teléfono, ya diagramados.'),
    ],
    includes: ['Remix link del proyecto completo', 'Diez páginas responsivas', 'Diez colecciones de CMS con contenido'],
    faq: [
      q('¿Qué necesito además del template?', 'Tres cosas que no van incluidas en el precio: una cuenta de Framer de pago para publicar, una tienda de Shopify (la cobra Shopify) y el plugin Commerce Connect, gratis mientras publiques en un dominio .framer.website. Usarlo en tu propio dominio requiere una licencia de Commerce Connect, que se vende aparte.'),
      q('¿Puedo quedarme con las fotos y la marca del demo?', 'No. Las fotografías, el nombre Bocadito y su logo son solo para la vista previa y no están licenciados para revender. Hay que reemplazarlos por los de tu marca.'),
      q('¿Hay reembolsos?', 'Al ser un producto digital que se entrega al instante como remix link, todas las ventas son finales. Pregúntame lo que quieras antes de comprar: respondo.'),
    ],
  },

  {
    slug: 'xignia-design', title: 'Xignia Design', price: 0, type: 'template', order: 14,
    tagline: 'Template gratuito para agencias de diseño y estudios creativos, con CMS y SEO listos.',
    compatibility: ['Framer'],
    keywords: ['template gratis Framer', 'plantilla para agencia de diseño', 'portafolio Framer gratis', 'template estudio creativo', 'plantilla freelance diseño'],
    description: [
      'Un template para agencias de diseño, estudios creativos, freelancers y negocios digitales que necesitan un sitio profesional publicado hoy.',
      'Trae el CMS montado con colecciones dinámicas de proyectos y blog, componentes reutilizables, estilos globales de color y texto, y formularios de contacto listos para usar. La estructura de SEO viene optimizada y el contenido se edita sin tocar el diseño.',
      'Es gratuito: se consigue como remix desde el marketplace de Framer.',
    ],
    features: [
      f('CMS con proyectos y blog', 'Colecciones dinámicas ya conectadas a sus páginas.'),
      f('Estilos globales', 'Color y tipografía centralizados, para cambiar la marca sin rehacer páginas.'),
      f('Formularios listos', 'Contacto funcionando desde el primer momento.'),
      f('Estructura pensada para buscadores', 'Jerarquía y metadata ordenadas desde el inicio.'),
    ],
    includes: ['Remix gratuito del proyecto', 'Componentes reutilizables', 'Colecciones de CMS para proyectos y blog'],
    faq: [
      q('¿De verdad es gratis?', 'Sí. Se obtiene como remix gratuito desde el marketplace de Framer. Publicar con dominio propio requiere un plan de pago de Framer, que cobra Framer.'),
      q('¿Para quién es?', 'Agencias de diseño y branding, estudios creativos, diseñadores de UI/UX y producto, freelancers y startups que necesitan presencia profesional rápido.'),
    ],
  },

  {
    slug: 'volta-studio', title: 'Volta Studio', price: 0, type: 'template', order: 15,
    tagline: 'Template gratuito, oscuro y orientado a conversión para startups de agentes de IA.',
    compatibility: ['Framer'],
    keywords: ['template SaaS gratis Framer', 'plantilla para startup de IA', 'template agentes de IA', 'landing SaaS oscura', 'plantilla devtools Framer'],
    description: [
      'Un template oscuro y pensado para convertir, hecho para startups de agentes de IA y automatización. El recorrido está completo: portada, beneficios, cómo funciona, analítica, testimonios, precios, preguntas, llamada a la acción y una página de error propia.',
      'Las secciones están listas para CMS y construidas sobre estilos y tokens compartidos, así que adaptarlo a tu producto es cuestión de cambiar valores, no de rehacer pantallas.',
      'Es gratuito: se consigue como remix desde el marketplace de Framer.',
    ],
    features: [
      f('Recorrido completo', 'De la portada al cierre, con todas las secciones que una landing de SaaS necesita.'),
      f('Secciones listas para CMS', 'Contenido editable sin tocar la maqueta.'),
      f('Tokens compartidos', 'Cambiar colores y tipografías actualiza todo el sitio a la vez.'),
    ],
    includes: ['Remix gratuito del proyecto', 'Página 404 propia', 'Diseños para escritorio, tablet y móvil'],
    faq: [
      q('¿De verdad es gratis?', 'Sí, es un remix gratuito del marketplace de Framer. Publicar con dominio propio requiere un plan de pago de Framer.'),
      q('¿Para qué tipo de producto sirve?', 'Para SaaS de IA, herramientas para desarrolladores y plataformas de automatización.'),
    ],
  },
]

export const MOCK_PRODUCTS: Product[] = ENTRIES.map(e => ({
  _id:            `product-${e.slug}`,
  title:          e.title,
  slug:           { current: e.slug },
  type:           e.type,
  status:         'available',
  tagline:        e.tagline,
  cover:          `/images/store/${e.slug}.webp`,
  demoVideoUrl:   null,
  muxPlaybackId:  null,
  price:          e.price,
  compatibility:  e.compatibility,
  keywords:       e.keywords,
  badge:          null,
  featured:       e.featured ?? false,
  order:          e.order,
  fallbackBuyUrl: `${e.type === 'component' ? COMPONENT : TEMPLATE}/${e.slug}/`,
  licenses:       [],

  description:    e.description.map(p),
  gallery:        [],
  demoUrl:        null,
  // A free listing is its own free version; the button already says so.
  freeVersionUrl: null,
  features:       e.features,
  freeVsPro:      [],
  includes:       e.includes,
  faq:            e.faq,
  changelog:      [],
  bundleItems:    [],
}))
