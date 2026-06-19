import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from './constants'

type SeoProps = {
  title: string
  description?: string
  image?: string
  noIndex?: boolean
}

export function buildMetadata({ title, description, image, noIndex }: SeoProps): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const ogImage = image ?? `${SITE_URL}/og.png`

  return {
    title: fullTitle,
    description,
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  }
}
