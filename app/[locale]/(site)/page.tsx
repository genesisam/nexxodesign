import type { Metadata }  from 'next'
import { buildAlternates } from '@/lib/seo'
import { HeroText }       from '@/components/sections/HeroText'
import { StatsBar }       from '@/components/sections/StatsBar'
import { SelectedWork }   from '@/components/sections/SelectedWork'
import { Testimonios }    from '@/components/sections/Testimonios'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    // `absolute` skips the root `%s | Nexxo` template — without it the brand
    // lands twice and the tail of the title gets truncated in the SERP.
    title:       { absolute: 'Nexxo — Automatización con IA & Diseño que genera leads' },
    description: 'Construimos máquinas de generación de leads para startups: diseño premium + automatización con IA + CRO. Pipeline lleno en piloto automático.',
    alternates:  buildAlternates(locale, ''),
  }
}

/**
 * The home, cut to five things: hero, the figures, the work, the clients and
 * the footer the layout already supplies.
 *
 * The sections that came off — services, process, the manifesto, "El sistema",
 * the FAQ and the journal — are untouched components that still render on
 * their own pages. Nothing was deleted, only taken out of the way in.
 */
export default function HomePage() {
  return (
    <main>
      {/* The hero has its own entrance. Everything after it settles in as it
          is scrolled to, handled for the whole site by RevealSections in the
          layout — no wrappers here, and no section left out by accident. */}
      <HeroText />
      <StatsBar />
      <SelectedWork />
      <Testimonios />
    </main>
  )
}
