interface Props {
  width?: string
  height?: string
  className?: string
  count?: number
}

export function SkeletonLine({ width = '100%', height = '1rem', className = '' }: Props) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: '4px' }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: '200px' }} />
      <div className="card-body p-3">
        <SkeletonLine height="1.2rem" className="mb-2" />
        <SkeletonLine width="60%" height="0.9rem" className="mb-3" />
        <SkeletonLine height="0.8rem" className="mb-1" />
        <SkeletonLine height="0.8rem" className="mb-3" />
        <SkeletonLine height="8px" className="mb-2" />
        <div className="d-flex justify-content-between">
          <SkeletonLine width="40%" height="0.8rem" />
          <SkeletonLine width="30%" height="0.8rem" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="d-flex gap-3 mb-3 align-items-center">
          <SkeletonLine width="40px" height="40px" className="rounded-circle flex-shrink-0" />
          <div className="flex-grow-1">
            <SkeletonLine height="0.9rem" className="mb-1" />
            <SkeletonLine width="50%" height="0.75rem" />
          </div>
          <SkeletonLine width="80px" height="0.9rem" />
        </div>
      ))}
    </div>
  )
}
