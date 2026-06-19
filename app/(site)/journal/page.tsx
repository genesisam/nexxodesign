import { sanityClient } from '@/sanity/lib/client'
import { postsQuery } from '@/sanity/lib/queries'

export const metadata = { title: 'Journal' }

type PostSummary = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  excerpt?: string
  tags?: string[]
}

export default async function JournalPage() {
  let posts: PostSummary[] = []
  try {
    posts = await sanityClient.fetch(postsQuery)
  } catch {
    // Sanity not configured yet
  }

  return (
    <main className="px-6 md:px-16 lg:px-24 pt-40 pb-24">
      <h1 className="font-display text-[clamp(3rem,8vw,7rem)] text-paper leading-[0.9] tracking-tight mb-24">
        Journal
      </h1>

      {posts.length === 0 ? (
        <p className="font-mono text-smoke text-xs uppercase tracking-widest">
          Posts pendientes en Sanity CMS ↗
        </p>
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {posts.map(post => (
            <li key={post._id}>
              <a href={`/journal/${post.slug.current}`} className="flex items-baseline justify-between py-8 group">
                <h2 className="font-display text-2xl text-paper group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <span className="font-mono text-smoke text-xs">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-CO') : '—'}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
