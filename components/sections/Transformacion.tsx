'use client'

import dynamic from 'next/dynamic'

const TransformacionInner = dynamic(
  () => import('./TransformacionInner'),
  {
    ssr: false,
    loading: () => <div className="h-[500vh] w-full bg-ink" />,
  },
)

export function Transformacion() {
  return <TransformacionInner />
}
