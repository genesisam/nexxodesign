import type { Metadata } from 'next'
import Link from 'next/link'
import { buildAlternates } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title:       'Gracias por tu compra — Nexxo',
    description: 'Tu compra está confirmada. Revisa tu correo para el acceso al componente.',
    alternates:  buildAlternates(locale, '/tienda/gracias'),
    // A receipt page has nothing to offer a search engine, and it would be an
    // odd first impression as a search result.
    robots: { index: false, follow: true },
  }
}

export default function GraciasPage() {
  return (
    <main className="bg-ink min-h-screen flex items-center">
      <section className="gutter-x py-32 md:py-44">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent mb-6">
          Compra confirmada
        </p>
        <h1
          className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em] mb-7 max-w-[16ch]"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
        >
          Gracias. Ya es tuyo.
        </h1>
        <p className="font-sans text-paper/70 text-[15px] leading-relaxed max-w-[52ch] mb-4">
          Te llega un correo con el acceso al componente y el README. Si no aparece en unos
          minutos, revisa la carpeta de spam.
        </p>
        <p className="font-sans text-paper/70 text-[15px] leading-relaxed max-w-[52ch] mb-12">
          ¿Algo no funciona como esperabas? Escríbeme y lo resolvemos.
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/tienda"
            className="font-mono text-[10px] uppercase tracking-[0.22em] bg-paper text-ink px-6 py-4 hover:bg-paper/90 transition-colors duration-200"
          >
            Volver a la tienda
          </Link>
          <Link
            href="/contact"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70 border-b border-paper/30 pb-1 hover:text-paper hover:border-paper transition-colors duration-200"
          >
            Escribirme →
          </Link>
        </div>
      </section>
    </main>
  )
}
