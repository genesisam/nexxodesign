import { Nav }    from '@/components/sections/Nav'
import { Footer } from '@/components/sections/Footer'

// No `alternates` here on purpose: metadata fields are inherited wholesale by
// child routes, so a canonical declared at this level would make every page in
// the segment report itself as a duplicate of the home page. Each page builds
// its own via `buildAlternates` in lib/seo.ts.

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}
