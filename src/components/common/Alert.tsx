interface Props {
  type: 'success' | 'danger' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

export function Alert({ type, message, onClose }: Props) {
  const icons: Record<string, string> = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
  }

  return (
    <div className={`alert alert-${type} d-flex align-items-center gap-2 animate-fadeInUp`} role="alert">
      <i className={`bi ${icons[type]}`} />
      <span className="flex-grow-1">{message}</span>
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose} />
      )}
    </div>
  )
}
