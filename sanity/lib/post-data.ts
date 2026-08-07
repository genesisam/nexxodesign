import { MOCK_POSTS } from '@/sanity/mock/posts'
import type { Post, PostSummary } from '@/types/post'

// ─── Single swap-point ────────────────────────────────────────────────────────
// Mock active. To go live:
//   1. npm i next-sanity
//   2. Set NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET in .env.local
//   3. Comment out mock returns, uncomment Sanity fetches below.

// import { sanityClient }                                from '@/sanity/lib/client'
// import { postsQuery, postBySlugQuery, allPostSlugsQuery } from '@/sanity/lib/queries'

export async function getAllPosts(): Promise<PostSummary[]> {
  // return sanityClient.fetch<PostSummary[]>(postsQuery)
  return MOCK_POSTS
    .map(({ body: _b, author: _a, ...summary }) => summary)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // return sanityClient.fetch<Post | null>(postBySlugQuery, { slug })
  return MOCK_POSTS.find(p => p.slug.current === slug) ?? null
}

export async function getAllPostSlugs(): Promise<string[]> {
  // const posts = await sanityClient.fetch<{ slug: { current: string } }[]>(allPostSlugsQuery)
  // return posts.map(p => p.slug.current)
  return MOCK_POSTS.map(p => p.slug.current)
}
