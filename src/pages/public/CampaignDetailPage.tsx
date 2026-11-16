import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { DonationModal } from '../../components/donation/DonationModal'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { ProgressBar } from '../../components/common/ProgressBar'
import { useCampaign } from '../../hooks/useCampaigns'
import { useAuth } from '../../contexts/AuthContext'
import { formatCurrency, formatDate, getCategoryLabel, getCategoryIcon, getStatusLabel, getStatusColor } from '../../utils/formatters'

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { campanha, isLoading, error } = useCampaign(Number(id))
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showDonation, setShowDonation] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  if (isLoading) return <LoadingSpinner fullScreen />
  if (error || !campanha) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="container text-center py-5 mt-5">
          <i className="bi bi-exclamation-triangle fs-1" style={{ color: '#FF6584' }} />
          <h3 className="mt-3">Campanha não encontrada</h3>
          <Link to="/campanhas" className="btn btn-primary-custom mt-3">Voltar às campanhas</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <Navbar />
      {showDonation && (
        <DonationModal
          campanhaId={campanha.id}
          campanhaTitulo={campanha.titulo}
          onSuccess={() => setRefreshKey(k => k + 1)}
          onClose={() => setShowDonation(false)}
        />
      )}

      <div style={{ paddingTop: 80 }}>
        <div className="container py-5">
          <div className="mb-4">
            <Link to="/campanhas" className="text-decoration-none d-inline-flex align-items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <i className="bi bi-arrow-left" />
              Voltar às campanhas
            </Link>
          </div>

          <div className="row g-5">
            {/* Main content */}
            <div className="col-lg-8">
              <div className="position-relative mb-4" style={{ borderRadius: 20, overflow: 'hidden' }}>
                <img
                  src={campanha.imagemUrl || `https://picsum.photos/seed/${campanha.id}/800/400`}
                  className="w-100"
                  alt={campanha.titulo}
                  style={{ height: 380, objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${campanha.id}/800/400` }}
                />
                <div className="position-absolute top-0 start-0 p-3 d-flex gap-2">
                  <span className="badge rounded-pill" style={{ background: 'rgba(108,99,255,0.9)', backdropFilter: 'blur(8px)' }}>
                    <i className={`bi ${getCategoryIcon(campanha.categoria)} me-1`} />
                    {getCategoryLabel(campanha.categoria)}
                  </span>
                  <span className={`badge bg-${getStatusColor(campanha.status)} rounded-pill`}>
                    {getStatusLabel(campanha.status)}
                  </span>
                </div>
              </div>

              <h1 className="fw-black mb-3">{campanha.titulo}</h1>

              {campanha.ongNome && (
                <div className="d-flex align-items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>
                    <i className="bi bi-building text-white" style={{ fontSize: '0.8rem' }} />
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{campanha.ongNome}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ONG Responsável</div>
                  </div>
                </div>
              )}

              <div className="surface-card p-4 mb-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--card-text)' }}>Sobre esta campanha</h5>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{campanha.descricao}</p>
              </div>

              {campanha.objetivo && (
                <div className="surface-card p-4 mb-4">
                  <h5 className="fw-bold mb-3" style={{ color: 'var(--card-text)' }}>
                    <i className="bi bi-bullseye me-2" style={{ color: '#6C63FF' }} />Objetivo
                  </h5>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{campanha.objetivo}</p>
                </div>
              )}

              <div className="surface-card p-4">
                <h5 className="fw-bold mb-4" style={{ color: 'var(--card-text)' }}>Detalhes</h5>
                <div className="row g-4">
                  {campanha.localizacao && (
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(108,99,255,0.1)' }}>
                          <i className="bi bi-geo-alt" style={{ color: '#6C63FF' }} />
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Localização</div>
                          <div className="fw-semibold" style={{ color: 'var(--card-text)' }}>{campanha.localizacao}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(108,99,255,0.1)' }}>
                        <i className="bi bi-calendar" style={{ color: '#6C63FF' }} />
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Início</div>
                        <div className="fw-semibold" style={{ color: 'var(--card-text)' }}>{campanha.dataInicio ? formatDate(campanha.dataInicio) : '-'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(255,101,132,0.1)' }}>
                        <i className="bi bi-calendar-x" style={{ color: '#FF6584' }} />
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Término</div>
                        <div className="fw-semibold" style={{ color: 'var(--card-text)' }}>{campanha.dataFim ? formatDate(campanha.dataFim) : '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: 100 }}>
                <div className="surface-card p-4 mb-4">
                  <div className="text-center mb-4">
                    <div className="fw-black" style={{ fontSize: '2.5rem', color: '#43D9A2', lineHeight: 1 }}>
                      {formatCurrency(campanha.valorArrecadado || 0)}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      arrecadado de {formatCurrency(campanha.metaFinanceira)}
                    </div>
                  </div>

                  <ProgressBar value={campanha.valorArrecadado || 0} total={campanha.metaFinanceira} />

                  {campanha.quantidadeDoadores !== undefined && (
                    <div className="d-flex align-items-center gap-2 mt-3 mb-4 justify-content-center">
                      <i className="bi bi-people" style={{ color: '#6C63FF' }} />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span className="fw-bold" style={{ color: 'var(--card-text)' }}>{campanha.quantidadeDoadores}</span> doadores
                      </span>
                    </div>
                  )}

                  {campanha.status === 'ATIVA' && (
                    isAuthenticated ? (
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-primary-custom w-100 py-3" onClick={() => setShowDonation(true)}>
                          <i className="bi bi-heart-fill me-2" />Fazer Doação via PIX
                        </button>
                        <button
                          className="btn w-100 py-3"
                          style={{ borderRadius: 12, border: '1.5px solid var(--border)', color: 'var(--text)', background: 'transparent', fontSize: '0.875rem' }}
                          onClick={() => navigate('/doador/doar-item')}
                        >
                          <i className="bi bi-box-seam me-2" />Doar um Item
                        </button>
                      </div>
                    ) : (
                      <Link to="/login" className="btn btn-primary-custom w-100 py-3 d-block text-center">
                        <i className="bi bi-box-arrow-in-right me-2" />Entre para doar
                      </Link>
                    )
                  )}

                  {campanha.status !== 'ATIVA' && (
                    <div className="text-center py-2">
                      <span className={`badge bg-${getStatusColor(campanha.status)} fs-6 px-3 py-2`}>
                        Campanha {getStatusLabel(campanha.status)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="surface-card p-4">
                  <h6 className="fw-bold mb-3" style={{ color: 'var(--card-text)' }}>Compartilhar</h6>
                  <div className="d-flex gap-2">
                    {['whatsapp', 'facebook', 'twitter-x', 'linkedin'].map((s) => (
                      <button key={s} className="btn btn-sm flex-grow-1" style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.18)', color: '#6C63FF', borderRadius: 10 }}>
                        <i className={`bi bi-${s}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
