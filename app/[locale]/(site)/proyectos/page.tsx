import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buildAlternates } from '@/lib/seo'
import { WorkIndex } from '@/components/sections/WorkIndex'
import type { Project } from '@/components/sections/WorkIndex'
import { sanityClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

type Props = { params: Promise<{ locale: string }> }

const projectsQuery = groq`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    vertical,
    year,
    client,
    "blurb": coalesce(excerpt, ""),
    "cover": coverImage.asset->url,
    "thumbnail": null,
    "thumbVideo": null
  }
`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'work.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  buildAlternates(locale, '/proyectos'),
  }
}

export default async function WorkPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  let projects: Project[] | undefined
  try {
    const rows = await sanityClient.fetch<Project[]>(projectsQuery)
    if (rows?.length) projects = rows
  } catch {
    // Falls back to mock data inside WorkIndex
  }

  return <WorkIndex projects={projects} />
}
