import { MOCK_POSTS } from '@/sanity/mock/posts'
import { sanityClient } from '@/sanity/lib/client'
import { postsQuery, postBySlugQuery, allPostSlugsQuery } from '@/sanity/lib/queries'
import type { Post, PostSummary } from '@/types/post'

/**
 * The journal reads the CMS now, with the fixtures kept as a fallback.
 *
 * Same shape as project-data: try Sanity, and drop to the bundled posts if it
 * returns nothing or throws. That keeps the section alive while the dataset is
 * still filling up, and it means an unreachable CMS degrades to slightly stale
 * articles instead of an empty page.
 *
 * Sorting is done here rather than trusted from either source, so the two paths
 * can never disagree about what "latest" means.
 */

const byNewest = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()

const mockSummaries = (): PostSummary[] =>
  MOCK_POSTS.map(({ body: _b, author: _a, ...summary }) => summary).sort(byNewest)

export async function getAllPosts(): Promise<PostSummary[]> {
  try {
    const rows = await sanityClient.fetch<PostSummary[]>(postsQuery)
    if (rows?.length) return [...rows].sort(byNewest)
  } catch {
    // Sanity unreachable — the fixtures still cover every rendered page.
  }
  return mockSummaries()
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const row = await sanityClient.fetch<Post | null>(postBySlugQuery, { slug })
    if (row) return row
  } catch {
    // fall through
  }
  return MOCK_POSTS.find(p => p.slug.current === slug) ?? null
}

/**
 * Union of both sources, deduped. A post that exists only in the fixtures still
 * gets prerendered and listed in the sitemap; returning the CMS slugs alone
 * would leave those pages reachable but never advertised.
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const mock = MOCK_POSTS.map(p => p.slug.current)

  let cms: string[] = []
  try {
    const rows = await sanityClient.fetch<{ slug: string }[]>(allPostSlugsQuery)
    cms = rows?.map(r => r.slug).filter(Boolean) ?? []
  } catch {
    // fall through
  }

  return [...new Set([...cms, ...mock])]
}
