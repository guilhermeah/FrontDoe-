interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []

  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) pages.push(i)
  } else {
    pages.push(0)
    if (page > 3) pages.push('...')
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) pages.push(i)
    if (page < totalPages - 4) pages.push('...')
    pages.push(totalPages - 1)
  }

  const btn = (content: React.ReactNode, target: number, disabled: boolean, active = false) => (
    <button
      key={String(content) + target}
      onClick={() => !disabled && onChange(target)}
      disabled={disabled}
      style={{
        minWidth: 36,
        height: 36,
        border: active ? '2px solid #6C63FF' : '1px solid rgba(108,99,255,0.25)',
        borderRadius: 8,
        background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
        color: active ? '#6C63FF' : 'var(--text-muted)',
        fontWeight: active ? 700 : 400,
        fontSize: '0.875rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s',
        padding: '0 8px',
      }}
      onMouseEnter={(e) => { if (!disabled && !active) (e.currentTarget as HTMLButtonElement).style.borderColor = '#6C63FF' }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(108,99,255,0.25)' }}
    >
      {content}
    </button>
  )

  return (
    <div className="d-flex align-items-center justify-content-center gap-1 mt-5">
      {btn(<i className="bi bi-chevron-left" />, page - 1, page === 0)}
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
          : btn(p + 1, p as number, false, p === page)
      )}
      {btn(<i className="bi bi-chevron-right" />, page + 1, page === totalPages - 1)}
    </div>
  )
}
