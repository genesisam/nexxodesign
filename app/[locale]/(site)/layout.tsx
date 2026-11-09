import { Nav }    from '@/components/sections/Nav'
import { Footer } from '@/components/sections/Footer'
import { RevealSections } from '@/components/motion/RevealSections'

// No `alternates` here on purpose: metadata fields are inherited wholesale by
// child routes, so a canonical declared at this level would make every page in
// the segment report itself as a duplicate of the home page. Each page builds
// its own via `buildAlternates` in lib/seo.ts.

export default function SiteLayout({
  children, modal,
}: {
  children: React.ReactNode
  /** The parallel slot a case study opens into, empty on every other route. */
  modal:    React.ReactNode
}) {
  return (
    <>
      <Nav />
      {/* Sections enter as they are scrolled to, on every page in the segment.
          It renders nothing; it finds the sections of whatever page is
          mounted. */}
      <RevealSections />
      {children}
      {modal}
      <Footer />
    </>
  )
}
