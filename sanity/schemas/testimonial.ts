import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({ name: 'quote',   title: 'Cita',     type: 'text',   rows: 4, validation: R => R.required() }),
    defineField({ name: 'author',  title: 'Nombre',   type: 'string', validation: R => R.required() }),
    defineField({ name: 'role',    title: 'Cargo',    type: 'string' }),
    defineField({ name: 'company', title: 'Empresa',  type: 'string' }),
    defineField({ name: 'metric',  title: 'Resultado', type: 'string', description: 'ej. "+3× retención al mes 3"' }),
    defineField({ name: 'avatar',  title: 'Avatar',   type: 'image',  options: { hotspot: true } }),
    defineField({ name: 'order',   title: 'Orden',    type: 'number' }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'company', media: 'avatar' },
  },
})
