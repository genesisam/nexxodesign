import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    defineField({ name: 'title',       title: 'Nombre',      type: 'string',   validation: R => R.required() }),
    defineField({ name: 'slug',        title: 'Slug',        type: 'slug',     options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'client',      title: 'Cliente',     type: 'string' }),
    defineField({ name: 'year',        title: 'Año',         type: 'number' }),
    defineField({ name: 'tags',        title: 'Etiquetas',   type: 'array',    of: [{ type: 'string' }] }),
    defineField({ name: 'metric',      title: 'Métrica clave', type: 'string', description: 'ej. "+58% conversión"' }),
    defineField({ name: 'coverImage',  title: 'Imagen portada', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'video',       title: 'Video (Mux playback ID)', type: 'string' }),
    defineField({ name: 'excerpt',     title: 'Resumen',     type: 'text',     rows: 3 }),
    defineField({ name: 'body',        title: 'Cuerpo',      type: 'array',    of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'order',       title: 'Orden',       type: 'number',   description: 'Menor = primero en la grilla' }),
    defineField({ name: 'featured',    title: 'Destacado',   type: 'boolean',  initialValue: false }),
  ],
  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'client', media: 'coverImage' },
  },
})
