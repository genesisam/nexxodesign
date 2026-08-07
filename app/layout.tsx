import type { Metadata, Viewport } from 'next'
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider'
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
    images:   [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Nexxo Design' }],
  },
  twitter: {
    card:   'summary_large_image',
    images: ['/opengraph-image'],
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type':    ['Organization', 'ProfessionalService'],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
