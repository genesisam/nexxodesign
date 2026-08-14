export default function Loading() {
  return (
    <div className="min-h-screen bg-ink gutter-x pt-24 md:pt-28">
      {/* Eyebrow */}
      <div className="skeleton h-3 w-40 rounded-sm mb-[8vh]" />

      {/* Headline */}
      <div className="space-y-3 mt-[2vh]">
        <div className="skeleton h-16 md:h-24 lg:h-32 w-5/6 rounded-sm" />
        <div className="skeleton h-16 md:h-24 lg:h-32 w-3/5 rounded-sm" />
      </div>

      {/* Sub-row */}
      <div className="mt-16 flex flex-col sm:flex-row gap-5">
        <div className="skeleton h-4 w-64 rounded-sm" />
        <div className="skeleton h-10 w-36 rounded-sm sm:ml-auto" />
      </div>
    </div>
  )
}
