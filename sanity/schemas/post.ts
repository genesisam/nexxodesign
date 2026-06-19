import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Journal',
  type: 'document',
  fields: [
    defineField({ name: 'title',       title: 'Título',      type: 'string',  validation: R => R.required() }),
    defineField({ name: 'slug',        title: 'Slug',        type: 'slug',    options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'publishedAt', title: 'Publicado',   type: 'datetime' }),
    defineField({ name: 'coverImage',  title: 'Imagen',      type: 'image',   options: { hotspot: true } }),
    defineField({ name: 'excerpt',     title: 'Resumen',     type: 'text',    rows: 3 }),
    defineField({ name: 'body',        title: 'Cuerpo',      type: 'array',   of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'tags',        title: 'Etiquetas',   type: 'array',   of: [{ type: 'string' }] }),
  ],
  orderings: [
    { title: 'Más reciente', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' },
  },
})
