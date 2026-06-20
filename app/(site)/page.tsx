import { Hero } from '@/components/sections/Hero'
import { SelectedWork } from '@/components/sections/SelectedWork'

export const metadata = {
  title: 'Nexxo — Diseño de producto y web premium',
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SelectedWork />
      {/* §5.2 Logos   — próxima sección */}
      {/* §5.4 Capabilities */}
      {/* §5.5 Process */}
      {/* §5.6 Testimonials */}
      {/* §5.7 Lead magnet */}
    </main>
  )
}
