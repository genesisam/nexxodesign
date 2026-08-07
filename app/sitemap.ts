import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/seo'
import { getAllPostSlugs } from '@/sanity/lib/post-data'
import { getAllProjectSlugs } from '@/sanity/lib/project-data'

function localized(path: string, freq: MetadataRoute.Sitemap[number]['changeFrequency'], priority: number): MetadataRoute.Sitemap {
  return routing.locales.map(locale => ({
    url:             absoluteUrl(locale, path),
    lastModified:    new Date(),
    changeFrequency: freq,
    priority,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Both helpers fall back to the local mocks if Sanity is unreachable, so the
  // sitemap degrades to the known set rather than losing the entries entirely.
  const [postSlugs, projectSlugs] = await Promise.all([
    getAllPostSlugs(),
    getAllProjectSlugs(),
  ])

  return [
    ...localized('',            'monthly', 1.0),
    ...localized('/proyectos',  'weekly',  0.9),
    ...localized('/nosotros',   'monthly', 0.8),
    ...localized('/contact',    'monthly', 0.8),
    ...localized('/journal',    'weekly',  0.7),
    ...projectSlugs.flatMap(slug => localized(`/proyectos/${slug}`, 'monthly', 0.7)),
    ...postSlugs.flatMap(slug => localized(`/journal/${slug}`,      'monthly', 0.6)),
    ...localized('/soporte',    'yearly',  0.3),
    ...localized('/privacidad', 'yearly',  0.2),
  ]
}
