import { Nav }    from '@/components/sections/Nav'
import { Footer } from '@/components/sections/Footer'
import { RevealSections } from '@/components/motion/RevealSections'
import { CursorVariant } from '@/components/motion/CursorVariant'

// No `alternates` here on purpose: metadata fields are inherited wholesale by
// child routes, so a canonical declared at this level would make every page in
// the segment report itself as a duplicate of the home page. Each page builds
// its own via `buildAlternates` in lib/seo.ts.

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav />
      {/* La mano de bloques, en todo el sitio. Estaba montada solo en
          /nosotros, así que el puntero cambiaba al pasar de una página a
          otra. Aquí se monta una vez para el segmento entero. */}
      <CursorVariant variant="lego" />
      {/* Sections enter as they are scrolled to, on every page in the segment.
          It renders nothing; it finds the sections of whatever page is
          mounted. */}
      <RevealSections />
      {children}
      <Footer />
    </>
  )
}
