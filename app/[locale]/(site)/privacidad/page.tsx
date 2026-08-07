import type { Metadata } from 'next'
import Link from 'next/link'
import { buildAlternates } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title:       'Política de privacidad — Nexxo',
    description: 'Cómo recopilamos, usamos y protegemos tu información personal en Nexxo Design.',
    alternates:  buildAlternates(locale, '/privacidad'),
  }
}

export default function PrivacidadPage() {
  return (
    <main className="bg-ink min-h-screen px-6 md:px-16 lg:px-24 pt-32 md:pt-44 pb-24 md:pb-32">

      <Link
        href="/"
        className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper/35 hover:text-accent transition-colors duration-200 inline-flex items-center gap-2 mb-12 md:mb-16"
      >
        ← Volver al inicio
      </Link>

      <div className="max-w-[72ch]">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent mb-6">
          Legal
        </p>
        <h1
          className="font-display font-semibold text-paper leading-[0.92] tracking-[-0.04em] mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          Política de privacidad
        </h1>

        <div className="font-sans text-paper/65 text-[15px] leading-relaxed space-y-8">

          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/35">
            Última actualización: junio 2026
          </p>

          <section>
            <h2 className="font-display font-semibold text-paper text-xl tracking-[-0.02em] mb-3">
              1. Quiénes somos
            </h2>
            <p>
              Nexxo Design (&quot;Nexxo&quot;, &quot;nosotros&quot;) es un estudio de diseño de producto y web
              con sede en Bogotá, Colombia. Esta política describe cómo manejamos la
              información que recopilamos cuando visitas nuestro sitio web o nos contactas.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-paper text-xl tracking-[-0.02em] mb-3">
              2. Información que recopilamos
            </h2>
            <ul className="space-y-2 list-none">
              {[
                'Nombre y correo electrónico cuando llenas el formulario de contacto.',
                'Correo electrónico cuando te suscribes al newsletter.',
                'Datos de navegación anónimos (páginas visitadas, tiempo en sitio) a través de analíticas de privacidad.',
                'Información del proyecto que compartes voluntariamente al solicitar una cotización.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-accent mt-1 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display font-semibold text-paper text-xl tracking-[-0.02em] mb-3">
              3. Cómo usamos tu información
            </h2>
            <ul className="space-y-2 list-none">
              {[
                'Responder a tu consulta o solicitud de cotización.',
                'Enviarte el newsletter si te suscribiste (puedes darte de baja en cualquier momento).',
                'Mejorar nuestro sitio web y servicios.',
                'No vendemos, alquilamos ni compartimos tu información con terceros con fines comerciales.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-accent mt-1 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display font-semibold text-paper text-xl tracking-[-0.02em] mb-3">
              4. Cookies
            </h2>
            <p>
              Nuestro sitio puede usar cookies técnicas esenciales para el funcionamiento
              correcto de la web. No usamos cookies de seguimiento de terceros ni publicidad
              comportamental.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-paper text-xl tracking-[-0.02em] mb-3">
              5. Tus derechos
            </h2>
            <p>
              Tienes derecho a acceder, corregir o eliminar tu información personal.
              Para cualquier solicitud, escríbenos a{' '}
              <a
                href="mailto:info@nexxodesign.com"
                className="text-accent hover:underline"
              >
                info@nexxodesign.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-paper text-xl tracking-[-0.02em] mb-3">
              6. Cambios a esta política
            </h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Te notificaremos por email si
              eres suscriptor del newsletter. El uso continuado del sitio después de los
              cambios implica aceptación de la nueva política.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-paper text-xl tracking-[-0.02em] mb-3">
              7. Contacto
            </h2>
            <p>
              Para preguntas sobre privacidad:{' '}
              <a href="mailto:info@nexxodesign.com" className="text-accent hover:underline">
                info@nexxodesign.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
