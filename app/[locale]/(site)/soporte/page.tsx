import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_WHATSAPP, CONTACT_CALENDLY } from '@/lib/constants'
import { buildAlternates } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title:       'Soporte — Nexxo',
    description: 'Centro de soporte de Nexxo Design. Encuentra respuestas a preguntas frecuentes o contáctanos directamente.',
    alternates:  buildAlternates(locale, '/soporte'),
  }
}

const FAQS = [
  {
    q: '¿Cuánto tiempo tarda un proyecto típico?',
    a: 'Depende del alcance. Un proyecto de diseño de producto (SaaS/app) suele tomar entre 6 y 12 semanas. Un sitio web de agencia o startup entre 3 y 6 semanas. En la llamada inicial definimos un cronograma concreto.',
  },
  {
    q: '¿Con qué tipo de clientes trabajan?',
    a: 'Trabajamos principalmente con startups de SaaS, fintech e IA en etapa seed a Serie B, y con fundadores que valoran el diseño como ventaja competitiva. También tomamos proyectos de branding y web para empresas establecidas.',
  },
  {
    q: '¿Cómo es el proceso de trabajo?',
    a: 'Comenzamos con una llamada de descubrimiento, definimos alcance y entregables, luego pasamos por fases de research → diseño → revisión → entrega. Comunicación directa por WhatsApp o Notion, sin intermediarios.',
  },
  {
    q: '¿Entregan el código o solo el diseño?',
    a: 'Podemos entregar solo diseño (Figma) o diseño + desarrollo frontend (Next.js). Lo definimos según las necesidades del proyecto.',
  },
  {
    q: '¿Cuáles son sus tarifas?',
    a: 'Trabajamos por proyecto, no por hora. El presupuesto depende del alcance. Agenda una llamada o usa el formulario de cotización para recibir una propuesta personalizada.',
  },
  {
    q: '¿Tienen garantía de satisfacción?',
    a: 'Sí. Incluimos rondas de revisión definidas en el contrato y no cerramos un proyecto hasta que estés conforme con el resultado.',
  },
]

export default function SoportePage() {
  return (
    <main className="bg-ink min-h-screen gutter-x pt-32 md:pt-44 pb-24 md:pb-32">

      <Link
        href="/"
        className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/60 hover:text-accent transition-colors duration-200 inline-flex items-center gap-2 mb-12 md:mb-16"
      >
        ← Volver al inicio
      </Link>

      <div className="max-w-[80ch]">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent mb-6">
          Ayuda
        </p>
        <h1
          className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em] mb-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          Soporte
        </h1>
        <p className="font-sans text-paper/70 text-base leading-relaxed mb-16 max-w-[52ch]">
          Encuentra respuestas a las preguntas más frecuentes o contáctanos directamente.
          Respondemos en menos de 24 horas hábiles.
        </p>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="mb-16 md:mb-20">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/60 mb-10">
            Preguntas frecuentes
          </p>
          <dl className="divide-y divide-paper/10 border-t border-paper/10">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="py-8 md:grid md:grid-cols-[2fr_3fr] md:gap-12">
                <dt className="font-display font-semibold text-paper text-base tracking-[-0.02em] mb-3 md:mb-0">
                  {q}
                </dt>
                <dd className="font-sans text-paper/55 text-[14px] leading-relaxed">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Contacto directo ──────────────────────────────────────────────── */}
        <section className="border-t border-paper/10 pt-12">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/60 mb-8">
            Contacto directo
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                label: 'WhatsApp',
                desc: 'Respuesta más rápida',
                href: CONTACT_WHATSAPP,
                cta: 'Escribir por WhatsApp',
                external: true,
              },
              {
                label: 'Agendar llamada',
                desc: 'Llamada de 15 min sin costo',
                href: CONTACT_CALENDLY,
                cta: 'Ver disponibilidad',
                external: true,
              },
              {
                label: 'Formulario',
                desc: 'Cotización detallada',
                href: '/contact',
                cta: 'Ir al formulario',
                external: false,
              },
            ].map(({ label, desc, href, cta, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="group block border border-paper/10 p-6 hover:border-paper/30 transition-colors duration-200"
              >
                <p className="font-display font-semibold text-paper text-base tracking-[-0.02em] mb-1">
                  {label}
                </p>
                <p className="font-sans text-paper/65 text-[12px] mb-5">{desc}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent group-hover:text-paper transition-colors duration-200">
                  {cta} →
                </p>
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
