import { sanityClient } from '@/sanity/lib/client'
import { projectsQuery } from '@/sanity/lib/queries'

export const metadata = { title: 'Work' }

// Type matches the projectsQuery projection
type ProjectSummary = {
  _id: string
  title: string
  slug: { current: string }
  client?: string
  year?: number
  tags?: string[]
  metric?: string
  featured?: boolean
}

export default async function WorkPage() {
  // Fetch will use real data once SANITY env vars are set
  let projects: ProjectSummary[] = []
  try {
    projects = await sanityClient.fetch(projectsQuery)
  } catch {
    // Sanity not configured yet — scaffold placeholder
  }

  return (
    <main className="px-6 md:px-16 lg:px-24 pt-40 pb-24">
      <h1 className="font-display text-[clamp(3rem,8vw,7rem)] text-paper leading-[0.9] tracking-tight mb-24">
        Work
      </h1>

      {projects.length === 0 ? (
        <p className="font-mono text-smoke text-xs uppercase tracking-widest">
          Proyectos pendientes de configurar en Sanity CMS ↗
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border-t border-l border-line">
          {projects.map(p => (
            <a
              key={p._id}
              href={`/work/${p.slug.current}`}
              className="border-b border-r border-line p-8 group hover:bg-line/30 transition-colors"
            >
              <span className="font-mono text-smoke text-xs uppercase tracking-widest block mb-4">
                {p.client} · {p.year}
              </span>
              <h2 className="font-display text-3xl text-paper group-hover:text-accent transition-colors">
                {p.title}
              </h2>
              {p.metric && (
                <span className="font-mono text-accent text-xs mt-4 block">{p.metric}</span>
              )}
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
