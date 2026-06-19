import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider'
import './globals.css'

/* ─── Fonts — placeholder Google Fonts; replace with licensed typefaces ─── */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Nexxo — Diseño de producto y web premium',
    template: '%s | Nexxo',
  },
  description:
    'Nexxo es un estudio de diseño de producto y web premium para startups de SaaS, fintech e IA en LatAm e internacionales.',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Nexxo',
  },
}

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
