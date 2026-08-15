import type { Metadata, Viewport } from 'next'
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import { Preloader }    from '@/components/motion/Preloader'
import { CustomCursor } from '@/components/motion/CustomCursor'
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider'
import { Analytics }     from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-body',
  display:  'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets:  ['latin'],
  weight:   ['400', '500'],
  variable: '--font-mono',
  display:  'swap',
})

import { SITE_URL, NOINDEX } from '@/lib/seo'

export const metadata: Metadata = {
  title: {
    default:  'Nexxo — Automatización con IA & Diseño que genera leads',
    template: '%s | Nexxo',
  },
  description:
    'Construimos máquinas de generación de leads para startups: diseño premium + automatización con IA + CRO. Pipeline lleno en piloto automático. SaaS, fintech e IA en LatAm.',
  metadataBase: new URL(SITE_URL),
  // Inherited by every page — none of them override `robots`.
  ...(NOINDEX && {
    robots: {
      index: false, follow: false,
      googleBot: { index: false, follow: false },
    },
  }),
  openGraph: {
    type:     'website',
    siteName: 'Nexxo',
    locale:   'es_CO',
    alternateLocale: ['en_US'],
    images:   [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Nexxo Design' }],
  },
  twitter: {
    card:    'summary_large_image',
    creator: '@alexmorenop',
    images:  ['/opengraph-image'],
  },
}

// E-E-A-T leans hardest on a named, linkable human. Declared once here and
// referenced by @id from the organisation so both nodes resolve to one entity.
const founderJsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Person',
  '@id':      `${SITE_URL}/#founder`,
  name:       'Alexander Moreno',
  jobTitle:   'Senior UI/UX Designer · Fundador de Nexxo',
  url:        `${SITE_URL}/nosotros`,
  worksFor:   { '@id': `${SITE_URL}/#organization` },
  knowsAbout: [
    'Diseño de producto', 'UX/UI', 'Automatización con IA',
    'CRO', 'Generación de leads', 'Next.js',
  ],
  sameAs: [
    'https://www.linkedin.com/in/alexander-moreno-gp/',
    'https://www.behance.net/alexander-moreno',
    'https://www.instagram.com/alex.morenop/',
  ],
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type':    ['Organization', 'ProfessionalService'],
  '@id':      `${SITE_URL}/#organization`,
  founder:    { '@id': `${SITE_URL}/#founder` },
  name:       'Nexxo',
  url:        SITE_URL,
  logo:       `${SITE_URL}/opengraph-image`,
  description: 'Estudio especializado en automatización con IA, generación de leads y diseño de producto premium para startups SaaS, fintech e IA en LatAm.',
  knowsAbout: [
    'Automatización con IA', 'Generación de leads', 'Diseño de producto SaaS',
    'CRO', 'UI/UX', 'Next.js', 'Sanity CMS', 'Growth design',
  ],
  areaServed: ['CO', 'MX', 'AR', 'CL', 'PE', 'US'],
  sameAs: [
    'https://www.instagram.com/alex.morenop/',
    'https://www.linkedin.com/in/alexander-moreno-gp/',
    'https://www.behance.net/alexander-moreno',
  ],
  contactPoint: {
    '@type':           'ContactPoint',
    telephone:         '+573183795352',
    contactType:       'sales',
    areaServed:        ['CO', 'LATAM'],
    availableLanguage: ['Spanish', 'English'],
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type':    'WebSite',
  name:       'Nexxo',
  url:        SITE_URL,
  potentialAction: {
    '@type':       'SearchAction',
    target:        `${SITE_URL}/proyectos?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

// Answer engines quote definitions far more readily than marketing claims.
// These are the three terms a prospect most often arrives without.
const glossaryJsonLd = {
  '@context': 'https://schema.org',
  '@type':    'DefinedTermSet',
  name:       'Glosario Nexxo',
  hasDefinedTerm: [
    {
      '@type': 'DefinedTerm',
      name: 'Máquina de generación de leads',
      description: 'Sistema que combina una landing optimizada para conversión, workflows de automatización y un CRM conectado, de modo que cada visitante interesado se captura, se califica y se asigna sin intervención manual.',
    },
    {
      '@type': 'DefinedTerm',
      name: 'CRO (Conversion Rate Optimization)',
      description: 'Disciplina que aumenta el porcentaje de visitantes que completan una acción de negocio, mediante investigación, jerarquía visual, reducción de fricción y medición continua — no mediante cambios estéticos.',
    },
    {
      '@type': 'DefinedTerm',
      name: 'Nurturing automático',
      description: 'Secuencia de mensajes que educa a un prospecto a lo largo del tiempo hasta que está listo para comprar, disparada por su comportamiento y ejecutada sin que nadie escriba cada correo.',
    },
  ],
}

const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type':    'OfferCatalog',
  name:       'Servicios de Nexxo',
  provider:   { '@id': `${SITE_URL}/#organization` },
  itemListElement: [
    ['Máquina de generación de leads', 'Landing de conversión, automatización y CRM conectados en un solo sistema.'],
    ['Automatización con IA',          'Workflows que responden, califican y hacen seguimiento 24/7.'],
    ['Diseño de producto SaaS',        'Interfaces que reducen el abandono en el onboarding y suben la activación.'],
    ['Brand & web premium',            'Identidad y sitio construidos para convertir, con CRO y SEO técnico desde el inicio.'],
  ].map(([name, description]) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name, description, provider: { '@id': `${SITE_URL}/#organization` } },
  })),
}

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const locale      = headersList.get('x-locale') ?? 'es'

  return (
    <html
      lang={locale}
      className={`${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        {/* Runs before the curtain markup below is parsed, so a returning
            visitor never sees it flash. Deciding this after hydration would
            mean showing the hero and then covering it. */}
        <script
          dangerouslySetInnerHTML={{ __html: `(function(){try{
            var seen=sessionStorage.getItem('nexxo:intro');
            var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
            var studio=location.pathname.indexOf('/studio')===0;
            if(seen||still||studio)document.documentElement.dataset.intro='skip';
          }catch(e){}})();` }}
        />

        <Preloader />
        <CustomCursor />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }} />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>

        {/* Both serve their script and post their beacons from this same
            origin under /_vercel, so the strict CSP in middleware.ts needs
            no third-party allowance — and an ad blocker has nothing
            cross-origin to block. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
