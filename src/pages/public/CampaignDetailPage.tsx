import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { DonationModal } from '../../components/donation/DonationModal'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { ProgressBar } from '../../components/common/ProgressBar'
import { useCampaign } from '../../hooks/useCampaigns'
import { useAuth } from '../../contexts/AuthContext'
import { CampanhaService } from '../../services/CampanhaService'
import { ItensDoadosSummary } from '../../types/campaign.types'
import { formatCurrency, formatDate, getCategoryLabel, getCategoryIcon, getStatusLabel, getStatusColor } from '../../utils/formatters'

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { campanha, isLoading, error, refetch } = useCampaign(Number(id))
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()
  const [showDonation, setShowDonation] = useState(false)

  const [itensDoados, setItensDoados] = useState<ItensDoadosSummary[] | null>(null)
  const [loadingItens, setLoadingItens] = useState(false)
  const [showItens, setShowItens] = useState(false)

  const handleVerItens = async () => {
    if (itensDoados) { setShowItens(v => !v); return }
    setLoadingItens(true)
    try {
      const data = await CampanhaService.listarItensDados(Number(id))
      setItensDoados(data)
      setShowItens(true)
    } catch {
      setItensDoados([])
      setShowItens(true)
    } finally {
      setLoadingItens(false)
    }
  }

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

  const showFinanceiro = campanha.tipoCampanha === 'financeira' || campanha.tipoCampanha === 'ambas'
  const showMaterial  = campanha.tipoCampanha === 'material'   || campanha.tipoCampanha === 'ambas'
  const canDonate = campanha.status === 'ATIVA' && !authLoading && user?.role !== 'ONG'

  return (
    <div className="page-shell">
      <Navbar />
      {showDonation && user?.role !== 'ONG' && (
        <DonationModal
          campanhaId={campanha.id}
          campanhaTitulo={campanha.titulo}
          tipoCampanha={campanha.tipoCampanha}
          onSuccess={() => { refetch(); setItensDoados(null) }}
          onClose={() => setShowDonation(false)}
        />
      )}

      <div style={{ paddingTop: 80 }}>
        <div className="container py-5">
          <div className="mb-4">
            <Link to="/campanhas" className="text-decoration-none d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <i className="bi bi-arrow-left" />
              Voltar às campanhas
            </Link>
          </div>

          <div className="row g-5">
            <div className="col-lg-8">
              <div className="position-relative mb-4" style={{ borderRadius: 20, overflow: 'hidden' }}>
                <img
                  src={campanha.imagemUrl || `https://picsum.photos/seed/${campanha.id}/800/400`}
                  className="w-100"
                  alt={campanha.titulo}
                  style={{ height: 380, objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${campanha.id}/800/400` }}
                />
                <div className="position-absolute top-0 start-0 p-3 d-flex gap-2 flex-wrap">
                  {campanha.categoria && (
                    <span className="badge rounded-pill" style={{ background: 'rgba(108,99,255,0.9)' }}>
                      <i className={`bi ${getCategoryIcon(campanha.categoria)} me-1`} />
                      {getCategoryLabel(campanha.categoria)}
                    </span>
                  )}
                  <span className={`badge bg-${getStatusColor(campanha.status)} rounded-pill`}>
                    {getStatusLabel(campanha.status)}
                  </span>
                  <span className="badge rounded-pill" style={{ background: 'rgba(0,0,0,0.6)' }}>
                    {campanha.tipoCampanha === 'financeira' && <><i className="bi bi-cash-stack me-1" />Financeira</>}
                    {campanha.tipoCampanha === 'material'   && <><i className="bi bi-box-seam me-1" />Itens</>}
                    {campanha.tipoCampanha === 'ambas'      && <><i className="bi bi-layers me-1" />Financeira + Itens</>}
                  </span>
                </div>
              </div>

              <h1 className="fw-black mb-3">{campanha.titulo}</h1>

              {campanha.ongNome && (
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>
                    <i className="bi bi-building text-white" style={{ fontSize: '0.8rem' }} />
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{campanha.ongNome}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ONG Responsável</div>
                  </div>
                </div>
              )}

              <div className="glass-card-dark p-4 mb-4">
                <h5 className="fw-bold mb-3">Sobre esta campanha</h5>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{campanha.descricao}</p>
              </div>

              {campanha.objetivo && (
                <div className="glass-card-dark p-4 mb-4">
                  <h5 className="fw-bold mb-3"><i className="bi bi-bullseye me-2" style={{ color: '#6C63FF' }} />Objetivo</h5>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{campanha.objetivo}</p>
                </div>
              )}

              {/* Itens doados (material / ambas) */}
              {showMaterial && (
                <div className="glass-card-dark p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-box-seam me-2" style={{ color: '#43D9A2' }} />
                      Itens doados
                    </h5>
                    <button
                      className="btn btn-sm"
                      onClick={handleVerItens}
                      disabled={loadingItens}
                      style={{ borderRadius: 10, border: '1px solid rgba(67,217,162,0.4)', background: 'rgba(67,217,162,0.1)', color: '#43D9A2', fontWeight: 600 }}
                    >
                      {loadingItens
                        ? <span className="spinner-border spinner-border-sm" />
                        : showItens
                          ? <><i className="bi bi-chevron-up me-1" />Ocultar</>
                          : <><i className="bi bi-eye me-1" />Ver itens doados</>
                      }
                    </button>
                  </div>

                  {showItens && itensDoados !== null && (
                    itensDoados.length === 0
                      ? <p className="text-muted mb-0 small">Nenhum item doado ainda.</p>
                      : (
                        <div className="table-responsive">
                          <table className="table table-sm mb-0" style={{ color: 'var(--text)' }}>
                            <thead>
                              <tr style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                <th style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem' }}>Item</th>
                                <th style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem' }}>Categoria</th>
                                <th style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem' }}>Unidade</th>
                                <th className="text-end" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem' }}>Total doado</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itensDoados.map(it => (
                                <tr key={it.idItem} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                  <td className="fw-semibold" style={{ fontSize: '0.875rem' }}>{it.nomeItem}</td>
                                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{it.categoria}</td>
                                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{it.unidadeMedida}</td>
                                  <td className="text-end fw-bold" style={{ color: '#43D9A2' }}>{it.totalDoado}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                  )}
                </div>
              )}

              <div className="glass-card-dark p-4">
                <h5 className="fw-bold mb-3">Detalhes</h5>
                <div className="row g-3">
                  {campanha.localizacao && (
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-geo-alt" style={{ color: '#6C63FF' }} />
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Localização</div>
                          <div className="text-white fw-semibold">{campanha.localizacao}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-calendar" style={{ color: '#6C63FF' }} />
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Início</div>
                        <div className="text-white fw-semibold">{campanha.dataInicio ? formatDate(campanha.dataInicio) : '-'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-calendar-x" style={{ color: '#FF6584' }} />
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Término</div>
                        <div className="text-white fw-semibold">{campanha.dataFim ? formatDate(campanha.dataFim) : '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: 100 }}>
                <div className="glass-card-dark p-4 mb-4">

                  {/* Financeiro: valor + barra */}
                  {showFinanceiro && (
                    <div className="mb-4">
                      <div className="text-center mb-3">
                        <div className="fw-black" style={{ fontSize: '2.5rem', color: '#43D9A2', lineHeight: 1 }}>
                          {formatCurrency(campanha.valorArrecadado || 0)}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          arrecadado de {formatCurrency(campanha.metaFinanceira)}
                        </div>
                      </div>
                      <ProgressBar value={campanha.valorArrecadado || 0} total={campanha.metaFinanceira} />
                    </div>
                  )}

                  {/* Material: indicador de itens */}
                  {showMaterial && !showFinanceiro && (
                    <div className="text-center mb-4">
                      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                        style={{ width: 64, height: 64, background: 'rgba(67,217,162,0.15)', border: '2px solid rgba(67,217,162,0.3)' }}>
                        <i className="bi bi-box-seam fs-3" style={{ color: '#43D9A2' }} />
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Campanha de arrecadação de itens</div>
                    </div>
                  )}

                  {campanha.quantidadeDoadores !== undefined && (
                    <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
                      <i className="bi bi-people" style={{ color: '#6C63FF' }} />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span className="text-white fw-bold">{campanha.quantidadeDoadores}</span> doadores
                      </span>
                    </div>
                  )}

                  {canDonate && (
                    isAuthenticated ? (
                      <button
                        className="btn btn-primary-custom w-100 py-3"
                        onClick={() => setShowDonation(true)}
                      >
                        <i className="bi bi-heart-fill me-2" />
                        Fazer Doação
                      </button>
                    ) : (
                      <Link to="/login" className="btn btn-primary-custom w-100 py-3 d-block text-center">
                        <i className="bi bi-box-arrow-in-right me-2" />
                        Entre para doar
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

                <div className="glass-card-dark p-4">
                  <h6 className="fw-bold mb-3">Compartilhar</h6>
                  <div className="d-flex gap-2">
                    {['whatsapp', 'facebook', 'twitter-x', 'linkedin'].map((s) => (
                      <button key={s} className="btn btn-sm flex-grow-1" style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: '#6C63FF', borderRadius: 10 }}>
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
