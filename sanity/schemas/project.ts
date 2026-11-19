import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Story blocks, shared by the ES and EN narratives so the two can never drift
 * apart structurally.
 */
const storyBlocks = [
  // overview — label left / PT body right
  defineArrayMember({
    type: 'object', name: 'overview', title: 'Overview',
    fields: [
      defineField({ name: 'label',   title: 'Etiqueta (izq)',   type: 'string' }),
      defineField({ name: 'heading', title: 'Subtítulo (izq)',  type: 'string' }),
      defineField({
        name: 'body', title: 'Contenido', type: 'array',
        of: [
          { type: 'block' },
          { type: 'image', fields: [
            defineField({ name: 'alt',       type: 'string', title: 'Alt' }),
            defineField({ name: 'caption',   type: 'string', title: 'Caption' }),
            defineField({ name: 'fullBleed', type: 'boolean', title: 'Full-bleed', initialValue: false }),
          ]},
        ],
      }),
      defineField({
        name: 'link', title: 'Link opcional', type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Texto', type: 'string' }),
          defineField({ name: 'href',  title: 'URL',   type: 'url'    }),
        ],
      }),
    ],
    preview: { select: { title: 'label', subtitle: 'heading' } },
  }),
  // sectionHeader — large heading + optional divider line
  defineArrayMember({
    type: 'object', name: 'sectionHeader', title: 'Section header',
    fields: [
      defineField({ name: 'heading', title: 'Título sección', type: 'string', validation: R => R.required() }),
      defineField({ name: 'divider', title: 'Línea divisoria', type: 'boolean', initialValue: true }),
    ],
    preview: { select: { title: 'heading' } },
  }),
  // media — single image or video
  defineArrayMember({
    type: 'object', name: 'media', title: 'Media',
    fields: [
      defineField({ name: 'mediaType', title: 'Tipo', type: 'string', options: { list: ['image', 'video'], layout: 'radio' }, initialValue: 'image' }),
      defineField({ name: 'asset',    title: 'Imagen', type: 'image', options: { hotspot: true } }),
      defineField({ name: 'videoUrl', title: 'URL video (mp4/webm)', type: 'url' }),
      defineField({ name: 'caption',  title: 'Caption', type: 'string' }),
      defineField({ name: 'credito',  title: 'Crédito', type: 'string', description: 'Pie sobre la propia pieza. En las piezas a sangre va encima de la imagen.' }),
      defineField({
        name: 'size', title: 'Tamaño', type: 'string', initialValue: 'lg',
        options: { list: [
          { title: 'Pequeño',  value: 'sm' },
          { title: 'Grande',   value: 'lg' },
          { title: 'A sangre', value: 'bleed' },
        ], layout: 'radio' },
        description: 'A sangre ocupa el ancho completo y, en escritorio, el alto de la ventana.',
      }),
      defineField({
        name: 'ratio', title: 'Proporción', type: 'number',
        description: 'Ancho dividido por alto. Las imágenes la traen en sus metadatos y no hace falta escribirla; los vídeos no, porque Sanity no abre esos archivos. Sin ella, una grabación de escritorio se recorta.',
      }),
    ],
    preview: { select: { title: 'caption', subtitle: 'size' } },
  }),
  // splitShow — 2-col asymmetric staggered gallery
  defineArrayMember({
    type: 'object', name: 'splitShow', title: 'Split show',
    fields: [
      defineField({
        name: 'layout', title: 'Reparto', type: 'string',
        options: { list: [
          { title: 'Pareja (dos columnas desfasadas)', value: 'pair' },
          { title: 'Tira de dos',                      value: 'strip2' },
        ] },
        description: 'Vacio deja el ritmo de siempre: dos columnas desfasadas.',
      }),
      defineField({
        name: 'items', title: 'Items', type: 'array',
        of: [{
          type: 'object', name: 'splitItem',
          fields: [
            defineField({ name: 'mediaType', title: 'Tipo', type: 'string', options: { list: ['image', 'video'], layout: 'radio' }, initialValue: 'image' }),
            defineField({ name: 'asset',    title: 'Imagen', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'videoUrl', title: 'URL video', type: 'url' }),
            defineField({ name: 'size',     title: 'Proporción', type: 'string', options: { list: [{ title: 'Cuadrado (sm)', value: 'sm' }, { title: 'Retrato (ms)', value: 'ms' }] }, initialValue: 'ms' }),
            defineField({ name: 'caption',  title: 'Caption', type: 'string' }),
            defineField({ name: 'ratio',    title: 'Proporción real', type: 'number', description: 'Igual que en Media: solo hace falta escribirla en los vídeos.' }),
          ],
          preview: { select: { title: 'caption', subtitle: 'size' } },
        }],
      }),
    ],
    preview: { prepare: () => ({ title: 'Split show' }) },
  }),
  // quote — pull-quote
  defineArrayMember({
    type: 'object', name: 'quote', title: 'Pull-quote',
    fields: [
      defineField({ name: 'text', title: 'Cita', type: 'text', rows: 3, validation: R => R.required() }),
    ],
    preview: { select: { title: 'text' } },
  }),
  // feedback — client testimonial with label/author
  defineArrayMember({
    type: 'object', name: 'feedback', title: 'Feedback del cliente',
    fields: [
      defineField({ name: 'quote',   title: 'Cita',    type: 'text',   rows: 4, validation: R => R.required() }),
      defineField({ name: 'name',    title: 'Nombre',  type: 'string', validation: R => R.required() }),
      defineField({ name: 'role',    title: 'Cargo',   type: 'string' }),
      defineField({ name: 'company', title: 'Empresa', type: 'string' }),
      defineField({
        name: 'link', title: 'CTA opcional', type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Texto', type: 'string' }),
          defineField({ name: 'href',  title: 'URL',   type: 'url'    }),
        ],
      }),
    ],
    preview: { select: { title: 'name', subtitle: 'role' } },
  }),

  /*
   * Los cinco que faltaban.
   *
   * Estos bloques llevaban meses publicados: la vista los pinta y la
   * proyeccion los pide, pero no estaban declarados aqui, asi que el Studio
   * los ensenaba como «campos desconocidos» y nadie podia editar un caso
   * desde ahi sin riesgo de perderlos al guardar. Los nombres y los tipos
   * salen de lo que hay escrito en produccion.
   */

  // -- statement: una frase que ocupa la seccion entera --------------------
  defineArrayMember({
    type: 'object', name: 'statement', title: 'Declaracion',
    fields: [
      defineField({ name: 'label', title: 'Etiqueta', type: 'string' }),
      defineField({ name: 'lead',  title: 'Frase',    type: 'text', rows: 3, validation: R => R.required() }),
      defineField({ name: 'body',  title: 'Apoyo',    type: 'text', rows: 3 }),
      defineField({
        name: 'fondo', title: 'Fondo', type: 'string',
        description: 'Hexadecimal, p. ej. #EB4602. El texto se pone blanco o negro solo, segun lo claro que sea.',
      }),
    ],
    preview: { select: { title: 'lead', subtitle: 'label' } },
  }),

  // -- logo: el rotulo del cliente sobre su panel --------------------------
  defineArrayMember({
    type: 'object', name: 'logo', title: 'Logotipo',
    fields: [
      defineField({ name: 'label',   title: 'Etiqueta', type: 'string' }),
      defineField({ name: 'heading', title: 'Titular',  type: 'string' }),
      defineField({ name: 'note',    title: 'Nota',     type: 'text', rows: 3 }),
      defineField({ name: 'src',     title: 'Rotulo',   type: 'image', description: 'Un solo archivo, de preferencia SVG. El sistema lo tine.' }),
      defineField({ name: 'fondo',   title: 'Fondo del panel', type: 'string', description: 'Hexadecimal.' }),
      defineField({ name: 'logoBlanco', title: 'El rotulo ya es blanco', type: 'boolean', initialValue: false,
        description: 'Marcar solo si el archivo viene en blanco: entonces no se tine.' }),
      defineField({ name: 'foto',       title: 'Fotografia de apoyo', type: 'image', options: { hotspot: true } }),
      defineField({ name: 'fotoOscura', title: 'La fotografia es oscura', type: 'boolean', initialValue: false,
        description: 'Decide el color del pie que va encima.' }),
      defineField({ name: 'pie',     title: 'Pie de la fotografia', type: 'string' }),
      defineField({ name: 'credito', title: 'Credito', type: 'string' }),
    ],
    preview: { select: { title: 'heading', subtitle: 'label', media: 'src' } },
  }),

  // -- palette: la carta de color ------------------------------------------
  defineArrayMember({
    type: 'object', name: 'palette', title: 'Paleta',
    fields: [
      defineField({ name: 'label',   title: 'Etiqueta', type: 'string' }),
      defineField({ name: 'heading', title: 'Titular',  type: 'string' }),
      defineField({ name: 'note',    title: 'Nota',     type: 'text', rows: 3 }),
      defineField({
        name: 'colors', title: 'Colores', type: 'array',
        validation: R => R.min(1),
        of: [defineArrayMember({
          type: 'object', name: 'color',
          fields: [
            defineField({ name: 'name', title: 'Nombre', type: 'string', validation: R => R.required() }),
            defineField({ name: 'hex',  title: 'Valor',  type: 'string', validation: R => R.required() }),
            defineField({ name: 'note', title: 'Para que sirve', type: 'text', rows: 2,
              description: 'En el telefono esta nota abre una hoja al tocar la muestra, de modo que todas las muestras miden lo mismo.' }),
            defineField({ name: 'textura', title: 'Textura del material', type: 'image',
              description: 'Opcional. Una macro del papel, la tinta o la tela, que aparece al pasar por encima.' }),
          ],
          preview: { select: { title: 'name', subtitle: 'hex' } },
        })],
      }),
    ],
    preview: { select: { title: 'heading', subtitle: 'label' } },
  }),

  // -- typography: el especimen --------------------------------------------
  defineArrayMember({
    type: 'object', name: 'typography', title: 'Tipografia',
    fields: [
      defineField({ name: 'label',   title: 'Etiqueta', type: 'string' }),
      defineField({ name: 'heading', title: 'Titular',  type: 'string' }),
      defineField({ name: 'note',    title: 'Nota',     type: 'text', rows: 4 }),
      defineField({ name: 'muestra', title: 'Lineas de muestra', type: 'array', of: [{ type: 'string' }],
        description: 'Lo que se compone con la familia. Tres lineas: el abecedario, una palabra de la marca y una linea de datos.' }),
      defineField({
        name: 'faces', title: 'Familias', type: 'array',
        description: 'Una ficha por familia. Dos pesos de la misma no son dos familias: eso se cuenta en la nota.',
        of: [defineArrayMember({
          type: 'object', name: 'face',
          fields: [
            defineField({ name: 'name',   title: 'Nombre',   type: 'string', validation: R => R.required() }),
            defineField({ name: 'family', title: 'Pila CSS', type: 'string', description: 'Tal cual va en font-family, con sus respaldos.' }),
            defineField({ name: 'role',   title: 'Donde se usa', type: 'string' }),
            defineField({ name: 'source', title: 'Fundicion', type: 'string' }),
            defineField({ name: 'year',   title: 'Ano',       type: 'string' }),
            defineField({ name: 'note',   title: 'Como se usa', type: 'text', rows: 3 }),
            defineField({ name: 'webfont', title: 'Hoja de la fuente', type: 'url',
              description: 'Opcional. Si esta, el especimen se compone con la familia de verdad.' }),
            defineField({ name: 'substitute', title: 'Es una sustituta', type: 'boolean', initialValue: false,
              description: 'Marcar si la original no es redistribuible y el especimen se compone con una parecida.' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role' } },
        })],
      }),
    ],
    preview: { select: { title: 'heading', subtitle: 'label' } },
  }),

  // -- escenario: un aparato al frente y dos que salen de detras -----------
  defineArrayMember({
    type: 'object', name: 'escenario', title: 'Escenario',
    description: 'En escritorio los laterales se abren a los lados al bajar. En el telefono no caben, asi que los tres se turnan en el mismo hueco.',
    fields: [
      defineField({ name: 'fondo',  title: 'Fondo',   type: 'image', options: { hotspot: true } }),
      defineField({ name: 'centro', title: 'Central', type: 'image', validation: R => R.required(),
        description: 'Exportado con margen para su sombra y con fondo transparente.' }),
      defineField({ name: 'izq',    title: 'Izquierda', type: 'image' }),
      defineField({ name: 'der',    title: 'Derecha',   type: 'image' }),
      defineField({ name: 'alt',    title: 'Texto alternativo', type: 'string' }),
      defineField({ name: 'credito', title: 'Credito', type: 'string' }),
      defineField({
        name: 'forma', title: 'Que aparato es', type: 'string', initialValue: 'movil',
        options: { list: [{ title: 'Telefono', value: 'movil' }, { title: 'Escritorio', value: 'escritorio' }], layout: 'radio' },
      }),
    ],
    preview: { select: { title: 'alt', media: 'centro' } },
  }),
]

const metricFields = [defineArrayMember({
  type:   'object',
  fields: [
    defineField({ name: 'label', title: 'Etiqueta', type: 'string' }),
    defineField({ name: 'value', title: 'Valor',    type: 'string' }),
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
})]

export const project = defineType({
  name:  'project',
  title: 'Proyecto',
  type:  'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'es', title: 'Español' },
  ],
  fields: [
    // ── Identity ────────────────────────────────────────────────────────────
    defineField({ name: 'title',    title: 'Nombre',            type: 'string', group: 'general', validation: R => R.required() }),
    defineField({ name: 'subtitle', title: 'Tagline editorial', type: 'string', group: 'es', description: 'Frase breve bajo el título (tophead)' }),
    defineField({ name: 'slug',     title: 'Slug',              type: 'slug',   group: 'general', options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'client',   title: 'Cliente',           type: 'string', group: 'general' }),
    defineField({ name: 'year',     title: 'Año',               type: 'number', group: 'general' }),
    defineField({ name: 'timeline', title: 'Duración',          type: 'string', group: 'general', description: 'ej. "6 semanas · Q1 2025" — se muestra en el tophead' }),
    defineField({
      name:    'vertical',
      title:   'Vertical',
      type:    'string',
      group:   'general',
      options: { list: ['SaaS', 'Fintech', 'Web', 'Branding', 'IA'] },
    }),
    defineField({
      name:  'services',
      title: 'Servicios prestados',
      type:  'array',
      group: 'general',
      of:    [{ type: 'string' }],
    }),

    // ── Media ───────────────────────────────────────────────────────────────
    defineField({ name: 'coverImage', title: 'Imagen portada',   type: 'image', group: 'general', options: { hotspot: true } }),
    defineField({
      name: 'heroMedia', title: 'Video de apertura', type: 'url', group: 'general',
      description: 'Ruta del archivo, p. ej. /images/projects/nbl/hero.mp4, o una URL completa.',
      // Las dos que hay apuntan a archivos del propio sitio, con ruta relativa.
      // El esquema solo admitia URLs absolutas, de modo que el Studio daba por
      // invalidos los dos casos que lo usan y no dejaba guardarlos.
      validation: R => R.uri({ allowRelative: true, scheme: ['http', 'https'] }),
    }),

    // ── Metrics ─────────────────────────────────────────────────────────────
    defineField({ name: 'metric',    title: 'Métrica principal', type: 'string', group: 'es', description: 'ej. "+340% conversión"' }),
    defineField({ name: 'metrics',   title: 'Barra de resultados', type: 'array', group: 'es', of: metricFields }),

    // ── Overview ────────────────────────────────────────────────────────────
    defineField({ name: 'excerpt', title: 'Resumen (reto + rol)', type: 'text', rows: 4, group: 'es' }),
    defineField({ name: 'liveUrl', title: 'URL del sitio live',   type: 'url', group: 'general' }),
    defineField({
      name: 'colorMarca', title: 'Color de marca', type: 'string', group: 'general',
      description: 'Hexadecimal. Tine el capitulo de Identidad del caso; sin el se usa el de oficio.',
    }),

    // ── Story ───────────────────────────────────────────────────────────────
    defineField({ name: 'story', title: 'Historia del caso', type: 'array', group: 'es', of: storyBlocks }),

    // ── English ─────────────────────────────────────────────────────────────
    // The case study page falls back to the Spanish field when its EN twin is
    // empty, so translating is incremental — a half-translated project still
    // renders, it just shows Spanish where EN is missing.

    // ── Order / visibility ──────────────────────────────────────────────────
    defineField({ name: 'order',    title: 'Orden manual',  type: 'number',  group: 'general', description: 'Menor = primero en la grilla' }),
    defineField({ name: 'featured', title: 'Destacado',     type: 'boolean', group: 'general', initialValue: false }),
  ],

  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],

  preview: {
    select: { title: 'title', subtitle: 'client', media: 'coverImage' },
  },
})
