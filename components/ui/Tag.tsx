// Stub — taxonomy tags for project / capability labels
type TagProps = {
  children: React.ReactNode
  className?: string
}

export function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-block font-mono text-[10px] uppercase tracking-widest text-smoke border border-line px-3 py-1 ${className}`}
    >
      {children}
    </span>
  )
}
