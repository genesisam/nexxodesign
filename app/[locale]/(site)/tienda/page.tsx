import type { Metadata } from 'next'
import { getAllProducts } from '@/sanity/lib/product-data'
import { buildAlternates, absoluteUrl } from '@/lib/seo'
import { StoreCatalog } from '@/components/store/StoreCatalog'
import { Accordion } from '@/components/store/Accordion'
import type { ProductFaqItem } from '@/types/product'

type Props = { params: Promise<{ locale: string }> }

export const revalidate = 3600

// No "| Nexxo": the root layout's title template appends it. Social cards skip
// that template, so OG_TITLE spells it out.
const TITLE    = 'Componentes y templates para Framer en español'
const OG_TITLE = `${TITLE} | Nexxo`
const DESCRIPTION =
  'Componentes de código y templates para Framer: reservas, calificación de leads, reseñas con Supabase, fichas técnicas y tiendas completas. Pago único, en español.'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title:       TITLE,
    description: DESCRIPTION,
    keywords: [
      'componentes para Framer',
      'templates de Framer',
      'componentes de Framer en español',
      'plantillas Framer',
      'Framer code components',
      'comprar componentes Framer',
    ],
    alternates:  buildAlternates(locale, '/tienda'),
    openGraph: {
      title:       OG_TITLE,
      description: DESCRIPTION,
      type:        'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       OG_TITLE,
      description: DESCRIPTION,
    },
  }
}

/** Licences and support, the two things people ask before buying. */
const STORE_FAQ: ProductFaqItem[] = [
  {
    _key: 'f1',
    question: '¿Qué diferencia hay entre la licencia Personal y la Unlimited?',
    answer: 'La Personal cubre un proyecto propio. La Unlimited cubre todos los proyectos que quieras, incluidos los de clientes. Las dos son pago único e incluyen las actualizaciones.',
  },
  {
    _key: 'f2',
    question: '¿Cómo recibo el componente después de pagar?',
    answer: 'Te llega un correo con el remix link del proyecto de Framer y el README. Lo abres, lo copias a tu proyecto y queda listo para usar.',
  },
  {
    _key: 'f3',
    question: '¿Necesito saber código?',
    answer: 'No. Todo se configura desde el panel de propiedades de Framer. El código está dentro del componente y no hace falta tocarlo.',
  },
  {
    _key: 'f4',
    question: '¿Hay reembolsos?',
    answer: 'Son archivos digitales, así que no hay reembolso automático. Si algo no funciona como se describe, escríbeme y lo arreglo o te devuelvo el dinero.',
  },
  {
    _key: 'f5',
    question: '¿Dan soporte?',
    answer: 'Sí, por correo. Con licencia Unlimited respondo directo; con Personal, en cuanto pueda. Los errores del componente se corrigen siempre, sin importar la licencia.',
  },
]

export default async function TiendaPage({ params }: Props) {
  const { locale } = await params
  const products   = await getAllProducts()

  // The catalogue as a list Google can read, so the products can surface
  // individually rather than only as one page about a store.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':        'ItemList',
        name:           'Componentes y templates para Framer',
        numberOfItems:  products.length,
        itemListElement: products.map((product, i) => ({
          '@type':   'ListItem',
          position:  i + 1,
          name:      product.title,
          url:       absoluteUrl(locale, `/tienda/${product.slug.current}`),
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluteUrl(locale, '') },
          { '@type': 'ListItem', position: 2, name: 'Tienda', item: absoluteUrl(locale, '/tienda') },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: STORE_FAQ.map(item => ({
          '@type':        'Question',
          name:           item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  }

  return (
    <main className="bg-ink min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══ TOPHEAD ═══════════════════════════════════════════════════════════ */}
      <section className="gutter-x pt-32 md:pt-44 pb-16 md:pb-20 border-b border-paper/10">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-6">
          Tienda · Nexxo
        </p>
        <h1
          className="font-display font-semibold text-paper leading-[0.88] tracking-[-0.04em] mb-7"
          style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}
        >
          Componentes<br />
          para Framer.
        </h1>
        <p
          className="font-sans text-paper/70 leading-relaxed max-w-[48ch]"
          style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)' }}
        >
          Piezas que salieron de proyectos reales, no de una lista de ideas. Pago único,
          actualizaciones incluidas y soporte de quien las construyó.
        </p>
      </section>

      {/* ══ CATÁLOGO ══════════════════════════════════════════════════════════ */}
      <div className="pt-14 md:pt-20">
        <StoreCatalog products={products} />
      </div>

      {/* ══ QUÉ ES ESTO ═══════════════════════════════════════════════════════ */}
      {/* Plain text that says what the store sells, in the words someone would
          use to search for it. It is also the only place that explains the
          difference between a component and a template. */}
      <section className="gutter-x py-20 md:py-28 border-t border-paper/10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        <div>
          <h2
            className="font-display font-semibold text-paper leading-[0.95] tracking-[-0.03em] mb-5"
            style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.1rem)' }}
          >
            Componentes de código para Framer
          </h2>
          <p className="font-sans text-paper/65 text-[14px] leading-relaxed max-w-[52ch]">
            Son piezas sueltas que arrastras a tu proyecto de Framer: un flujo de reservas, una
            calculadora de presupuesto, una ficha técnica, un carrusel. Están escritas en React y se
            configuran desde el panel de propiedades, así que puedes cambiar textos, colores y
            tipografías sin tocar una línea de código.
          </p>
        </div>
        <div>
          <h2
            className="font-display font-semibold text-paper leading-[0.95] tracking-[-0.03em] mb-5"
            style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.1rem)' }}
          >
            Templates listos para publicar
          </h2>
          <p className="font-sans text-paper/65 text-[14px] leading-relaxed max-w-[52ch]">
            Son sitios completos: varias páginas, colecciones de CMS ya montadas y diseños para
            escritorio, tablet y teléfono. Llegan como remix link, los editas con tu marca y los
            publicas. Dos de ellos son gratuitos.
          </p>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════════════════ */}
      <section className="gutter-x py-20 md:py-28 border-t border-paper/10">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/65 mb-5">
          Licencias y soporte
        </p>
        <h2
          className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em] mb-12 max-w-[20ch]"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)' }}
        >
          Lo que preguntan antes de comprar.
        </h2>
        <Accordion items={STORE_FAQ} />
      </section>

    </main>
  )
}
