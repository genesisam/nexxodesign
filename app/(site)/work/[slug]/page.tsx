import { notFound } from 'next/navigation'
import { sanityClient } from '@/sanity/lib/client'
import { projectBySlugQuery, projectsQuery } from '@/sanity/lib/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const projects = await sanityClient.fetch<{ slug: { current: string } }[]>(
      projectsQuery,
    )
    return projects.map(p => ({ slug: p.slug.current }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const project = await sanityClient.fetch<{ title: string } | null>(
      projectBySlugQuery,
      { slug },
    )
    return { title: project?.title ?? 'Proyecto' }
  } catch {
    return { title: 'Proyecto' }
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  let project: { _id: string; title: string; client?: string; year?: number; metric?: string; excerpt?: string } | null = null

  try {
    project = await sanityClient.fetch(projectBySlugQuery, { slug })
  } catch {
    // Sanity not configured yet
  }

  if (!project) notFound()

  return (
    <main className="px-6 md:px-16 lg:px-24 pt-40 pb-24">
      <span className="font-mono text-smoke text-xs uppercase tracking-widest block mb-8">
        {project.client} · {project.year}
      </span>
      <h1 className="font-display text-[clamp(3rem,8vw,7rem)] text-paper leading-[0.9] tracking-tight mb-8">
        {project.title}
      </h1>
      {project.metric && (
        <p className="font-mono text-accent text-sm mb-8">{project.metric}</p>
      )}
      {project.excerpt && (
        <p className="font-body text-smoke text-xl max-w-2xl leading-relaxed">{project.excerpt}</p>
      )}
      {/* Body blocks go here once a PortableText renderer is wired */}
    </main>
  )
}
