import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A product in the store: a Framer code component, a template or a bundle.
 *
 * `lemonCheckoutUrl` sits on the licence, not on the product, because each tier
 * is its own checkout in Lemon Squeezy. While the shop is still being verified
 * they stay empty and the buy button falls back to `fallbackBuyUrl`, which is
 * why that one is required and the checkout ones are not.
 */
export const product = defineType({
  name:  'product',
  title: 'Tienda',
  type:  'document',
  groups: [
    { name: 'basics',   title: 'Básicos', default: true },
    { name: 'media',    title: 'Media' },
    { name: 'commerce', title: 'Venta' },
    { name: 'content',  title: 'Contenido' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', group: 'basics', validation: R => R.required() }),
    defineField({
      name: 'slug', title: 'Slug', type: 'slug', group: 'basics',
      options: { source: 'title', maxLength: 70 }, validation: R => R.required(),
    }),
    defineField({
      name: 'type', title: 'Tipo', type: 'string', group: 'basics',
      options: { list: [
        { title: 'Componente', value: 'component' },
        { title: 'Template',   value: 'template'  },
        { title: 'Bundle',     value: 'bundle'    },
      ], layout: 'radio' },
      initialValue: 'component', validation: R => R.required(),
    }),
    defineField({
      name: 'status', title: 'Estado', type: 'string', group: 'basics',
      options: { list: [
        { title: 'Disponible',   value: 'available'   },
        { title: 'Próximamente', value: 'coming_soon' },
      ], layout: 'radio' },
      initialValue: 'available', validation: R => R.required(),
      description: 'Próximamente muestra "Avísame" en lugar del botón de compra.',
    }),
    defineField({
      name: 'tagline', title: 'Tagline', type: 'string', group: 'basics',
      description: 'Una línea. Es lo que se lee en la tarjeta del catálogo.',
      validation: R => R.required().max(140),
    }),
    defineField({ name: 'badge', title: 'Badge', type: 'string', group: 'basics', description: 'Opcional: "Nuevo", "Más vendido".' }),
    defineField({ name: 'featured', title: 'Destacado', type: 'boolean', group: 'basics', initialValue: false }),
    defineField({ name: 'order', title: 'Orden', type: 'number', group: 'basics', initialValue: 0 }),

    // ── Media ────────────────────────────────────────────────────────────────
    defineField({ name: 'coverImage', title: 'Cover', type: 'image', group: 'media', options: { hotspot: true } }),
    defineField({
      name: 'gallery', title: 'Galería', type: 'array', group: 'media',
      of: [defineArrayMember({
        type: 'image', options: { hotspot: true },
        fields: [defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' })],
      })],
    }),
    defineField({
      name: 'demoVideo', title: 'Video de demo', type: 'object', group: 'media',
      description: 'Loop corto y sin audio. Se muestra en la tarjeta al pasar el cursor y arriba en la ficha.',
      fields: [
        defineField({ name: 'url', title: 'URL del video (mp4/webm)', type: 'url' }),
        // The site has no Mux player installed; the field exists so moving the
        // demos to Mux later is a content change, not a schema migration.
        defineField({ name: 'muxPlaybackId', title: 'Mux playback ID', type: 'string', description: 'Para cuando los demos se muevan a Mux. Hoy no se usa.' }),
      ],
    }),
    defineField({ name: 'demoUrl', title: 'URL del demo publicado', type: 'url', group: 'media' }),

    // ── Venta ────────────────────────────────────────────────────────────────
    defineField({
      name: 'licenses', title: 'Licencias', type: 'array', group: 'commerce',
      of: [defineArrayMember({
        type: 'object', name: 'license',
        fields: [
          defineField({ name: 'name',        title: 'Nombre', type: 'string', description: 'Personal, Unlimited…', validation: R => R.required() }),
          defineField({ name: 'price',       title: 'Precio (USD)', type: 'number', validation: R => R.required().min(0) }),
          defineField({ name: 'description', title: 'Qué incluye', type: 'string' }),
          defineField({
            name: 'lemonCheckoutUrl', title: 'Checkout de Lemon Squeezy', type: 'url',
            description: 'Déjalo vacío hasta que la tienda esté aprobada. Sin esto, el botón lleva al marketplace.',
          }),
        ],
        preview: { select: { title: 'name', subtitle: 'price' } },
      })],
    }),
    defineField({ name: 'price', title: 'Precio base (USD)', type: 'number', group: 'commerce', description: 'Solo se usa si no hay licencias.' }),
    defineField({ name: 'compareAtPrice', title: 'Precio tachado (USD)', type: 'number', group: 'commerce', description: 'Para bundles: la suma de comprarlos por separado.' }),
    defineField({
      name: 'fallbackBuyUrl', title: 'Link de compra alternativo', type: 'url', group: 'commerce',
      description: 'Contra o el marketplace de Framer. Es a donde va el botón mientras no haya checkout.',
      validation: R => R.required(),
    }),
    defineField({ name: 'freeVersionUrl', title: 'URL de la versión gratis', type: 'url', group: 'commerce' }),

    // ── Contenido ────────────────────────────────────────────────────────────
    defineField({
      name: 'description', title: 'Descripción', type: 'array', group: 'content',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [
          defineField({ name: 'alt',     title: 'Texto alternativo', type: 'string' }),
          defineField({ name: 'caption', title: 'Pie de foto',       type: 'string' }),
        ]},
      ],
    }),
    defineField({
      name: 'features', title: 'Características', type: 'array', group: 'content',
      of: [defineArrayMember({
        type: 'object', name: 'feature',
        fields: [
          defineField({ name: 'title',       title: 'Título', type: 'string', validation: R => R.required() }),
          defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
          defineField({ name: 'isPro',       title: 'Solo en Pro', type: 'boolean', initialValue: false }),
        ],
        preview: { select: { title: 'title', subtitle: 'description' } },
      })],
    }),
    defineField({
      name: 'freeVsPro', title: 'Tabla Free vs Pro', type: 'array', group: 'content',
      of: [defineArrayMember({
        type: 'object', name: 'freeVsProRow',
        fields: [
          defineField({ name: 'feature', title: 'Característica', type: 'string', validation: R => R.required() }),
          defineField({ name: 'free',    title: 'Free', type: 'string' }),
          defineField({ name: 'pro',     title: 'Pro',  type: 'string' }),
        ],
        preview: { select: { title: 'feature', subtitle: 'pro' } },
      })],
    }),
    defineField({
      name: 'compatibility', title: 'Compatibilidad', type: 'array', group: 'content',
      of: [{ type: 'string' }], options: { layout: 'tags' },
      description: 'Framer, Framer Commerce, Shopify, Supabase…',
    }),
    defineField({
      name: 'includes', title: 'Qué incluye', type: 'array', group: 'content',
      of: [{ type: 'string' }],
      description: 'Remix link, README, SQL de Supabase…',
    }),
    defineField({
      name: 'faq', title: 'FAQ', type: 'array', group: 'content',
      of: [defineArrayMember({
        type: 'object', name: 'faqItem',
        fields: [
          defineField({ name: 'question', title: 'Pregunta',  type: 'string', validation: R => R.required() }),
          defineField({ name: 'answer',   title: 'Respuesta', type: 'text', rows: 3, validation: R => R.required() }),
        ],
        preview: { select: { title: 'question' } },
      })],
    }),
    defineField({
      name: 'changelog', title: 'Changelog', type: 'array', group: 'content',
      of: [defineArrayMember({
        type: 'object', name: 'changelogEntry',
        fields: [
          defineField({ name: 'version', title: 'Versión', type: 'string', validation: R => R.required() }),
          defineField({ name: 'date',    title: 'Fecha',   type: 'date' }),
          defineField({ name: 'notes',   title: 'Notas',   type: 'text', rows: 2 }),
        ],
        preview: { select: { title: 'version', subtitle: 'notes' } },
      })],
    }),
    defineField({
      name: 'bundleItems', title: 'Productos del bundle', type: 'array', group: 'content',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      hidden: ({ document }) => document?.type !== 'bundle',
    }),
  ],
  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'tagline', media: 'coverImage' },
  },
})
