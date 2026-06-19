// Embedded Sanity Studio — available at /studio
// Needs NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local before it renders.
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
