import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider'
import './globals.css'

// ─── Clash Display — download from fontshare.com/fonts/clash-display ───────
// Place the .woff2 files in /public/fonts/ClashDisplay/ with these exact names:
//   ClashDisplay-Regular.woff2
//   ClashDisplay-Medium.woff2
//   ClashDisplay-Semibold.woff2
//   ClashDisplay-Bold.woff2
// Until the files are present, the CSS fallback (sans-serif) is used silently.
const clashDisplay = localFont({
  src: [
    { path: '../public/fonts/ClashDisplay/ClashDisplay-Regular.woff2',  weight: '400', style: 'normal' },
    { path: '../public/fonts/ClashDisplay/ClashDisplay-Medium.woff2',   weight: '500', style: 'normal' },
    { path: '../public/fonts/ClashDisplay/ClashDisplay-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/ClashDisplay/ClashDisplay-Bold.woff2',     weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

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
      className={`${clashDisplay.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
