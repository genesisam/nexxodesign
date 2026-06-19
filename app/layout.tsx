import type { Metadata, Viewport } from 'next'
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider'
import './globals.css'

// ─── Clash Display ──────────────────────────────────────────────────────────
// Loaded via Fontshare CDN in globals.css (@import url(...)).
// --font-display CSS var is set directly in :root → tailwind font-display works.
//
// TO SELF-HOST FOR PRODUCTION:
// 1. Download .woff2 files from fontshare.com/fonts/clash-display
// 2. Place in /public/fonts/ClashDisplay/ (see filenames in the old localFont block)
// 3. Uncomment the block below, remove the @import from globals.css
//
// import localFont from 'next/font/local'
// const clashDisplay = localFont({
//   src: [
//     { path: '../public/fonts/ClashDisplay/ClashDisplay-Regular.woff2',  weight: '400' },
//     { path: '../public/fonts/ClashDisplay/ClashDisplay-Medium.woff2',   weight: '500' },
//     { path: '../public/fonts/ClashDisplay/ClashDisplay-Semibold.woff2', weight: '600' },
//     { path: '../public/fonts/ClashDisplay/ClashDisplay-Bold.woff2',     weight: '700' },
//   ],
//   variable: '--font-display',
//   display: 'swap',
// })

// ─── DM Sans — body copy ────────────────────────────────────────────────────
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// ─── IBM Plex Mono — utility / mono ─────────────────────────────────────────
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
      className={`${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
