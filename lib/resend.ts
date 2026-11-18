import { Resend } from 'resend'

/**
 * El cliente de Resend, construido la primera vez que hace falta.
 *
 * Estaba en el cuerpo de cuatro módulos distintos, y el constructor revienta
 * si no hay clave. Next importa cada ruta y cada acción al recoger los datos
 * de las páginas, de modo que una compilación sin `RESEND_API_KEY` —una
 * preview, por ejemplo— no fallaba al enviar un correo: fallaba al compilar,
 * con un error que no menciona el correo por ninguna parte:
 *
 *   Error: Missing API key. Pass it to the constructor `new Resend("re_123")`
 *   Failed to collect page data for /api/lemonsqueezy/webhook
 *
 * Una clave que falta tiene que romper el envío, no el despliegue entero. Así
 * que aquí se mira cuando se va a usar, y una sola vez: el cliente se guarda
 * para las siguientes llamadas de la misma instancia.
 */
let cliente: Resend | null = null

export function resend(): Resend {
  const clave = process.env.RESEND_API_KEY
  if (!clave) throw new Error('Falta RESEND_API_KEY: no se puede enviar el correo.')
  return (cliente ??= new Resend(clave))
}
