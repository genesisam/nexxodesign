import type { Metadata }  from 'next'
import { buildAlternates } from '@/lib/seo'
import { HeroText }       from '@/components/sections/HeroText'
import { StatsBar }       from '@/components/sections/StatsBar'
import { Capabilities }   from '@/components/sections/Capabilities'
import { SelectedWork }   from '@/components/sections/SelectedWork'
import { Testimonios }    from '@/components/sections/Testimonios'
import { ProcesoSection } from '@/components/sections/ProcesoSection'
import { Statement }      from '@/components/sections/Statement'
import { Transformacion } from '@/components/sections/Transformacion'
import { FusionReel }     from '@/components/sections/FusionReelWrapper'
import { FAQSection }     from '@/components/sections/FAQSection'
import { Journal }        from '@/components/sections/Journal'

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

export default function HomePage() {
  return (
    <main>
      <HeroText />
      <StatsBar />
      <Capabilities />
      <SelectedWork />
      <Testimonios />
      <ProcesoSection />
      <Statement />
      <Transformacion />
      <FusionReel />
      <FAQSection />
      <Journal />
    </main>
  )
}
