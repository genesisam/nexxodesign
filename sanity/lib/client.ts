import { createClient } from '@sanity/client'

// projectId must be a non-empty string or @sanity/client throws at module init.
// The 'not-configured' placeholder lets the module load; fetches will fail and
// be caught in the calling code until a real projectId is set in .env.local.
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'not-configured',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_READ_TOKEN,
})
