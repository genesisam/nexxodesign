// About Nexxo / Alexander Moreno — founder page.
// NOTE: CLAUDE.md §4 labels this /(site)/studio/page.tsx but that URL
// conflicts with the embedded Sanity Studio at /studio. Renamed to /nosotros.
// If you need /about or /estudio instead, rename this folder.
export const metadata = { title: 'Nosotros' }

export default function NosotrosPage() {
  return (
    <main className="px-6 md:px-16 lg:px-24 pt-40 pb-24 max-w-4xl">
      <span className="font-mono text-smoke text-xs uppercase tracking-widest block mb-8">
        El estudio
      </span>
      <h1 className="font-display text-[clamp(3rem,8vw,7rem)] text-paper leading-[0.9] tracking-tight mb-16">
        Nexxo
      </h1>
      <p className="font-body text-smoke text-xl leading-relaxed">
        {/* Founder copy goes here — Alexander art-directs this */}
        Contenido pendiente.
      </p>
    </main>
  )
}
