import type { NextConfig } from 'next'
import path from 'path'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'image.mux.com' },
    ],
  },
  // /links es una página estática aparte (public/links), el "link in bio" de
  // redes. No está enlazada desde el sitio ni figura en el sitemap.
  async rewrites() {
    return {
      beforeFiles: [{ source: '/links', destination: '/links/index.html' }],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default withNextIntl(nextConfig)
