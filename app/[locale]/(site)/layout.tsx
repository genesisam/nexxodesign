import { Nav }    from '@/components/sections/Nav'
import { Footer } from '@/components/sections/Footer'
import { RevealSections } from '@/components/motion/RevealSections'
import { CursorVariant } from '@/components/motion/CursorVariant'

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
      {/* WCAG 2.4.1. Five links and a CTA sit before the content on every page.
          Off-screen until focused, then it lands in the top-left corner.
          The target is declared below rather than on each page's own <main>
          because a case study opened as a modal puts two <main> elements in one
          document, and two elements cannot share an id. */}
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido
      </a>

      <Nav />
      {/* La mano de bloques, en todo el sitio. Estaba montada solo en
          /nosotros, así que el puntero cambiaba al pasar de una página a
          otra. Aquí se monta una vez para el segmento entero. */}
      <CursorVariant variant="lego" />
      {/* Sections enter as they are scrolled to, on every page in the segment.
          It renders nothing; it finds the sections of whatever page is
          mounted. */}
      <RevealSections />
      {/* `tabIndex={-1}` so the skip link actually moves focus here: a fragment
          jump to a non-focusable element only scrolls, in some browsers. */}
      <div id="contenido-principal" tabIndex={-1}>
        {children}
      </div>
      {modal}
      <Footer />
    </>
  )
}
