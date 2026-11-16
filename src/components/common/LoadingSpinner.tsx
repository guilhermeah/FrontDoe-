interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ size = 'md', text, fullScreen }: Props) {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? '' : ''
  const spinnerSize = size === 'lg' ? '3rem' : size === 'md' ? '2rem' : '1rem'

  if (fullScreen) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div
          className={`spinner-border text-primary ${sizeClass}`}
          style={{ width: spinnerSize, height: spinnerSize }}
          role="status"
        >
          <span className="visually-hidden">Carregando...</span>
        </div>
        {text && <p className="mt-3 text-muted">{text}</p>}
      </div>
    )
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div
        className={`spinner-border text-primary ${sizeClass}`}
        style={{ width: spinnerSize, height: spinnerSize }}
        role="status"
      >
        <span className="visually-hidden">Carregando...</span>
      </div>
      {text && <p className="mt-2 text-muted small">{text}</p>}
    </div>
  )
}
