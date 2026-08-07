import { defineField, defineType } from 'sanity'

export const post = defineType({
  name:  'post',
  title: 'Journal',
  type:  'document',
  fields: [
    defineField({ name: 'title',       title: 'Título',    type: 'string',   validation: R => R.required() }),
    defineField({ name: 'slug',        title: 'Slug',      type: 'slug',     options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'publishedAt', title: 'Publicado', type: 'datetime' }),
    defineField({
      name: 'category', title: 'Categoría', type: 'string',
      options: { list: ['Diseño', 'IA', 'UX', 'Proceso'], layout: 'radio' },
    }),
    defineField({ name: 'featured',    title: 'Destacado',                   type: 'boolean', initialValue: false }),
    defineField({ name: 'readingTime', title: 'Tiempo de lectura (min)',      type: 'number' }),
    defineField({ name: 'excerpt',     title: 'Resumen',                      type: 'text',    rows: 3 }),
    defineField({ name: 'coverImage',  title: 'Cover',                        type: 'image',   options: { hotspot: true } }),
    defineField({
      name: 'author', title: 'Autor', type: 'object',
      fields: [
        defineField({ name: 'name',   title: 'Nombre', type: 'string' }),
        defineField({ name: 'role',   title: 'Rol',    type: 'string' }),
        defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({ name: 'body', title: 'Cuerpo', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'tags', title: 'Etiquetas', type: 'array', of: [{ type: 'string' }] }),
  ],
  orderings: [
    { title: 'Más reciente', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
  },
})
