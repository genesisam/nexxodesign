import type { MetadataRoute } from 'next'

import { SITE_URL as BASE, NOINDEX } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  // Soft launch: keep crawlers out entirely and don't advertise the sitemap.
  if (NOINDEX) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
