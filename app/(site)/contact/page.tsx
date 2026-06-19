export const metadata = { title: 'Contacto' }

export default function ContactPage() {
  return (
    <main className="px-6 md:px-16 lg:px-24 pt-40 pb-24">
      <span className="font-mono text-smoke text-xs uppercase tracking-widest block mb-8">
        Hablemos
      </span>
      <h1 className="font-display text-[clamp(3rem,8vw,7rem)] text-paper leading-[0.9] tracking-tight mb-16">
        Cotiza tu<br />proyecto
      </h1>

      {/* CTA buttons — wire Calendly or WhatsApp link */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#calendly"
          className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest bg-accent text-paper px-8 py-4 hover:bg-accent/90 transition-colors"
        >
          Agendar llamada
        </a>
        <a
          href="https://wa.me/57XXXXXXXXXX"
          className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest border border-line text-smoke px-8 py-4 hover:border-smoke hover:text-paper transition-colors"
        >
          WhatsApp
        </a>
      </div>
    </main>
  )
}
