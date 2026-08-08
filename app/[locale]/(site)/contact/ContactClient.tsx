'use client'

import { useState, useRef, useCallback } from 'react'
import { ProjectEstimator, type EstimateValue } from '@/components/contact/ProjectEstimator'
import { ContactForm, ContactChannels } from './ContactForm'

// The estimator prices a web build — pages, CMS, redesign — which undersells
// what Nexxo actually sells: design plus automation plus the full funnel.
// Hidden rather than deleted, so the flag flips back once it is reframed.
// The form keeps working without it: `estimateSummary` is optional.
const SHOW_ESTIMATOR = false

export function ContactClient() {
  const [estimate, setEstimate] = useState<EstimateValue | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleEstimateChange = useCallback((est: EstimateValue) => {
    setEstimate(est)
  }, [])

  function handleCtaClick() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* ── Estimador ────────────────────────────────────────────────────────── */}
      {SHOW_ESTIMATOR && (
        <section className="px-6 md:px-16 lg:px-24 py-16 md:py-20 border-b border-paper/10">
          <ProjectEstimator
            onEstimateChange={handleEstimateChange}
            onCtaClick={handleCtaClick}
          />
        </section>
      )}

      {/* ── Formulario + canales ─────────────────────────────────────────────── */}
      <section ref={formRef} id="contact-form" className="px-6 md:px-16 lg:px-24 py-16 md:py-24">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 lg:gap-24 items-start">
          <ContactForm estimateSummary={estimate} />
          <ContactChannels />
        </div>
      </section>
    </>
  )
}
