import { defineField, defineType } from 'sanity'

export const client = defineType({
  name: 'client',
  title: 'Cliente / Logo',
  type: 'document',
  fields: [
    defineField({ name: 'name',   title: 'Nombre',       type: 'string', validation: R => R.required() }),
    defineField({ name: 'logo',   title: 'Logo (SVG/PNG)', type: 'image' }),
    defineField({ name: 'logoLight', title: 'Logo claro (para fondo oscuro)', type: 'image' }),
    defineField({ name: 'url',    title: 'Sitio web',    type: 'url' }),
    defineField({ name: 'order',  title: 'Orden',        type: 'number' }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
