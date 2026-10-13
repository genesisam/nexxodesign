import type { Metadata } from 'next'
import { getAllProducts } from '@/sanity/lib/product-data'
import { buildAlternates } from '@/lib/seo'
import { StoreCatalog } from '@/components/store/StoreCatalog'
import { Accordion } from '@/components/store/Accordion'
import type { ProductFaqItem } from '@/types/product'

type Props = { params: Promise<{ locale: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title:       'Tienda — Nexxo',
    description: 'Componentes y templates de Framer hechos para proyectos reales. Pago único, actualizaciones incluidas.',
    alternates:  buildAlternates(locale, '/tienda'),
    openGraph: {
      title:       'Tienda — Nexxo',
      description: 'Componentes y templates de Framer hechos para proyectos reales.',
      type:        'website',
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

export default async function TiendaPage() {
  const products = await getAllProducts()

  return (
    <main className="bg-ink min-h-screen">

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
