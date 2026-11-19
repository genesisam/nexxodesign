import { defineField, defineType } from 'sanity'

/**
 * El estado de las automatizaciones.
 *
 * No lo escribe nadie a mano: lo escriben dos rutas del servidor.
 *
 * - `automation.youtube` guarda cuando fallo la sincronizacion y cuando se
 *   aviso, para no mandar el mismo correo cada hora.
 * - `automation.lemonsqueezy` guarda los identificadores de los eventos ya
 *   procesados, porque la entrega es «al menos una vez» y el mismo pedido
 *   puede llegar dos veces. Vive aqui y no en memoria porque cada instancia
 *   sin servidor tiene la suya, y un reintento que caiga en otra colaria el
 *   duplicado.
 *
 * Estaba sin declarar, de modo que el Studio lo veia como un documento de
 * tipo desconocido. Se declara para que deje de serlo, oculto y sin acciones:
 * si alguien lo edita a mano, rompe el control de duplicados de los pedidos.
 */
export const automationState = defineType({
  name:  'automationState',
  title: 'Estado de automatizacion',
  type:  'document',
  // Solo lectura: si alguien lo edita a mano, rompe el control de duplicados
  // de los pedidos.
  readOnly: true,
  fields: [
    defineField({ name: 'ids', title: 'Eventos ya procesados', type: 'array', of: [{ type: 'string' }],
      description: 'Lemon Squeezy. Se recortan a los ultimos doscientos.' }),
    defineField({ name: 'lastErrorKey',  title: 'Ultimo error',          type: 'string' }),
    defineField({ name: 'lastErrorAt',   title: 'Cuando fallo',          type: 'string' }),
    defineField({ name: 'notifiedAt',    title: 'Cuando se aviso',       type: 'string' }),
    defineField({ name: 'lastSuccessAt', title: 'Ultima vez que fue bien', type: 'string' }),
  ],
  preview: {
    select: { title: '_id', subtitle: 'lastSuccessAt' },
  },
})
