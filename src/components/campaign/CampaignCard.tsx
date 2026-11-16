import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Campanha } from '../../types/campaign.types'
import { formatCurrency, formatPercent, truncateText, getCategoryLabel, getCategoryIcon, getStatusColor, getStatusLabel } from '../../utils/formatters'

interface Props {
  campanha: Campanha
  showActions?: boolean
  onEdit?: (campanha: Campanha) => void
  onDelete?: (campanha: Campanha) => void
  onEncerrar?: (campanha: Campanha) => void
}

export function CampaignCard({ campanha, showActions, onEdit, onDelete, onEncerrar }: Props) {
  const percent = Math.min(formatPercent(campanha.valorArrecadado || 0, campanha.metaFinanceira), 100)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="campaign-card card border-0 h-100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)' }}
    >
      {/* Thumbnail */}
      <div className="position-relative" style={{ overflow: 'hidden' }}>
        <img
          src={campanha.imagemUrl || `https://picsum.photos/seed/${campanha.id}/600/300`}
          className="card-img-top"
          alt={campanha.titulo}
          style={{
            height: 192,
            objectFit: 'cover',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = '1'
              e.currentTarget.src = `https://picsum.photos/seed/${campanha.id}/600/300`
            }
          }}
        />
        {/* Status badge */}
        <div className="position-absolute top-0 end-0 p-2">
          <span
            className={`badge bg-${getStatusColor(campanha.status)}`}
            style={{ fontSize: '0.68rem', borderRadius: 20, padding: '0.3rem 0.65rem', fontWeight: 600, letterSpacing: '0.02em' }}
          >
            {getStatusLabel(campanha.status)}
          </span>
        </div>
        {/* Category badge */}
        <div className="position-absolute bottom-0 start-0 p-2">
          <span
            className="badge"
            style={{ background: 'rgba(108,99,255,0.85)', fontSize: '0.68rem', borderRadius: 20, padding: '0.3rem 0.65rem', backdropFilter: 'blur(8px)' }}
          >
            <i className={`bi ${getCategoryIcon(campanha.categoria)} me-1`} />
            {getCategoryLabel(campanha.categoria)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="card-body d-flex flex-column" style={{ padding: '1.125rem' }}>
        <h6 className="fw-bold mb-1 lh-sm" style={{ fontSize: '0.925rem' }}>{campanha.titulo}</h6>

        {campanha.ongNome && (
          <small className="d-flex align-items-center gap-1 mb-2" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <i className="bi bi-building" style={{ fontSize: '0.7rem' }} />
            {campanha.ongNome}
          </small>
        )}

        <p className="mb-3 flex-grow-1" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.55 }}>
          {truncateText(campanha.descricao, 90)}
        </p>

        {/* Progress */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Progresso</small>
            <small className="fw-bold" style={{ color: '#43D9A2', fontSize: '0.75rem' }}>{percent}%</small>
          </div>
          <div className="progress progress-custom" style={{ height: 6 }}>
            <div
              className="progress-bar"
              style={{ width: `${percent}%`, transition: 'width 1s ease' }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="d-flex justify-content-between align-items-end mb-3">
          <div>
            <div className="fw-bold" style={{ color: '#43D9A2', fontSize: '0.95rem', lineHeight: 1 }}>
              {formatCurrency(campanha.valorArrecadado || 0)}
            </div>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>de {formatCurrency(campanha.metaFinanceira)}</small>
          </div>
          {campanha.quantidadeDoadores !== undefined && (
            <div className="text-end">
              <div className="fw-bold" style={{ fontSize: '0.9rem', lineHeight: 1 }}>{campanha.quantidadeDoadores}</div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>doadores</small>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions ? (
          <div className="d-flex gap-2">
            <Link to={`/campanhas/${campanha.id}`} className="btn btn-sm btn-outline-primary flex-grow-1" style={{ borderRadius: 8, fontSize: '0.8rem' }}>
              <i className="bi bi-eye me-1" />Ver
            </Link>
            {onEdit && (
              <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8 }} onClick={() => onEdit(campanha)}>
                <i className="bi bi-pencil" />
              </button>
            )}
            {onEncerrar && campanha.status === 'ATIVA' && (
              <button className="btn btn-sm btn-outline-warning" style={{ borderRadius: 8 }} onClick={() => onEncerrar(campanha)}>
                <i className="bi bi-stop-circle" />
              </button>
            )}
            {onDelete && (
              <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 8 }} onClick={() => onDelete(campanha)}>
                <i className="bi bi-trash" />
              </button>
            )}
          </div>
        ) : (
          <Link to={`/campanhas/${campanha.id}`} className="btn btn-primary-custom w-100" style={{ fontSize: '0.875rem' }}>
            Ver Campanha
          </Link>
        )}
      </div>
    </div>
  )
}
