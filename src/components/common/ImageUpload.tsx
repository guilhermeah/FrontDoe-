import { useRef, useState } from 'react'

interface Props {
  currentUrl?: string
  onFileSelect: (file: File) => void
  isUploading?: boolean
  shape?: 'circle' | 'rect'
  label?: string
}

export function ImageUpload({ currentUrl, onFileSelect, isUploading, shape = 'circle', label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)

  const displayUrl = localPreview || (!imgError ? currentUrl : undefined)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLocalPreview(URL.createObjectURL(file))
    setImgError(false)
    onFileSelect(file)
    e.target.value = ''
  }

  const isCircle = shape === 'circle'
  const width = isCircle ? 88 : 200
  const height = isCircle ? 88 : 130

  return (
    <div className="d-flex flex-column align-items-center gap-2">
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        style={{
          width,
          height,
          borderRadius: isCircle ? '50%' : 12,
          background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
          cursor: isUploading ? 'wait' : 'pointer',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          border: '2px solid rgba(108,99,255,0.4)',
          flexShrink: 0,
        }}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="foto"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => { setImgError(true); setLocalPreview(null) }}
          />
        ) : (
          <i
            className={`bi ${isCircle ? 'bi-person-fill' : 'bi-image'} text-white`}
            style={{ fontSize: isCircle ? '2.2rem' : '3rem' }}
          />
        )}

        {isUploading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="spinner-border spinner-border-sm text-white" />
          </div>
        )}

        {!isUploading && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.45)', textAlign: 'center', padding: '3px 0', fontSize: '0.65rem', color: 'white' }}>
            <i className="bi bi-camera-fill me-1" />Alterar
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      {label && (
        <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{label}</small>
      )}
    </div>
  )
}
