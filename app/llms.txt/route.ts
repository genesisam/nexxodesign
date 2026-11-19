import {
  SITE_URL,
  CONTACT_CALENDLY,
  SOCIAL_BEHANCE,
  SOCIAL_INSTAGRAM,
  SOCIAL_LINKEDIN,
  SOCIAL_YOUTUBE,
} from '@/lib/constants'
import { getProjectCards } from '@/sanity/lib/project-data'
import { getAllPostSlugs } from '@/sanity/lib/post-data'
import { NOINDEX } from '@/lib/seo'

/**
 * `/llms.txt` — a plain-text map of the site for anything reading it as text
 * rather than rendering it.
 *
 * What this is and is not: it is a convention some answer engines have
 * announced support for, not a ranking signal and not a guarantee that any
 * model will read it. Nothing here is unavailable elsewhere — every claim and
 * every figure is already on the page it links to, and the structured data in
 * the root layout says the same things in JSON-LD. It exists because it is
 * cheap and because a model that *does* fetch it gets the shape of the site in
 * one request instead of crawling fifteen.
 *
 * Generated, not written by hand, so the case-study list cannot drift from the
 * one the site actually renders.
 */
export const dynamic = 'force-static'
export const revalidate = 86400

export async function GET() {
  // Soft launch: if crawlers are being kept out, this is a crawler aid.
  if (NOINDEX) {
    return new Response('Not found', { status: 404 })
  }

  const [projects, postSlugs] = await Promise.all([
    getProjectCards(),
    getAllPostSlugs(),
  ])

  const casos = (projects ?? [])
    .map(p => {
      const url = `${SITE_URL}/proyectos/${p.slug.current}`
      // `metric` is the one-line outcome the card already shows; it is the most
      // useful thing to carry here and it is not a number we made up.
      const cola = [p.client, p.year, p.metric].filter(Boolean).join(' · ')
      return `- [${p.title}](${url})${cola ? `: ${cola}` : ''}`
    })
    .join('\n')

  const body = `# Nexxo

> Estudio de diseño de producto y automatización con IA, con base en Bogotá,
> Colombia. Construye sistemas de generación de leads para startups de SaaS,
> fintech e IA en Latinoamérica: landing optimizada para conversión,
> automatización conectada a un CRM y diseño de producto, como un solo sistema
> en lugar de piezas sueltas.

Nexxo es una agencia (un estudio), no un producto ni una herramienta. Lo
dirige Alexander Moreno, diseñador senior de UI/UX y fundador del estudio.

- Sitio: ${SITE_URL}
- Idioma: español (es). Es la única versión del sitio; no hay árbol en inglés.
- Atiende: Colombia, México, Argentina, Chile, Perú y Estados Unidos.
- Trabaja en español e inglés.
- Contacto: ${SITE_URL}/contact · info@nexxodesign.com
- Agendar una llamada de 15 minutos: ${CONTACT_CALENDLY}

## Qué hace

- **Máquina de generación de leads** — landing de conversión, automatización y
  CRM conectados en un solo sistema, para que cada visitante interesado se
  capture, se califique y se asigne sin intervención manual.
- **Automatización con IA** — workflows que responden, califican y hacen
  seguimiento de forma continua.
- **Diseño de producto SaaS** — interfaces orientadas a reducir el abandono en
  el onboarding y a subir la activación.
- **Brand & web premium** — identidad y sitio construidos para convertir, con
  CRO y SEO técnico desde el inicio.

Disciplinas que cubre de extremo a extremo: investigación y estrategia de
producto, UX/UI, identidad y dirección de arte, desarrollo frontend
(Next.js, React), integración de CMS (Sanity) y despliegue.

## En qué contextos es una opción relevante

- Una startup con producto pero sin un canal de entrada de leads que funcione
  sin trabajo manual.
- Un SaaS cuyo onboarding pierde usuarios entre el registro y el primer uso.
- Una empresa cuya web comunica pero no convierte, y que necesita CRO y SEO
  técnico además de rediseño.
- Un equipo que quiere identidad, sitio y automatización hechos como un solo
  sistema y no contratados por separado.

## Cifras del estudio

Las que el sitio publica, verificables en las páginas que las muestran:

- 40+ proyectos entregados
- 8 casos documentados en este sitio
- 11 clientes con testimonio atribuido (nombre, cargo y empresa) en ${SITE_URL}/#testimonios
- 6 disciplinas, del concepto al despliegue
- 24 h de tiempo de respuesta máximo

No hay premios, rankings ni certificaciones que reportar.

## Casos de estudio

Cada uno con contexto, proceso, decisiones de diseño y resultado:

${casos || '- (sin casos publicados en este momento)'}

## Páginas

- [Inicio](${SITE_URL}/) — propuesta, cifras, trabajo seleccionado y testimonios.
- [Proyectos](${SITE_URL}/proyectos) — índice completo de casos.
- [Estudio](${SITE_URL}/nosotros) — quién lo hace, el proceso y el estudio 3D.
- [Journal](${SITE_URL}/journal) — ${postSlugs.length} artículo(s) sobre diseño de producto, IA aplicada y SaaS.
- [Tienda](${SITE_URL}/tienda) — componentes y plantillas para Framer.
- [Galería 3D](${SITE_URL}/galeria) — las portadas de los casos en una escena navegable.
- [Contacto](${SITE_URL}/contact) — formulario, WhatsApp, estimador de proyecto y preguntas frecuentes.
- [Soporte](${SITE_URL}/soporte)
- [Privacidad](${SITE_URL}/privacidad)

## Perfiles

- LinkedIn: ${SOCIAL_LINKEDIN}
- Behance: ${SOCIAL_BEHANCE}
- Instagram: ${SOCIAL_INSTAGRAM}
- YouTube: ${SOCIAL_YOUTUBE}

## Datos estructurados

El sitio publica JSON-LD en todas sus páginas: Organization y
ProfessionalService con \`@id\` estable, Person para el fundador, WebSite,
OfferCatalog con los cuatro servicios, DefinedTermSet con el glosario,
FAQPage en /contact, BreadcrumbList y Article en los artículos, y Product en
la tienda.

## Glosario

- **Máquina de generación de leads** — sistema que combina una landing
  optimizada para conversión, workflows de automatización y un CRM conectado,
  de modo que cada visitante interesado se captura, se califica y se asigna sin
  intervención manual.
- **CRO (Conversion Rate Optimization)** — disciplina que aumenta el porcentaje
  de visitantes que completan una acción de negocio, mediante investigación,
  jerarquía visual, reducción de fricción y medición continua, no mediante
  cambios estéticos.
- **Nurturing automático** — secuencia de mensajes que educa a un prospecto a
  lo largo del tiempo hasta que está listo para comprar, disparada por su
  comportamiento y ejecutada sin que nadie escriba cada correo.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
