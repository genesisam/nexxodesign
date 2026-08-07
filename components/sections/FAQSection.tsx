'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: '¿Qué hace exactamente Nexxo?',
    a: 'Nexxo es un estudio especializado en construir sistemas de generación de leads para startups usando diseño premium, automatización con IA y CRO. No entregamos solo un sitio web — entregamos una máquina de adquisición que trabaja 24/7: landing optimizada, workflows de IA para nutrir leads automáticamente, CRM conectado y analytics para medir cada peso invertido.',
  },
  {
    q: '¿Cuánto tiempo tarda un proyecto?',
    a: 'Entre 4 y 12 semanas según el alcance. Un sistema de lead generation con landing + automatización tarda entre 4–6 semanas. Un producto SaaS completo (UX/UI + desarrollo) entre 8–12 semanas. Siempre con entregables semanales y comunicación directa.',
  },
  {
    q: '¿Qué diferencia a Nexxo de una agencia de diseño tradicional?',
    a: 'Las agencias de diseño entregan archivos. Nexxo entrega resultados medibles. Combinamos diseño de alta fidelidad con automatización de IA y CRO desde el día uno. Todos nuestros proyectos incluyen KPIs de negocio definidos al inicio y revisión de métricas a los 30, 60 y 90 días post-lanzamiento.',
  },
  {
    q: '¿Trabajan solo con empresas en Colombia?',
    a: 'No. Trabajamos con startups en toda LatAm (México, Argentina, Chile, Perú, Colombia) y con empresas internacionales que quieren entrar al mercado latinoamericano. Todos nuestros proyectos son remotos y entregamos en español e inglés.',
  },
  {
    q: '¿Qué tipo de automatizaciones con IA implementan?',
    a: 'Implementamos workflows que incluyen: seguimiento automático de leads por WhatsApp y email, chatbots con IA para calificación de prospectos, integración con CRMs (HubSpot, Notion, Airtable), pipelines de nurturing con IA generativa, y dashboards de analítica en tiempo real. Todo conectado a tu stack actual.',
  },
  {
    q: '¿Cuánto cuesta un proyecto?',
    a: 'Los proyectos comienzan desde $5,000 USD para landing pages de conversión con automatización básica. Los sistemas completos de lead generation con IA y diseño de producto oscilan entre $8,000 y $25,000 USD según el alcance. Usa el estimador en nuestra página de contacto para obtener un presupuesto personalizado en 2 minutos.',
  },
  {
    q: '¿Pueden trabajar con mi stack tecnológico actual?',
    a: 'Sí. Desarrollamos principalmente en Next.js, Tailwind y Sanity CMS, pero nos integramos con cualquier stack: Webflow, Shopify, WordPress, HubSpot, Salesforce, Zapier, Make y herramientas de IA como OpenAI, Anthropic y Google Gemini.',
  },
  {
    q: '¿Qué garantías ofrecen?',
    a: 'Todos los proyectos incluyen: entregables semanales documentados, revisiones ilimitadas dentro del alcance definido, handoff completo con código fuente o archivos de diseño, 30 días de soporte post-lanzamiento y revisión de métricas a los 30 y 60 días.',
  },
] as const

const faqJsonLd = {
  '@context':   'https://schema.org',
  '@type':      'FAQPage',
  mainEntity:   FAQS.map(({ q, a }) => ({
    '@type':          'Question',
    name:             q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      aria-label="Preguntas frecuentes"
      className="bg-ink border-t border-paper/10 px-6 md:px-16 lg:px-24 py-20 md:py-28"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start">

        {/* Left label */}
        <div className="md:sticky md:top-32">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-paper/35 mb-4">
            {'>> FAQ'}
          </p>
          <h2
            className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3.2rem)' }}
          >
            Preguntas<br />frecuentes
          </h2>
          <p className="font-mono text-paper/40 text-[11px] leading-relaxed mt-5 max-w-[24ch]">
            ¿No encuentras lo que buscas? Escríbenos por WhatsApp.
          </p>
        </div>

        {/* Right: accordion */}
        <div className="flex flex-col">
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className="border-b border-paper/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-start justify-between gap-6 py-5 md:py-6 text-left group"
              >
                <span
                  className="font-sans font-medium text-paper group-hover:text-paper/80 transition-colors leading-snug"
                  style={{ fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)' }}
                >
                  {q}
                </span>
                <span
                  className="flex-shrink-0 font-mono text-paper/30 text-lg leading-none mt-0.5 transition-transform duration-200"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  aria-hidden
                >
                  +
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? '400px' : '0px' }}
              >
                <p
                  className="font-sans text-paper/55 leading-relaxed pb-6"
                  style={{ fontSize: 'clamp(0.875rem, 1vw, 0.975rem)' }}
                >
                  {a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
