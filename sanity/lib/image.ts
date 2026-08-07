import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { sanityClient } from './client'

const builder = imageUrlBuilder(sanityClient)

// For complex transformations (hotspot crop, resize, blur, format)
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ─── urlForImage ──────────────────────────────────────────────────────────────
// Accepts a plain URL string already flattened by GROQ ("url": asset->url).
// Returns the URL as-is with optional width/quality params (no-op on mock nulls).
//
// Production upgrade: if you want server-side transforms instead of GROQ flattening,
// swap the return for: return urlFor(source as SanityImageSource).width(w).quality(q).url()
export function urlForImage(
  url: string | null,
  _opts?: { w?: number; q?: number },
): string | null {
  return url ?? null
}
