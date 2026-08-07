import { defineField, defineType } from 'sanity'

export const project = defineType({
  name:  'project',
  title: 'Proyecto',
  type:  'document',
  fields: [
    // ── Identity ────────────────────────────────────────────────────────────
    defineField({ name: 'title',    title: 'Nombre',         type: 'string', validation: R => R.required() }),
    defineField({ name: 'subtitle', title: 'Tagline editorial', type: 'string', description: 'Frase breve bajo el título (tophead)' }),
    defineField({ name: 'slug',     title: 'Slug',           type: 'slug',   options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'client',   title: 'Cliente',        type: 'string' }),
    defineField({ name: 'year',     title: 'Año',            type: 'number' }),
    defineField({
      name:    'vertical',
      title:   'Vertical',
      type:    'string',
      options: { list: ['SaaS', 'Fintech', 'Web', 'Branding', 'IA'] },
    }),
    defineField({
      name:  'services',
      title: 'Servicios prestados',
      type:  'array',
      of:    [{ type: 'string' }],
    }),

    // ── Media ───────────────────────────────────────────────────────────────
    defineField({ name: 'coverImage', title: 'Imagen portada',       type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroMedia',  title: 'Video hero (URL)',      type: 'url',   description: 'URL de video mp4/webm para el hero' }),

    // ── Metrics ─────────────────────────────────────────────────────────────
    defineField({ name: 'metric', title: 'Métrica principal', type: 'string', description: 'ej. "+340% conversión"' }),
    defineField({
      name:  'metrics',
      title: 'Barra de resultados',
      type:  'array',
      of: [{
        type:   'object',
        fields: [
          defineField({ name: 'label', title: 'Etiqueta', type: 'string' }),
          defineField({ name: 'value', title: 'Valor',    type: 'string' }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }],
    }),

    // ── Overview ────────────────────────────────────────────────────────────
    defineField({ name: 'excerpt', title: 'Resumen (reto + rol)', type: 'text', rows: 4 }),
    defineField({ name: 'liveUrl', title: 'URL del sitio live',   type: 'url'  }),

    // ── Story (Cuberto block model) ─────────────────────────────────────────
    defineField({
      name:  'story',
      title: 'Historia del caso',
      type:  'array',
      of: [
        // overview — label left / PT body right
        {
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
        },
        // sectionHeader — large heading + optional divider line
        {
          type: 'object', name: 'sectionHeader', title: 'Section header',
          fields: [
            defineField({ name: 'heading', title: 'Título sección', type: 'string', validation: R => R.required() }),
            defineField({ name: 'divider', title: 'Línea divisoria', type: 'boolean', initialValue: true }),
          ],
          preview: { select: { title: 'heading' } },
        },
        // media — single image or video
        {
          type: 'object', name: 'media', title: 'Media',
          fields: [
            defineField({ name: 'mediaType', title: 'Tipo', type: 'string', options: { list: ['image', 'video'], layout: 'radio' }, initialValue: 'image' }),
            defineField({ name: 'asset',    title: 'Imagen', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'videoUrl', title: 'URL video (mp4/webm)', type: 'url' }),
            defineField({ name: 'caption',  title: 'Caption', type: 'string' }),
            defineField({ name: 'size',     title: 'Tamaño',  type: 'string', options: { list: ['sm', 'lg'], layout: 'radio' }, initialValue: 'lg' }),
          ],
          preview: { select: { title: 'caption', subtitle: 'size' } },
        },
        // splitShow — 2-col asymmetric staggered gallery
        {
          type: 'object', name: 'splitShow', title: 'Split show',
          fields: [
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
                ],
                preview: { select: { title: 'caption', subtitle: 'size' } },
              }],
            }),
          ],
          preview: { prepare: () => ({ title: 'Split show' }) },
        },
        // quote — pull-quote
        {
          type: 'object', name: 'quote', title: 'Pull-quote',
          fields: [
            defineField({ name: 'text', title: 'Cita', type: 'text', rows: 3, validation: R => R.required() }),
          ],
          preview: { select: { title: 'text' } },
        },
        // feedback — client testimonial with label/author
        {
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
        },
      ],
    }),

    // ── Order / visibility ──────────────────────────────────────────────────
    defineField({ name: 'order',    title: 'Orden manual',  type: 'number',  description: 'Menor = primero en la grilla' }),
    defineField({ name: 'featured', title: 'Destacado',     type: 'boolean', initialValue: false }),
  ],

  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],

  preview: {
    select: { title: 'title', subtitle: 'client', media: 'coverImage' },
  },
})
