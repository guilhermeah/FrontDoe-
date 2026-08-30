import { Link } from 'react-router-dom'
import { Campanha } from '../../types/campaign.types'
import { formatCurrency, formatPercent, truncateText, getCategoryLabel, getCategoryIcon, getStatusColor, getStatusLabel } from '../../utils/formatters'

interface Props {
  campanha: Campanha
  showActions?: boolean
  onEdit?: (campanha: Campanha) => void
  onDelete?: (campanha: Campanha) => void
  onEncerrar?: (campanha: Campanha) => void
  onDonate?: (campanha: Campanha) => void
}

export function CampaignCard({ campanha, showActions, onEdit, onDelete, onEncerrar, onDonate }: Props) {
  const percent = formatPercent(campanha.valorArrecadado || 0, campanha.metaFinanceira)

  return (
    <div className="campaign-card card border-0 shadow-sm h-100">
      <div className="position-relative">
        <img
          src={campanha.imagemUrl || `https://picsum.photos/seed/${campanha.id}/600/300`}
          className="card-img-top"
          alt={campanha.titulo}
          style={{ height: 200, objectFit: 'cover' }}
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = '1'
              e.currentTarget.src = `https://picsum.photos/seed/${campanha.id}/600/300`
            }
          }}
        />
        <div className="position-absolute top-0 start-0 p-2">
          <span className="badge rounded-pill" style={{ background: 'rgba(108,99,255,0.9)', fontSize: '0.7rem' }}>
            <i className={`bi ${getCategoryIcon(campanha.categoria)} me-1`} />
            {getCategoryLabel(campanha.categoria)}
          </span>
        </div>
        <div className="position-absolute top-0 end-0 p-2">
          <span className={`badge bg-${getStatusColor(campanha.status)} rounded-pill`} style={{ fontSize: '0.7rem' }}>
            {getStatusLabel(campanha.status)}
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <h6 className="fw-bold mb-1 lh-sm">{campanha.titulo}</h6>
        {campanha.ongNome && (
          <small className="text-muted mb-2 d-flex align-items-center gap-1">
            <i className="bi bi-building" />
            {campanha.ongNome}
          </small>
        )}
        <p className="text-muted small mb-3 flex-grow-1">
          {truncateText(campanha.descricao, 100)}
        </p>

        <div className="mb-2">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Arrecadado</small>
            <small className="fw-semibold" style={{ color: '#43D9A2' }}>{percent}%</small>
          </div>
          <div className="progress progress-custom">
            <div
              className="progress-bar"
              style={{ width: `${percent}%`, transition: 'width 1s ease' }}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <div>
            <div className="fw-bold" style={{ color: '#43D9A2', fontSize: '0.9rem' }}>
              {formatCurrency(campanha.valorArrecadado || 0)}
            </div>
            <small className="text-muted">de {formatCurrency(campanha.metaFinanceira)}</small>
          </div>
          {campanha.quantidadeDoadores !== undefined && (
            <div className="text-end">
              <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{campanha.quantidadeDoadores}</div>
              <small className="text-muted">doadores</small>
            </div>
          )}
        </div>

        {showActions ? (
          <div className="d-flex gap-2">
            <Link to={`/campanhas/${campanha.id}`} className="btn btn-sm btn-outline-primary flex-grow-1" style={{ borderRadius: 8 }}>
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
        ) : onDonate && campanha.status === 'ATIVA' ? (
          <div className="d-flex gap-2">
            <Link
              to={`/campanhas/${campanha.id}`}
              className="btn btn-outline-secondary flex-shrink-0"
              style={{ borderRadius: 12, fontSize: '0.875rem' }}
            >
              <i className="bi bi-eye" />
            </Link>
            <button
              className="btn btn-primary-custom flex-grow-1"
              style={{ borderRadius: 12, fontSize: '0.875rem' }}
              onClick={() => onDonate(campanha)}
            >
              <i className="bi bi-heart-fill me-2" />Doar
            </button>
          </div>
        ) : (
          <Link
            to={`/campanhas/${campanha.id}`}
            className="btn btn-primary-custom w-100"
            style={{ borderRadius: 12, fontSize: '0.875rem' }}
          >
            Ver Campanha
          </Link>
        )}
      </div>
    </div>
  )
}
