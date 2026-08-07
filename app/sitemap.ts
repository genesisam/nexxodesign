import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/seo'
import { getAllPostSlugs } from '@/sanity/lib/post-data'

const PROJECT_SLUGS = ['solivus', 'merxo', 'nexo-go', 'greenery-420', 'maison-oliva', 'tolvia']

function localized(path: string, freq: MetadataRoute.Sitemap[number]['changeFrequency'], priority: number): MetadataRoute.Sitemap {
  return routing.locales.map(locale => ({
    url:             absoluteUrl(locale, path),
    lastModified:    new Date(),
    changeFrequency: freq,
    priority,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postSlugs = await getAllPostSlugs()

  return [
    ...localized('',           'monthly', 1.0),
    ...localized('/proyectos', 'weekly',  0.9),
    ...localized('/nosotros',  'monthly', 0.8),
    ...localized('/contact',   'monthly', 0.8),
    ...localized('/journal',   'weekly',  0.7),
    ...PROJECT_SLUGS.flatMap(slug => localized(`/proyectos/${slug}`, 'monthly', 0.7)),
    ...postSlugs.flatMap(slug => localized(`/journal/${slug}`, 'monthly', 0.6)),
  ]
}
