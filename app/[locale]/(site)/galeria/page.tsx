import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { buildAlternates } from '@/lib/seo'
import { GalleryClient } from '@/components/galeria/GalleryClient'

type Props = { params: Promise<{ locale: string }> }

const TITLE = 'Galería 3D de proyectos — Nexxo'
const DESCRIPTION =
  'Una galería construida con bloques: recorre los proyectos de Nexxo en 3D, abre cada caso y salta al portafolio completo.'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title:       { absolute: TITLE },
    description: DESCRIPTION,
    alternates:  buildAlternates(locale, '/galeria'),
    openGraph: {
      type: 'website', siteName: 'Nexxo', locale: 'es_ES', url: '/galeria',
      title: TITLE, description: DESCRIPTION,
      images: [{ url: '/galeria/og.jpg', width: 1200, height: 627,
                 alt: 'Galería de ladrillos con los proyectos de Nexxo colgados en la pared' }],
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/galeria/og.jpg'] },
  }
}

/** Página para compartir: la galería 3D; cada caso se abre en el pop up de @modal. */
export default async function GaleriaPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <GalleryClient />
}
