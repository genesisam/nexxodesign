'use client'

import dynamic from 'next/dynamic'

const FusionReel = dynamic(
  () => import('./FusionReel').then(m => ({ default: m.FusionReel })),
  { ssr: false, loading: () => <div className="h-screen w-full bg-ink" /> }
)

export { FusionReel }
