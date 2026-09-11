import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { useCampaigns } from '../../hooks/useCampaigns'
import { Campanha, CampaignCategory, CampaignStatus } from '../../types/campaign.types'
import { CampanhaService } from '../../services/CampanhaService'

const categories: { value: string; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'SAUDE', label: 'Saúde' },
  { value: 'EDUCACAO', label: 'Educação' },
  { value: 'MEIO_AMBIENTE', label: 'Meio Ambiente' },
  { value: 'ANIMAL', label: 'Animal' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'CULTURA', label: 'Cultura' },
  { value: 'ESPORTE', label: 'Esporte' },
  { value: 'ALIMENTOS', label: 'Alimentos' },
  { value: 'OUTRO', label: 'Outro' },
]

export function CampaignsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState<string>(searchParams.get('categoria') || '')
  const [status, setStatus] = useState<string>(searchParams.get('ong') ? '' : 'ATIVA')

  const ongId = searchParams.get('ong')

  const [ongCampanhas, setOngCampanhas] = useState<Campanha[]>([])
  const [ongLoading, setOngLoading] = useState(false)

  useEffect(() => {
    if (!ongId) return
    setOngLoading(true)
    CampanhaService.listarPorOng(Number(ongId))
      .then(setOngCampanhas)
      .catch(() => setOngCampanhas([]))
      .finally(() => setOngLoading(false))
  }, [ongId])

  const { campanhas: allCampanhas, isLoading: allLoading } = useCampaigns({
    categoria: categoria as CampaignCategory || undefined,
    status: status as CampaignStatus || undefined,
  })

  const campanhas = ongId ? ongCampanhas : allCampanhas
  const isLoading = ongId ? ongLoading : allLoading

  const filtered = campanhas.filter((c) => {
    if (status && c.status !== status) return false
    if (categoria && c.categoria !== categoria) return false
    if (search && !c.titulo.toLowerCase().includes(search.toLowerCase()) && !c.descricao.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="page-shell">
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="fw-black display-5 mb-2">Campanhas <span className="gradient-text">ativas</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Encontre uma causa para apoiar</p>
          </div>

          {/* Filters */}
          <div className="glass-card-dark p-4 mb-5">
            <div className="row g-3 align-items-center">
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text" style={{ background: 'var(--input-group-bg)', border: '1px solid var(--input-group-border)', color: 'var(--text-muted)' }}>
                    <i className="bi bi-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="Pesquisar campanhas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ borderLeft: 'none' }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select form-control-custom"
                  value={categoria}
                  onChange={(e) => {
                    setCategoria(e.target.value)
                    const params: Record<string, string> = {}
                    if (e.target.value) params.categoria = e.target.value
                    if (ongId) params.ong = ongId
                    setSearchParams(params)
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select form-control-custom"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Todos os status</option>
                  <option value="ATIVA">Ativas</option>
                  <option value="ENCERRADA">Encerradas</option>
                  <option value="PAUSADA">Pausadas</option>
                </select>
              </div>
            </div>
          </div>

          {/* ONG filter indicator */}
          {ongId && (
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(108,99,255,0.15)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.3)', fontSize: '0.85rem' }}>
                <i className="bi bi-building me-2" />
                Campanhas desta ONG
              </span>
              <button
                className="btn btn-sm"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', fontSize: '0.8rem' }}
                onClick={() => setSearchParams({})}
              >
                <i className="bi bi-x-circle me-1" />
                Ver todas
              </button>
            </div>
          )}

          {/* Results count */}
          {!isLoading && (
            <p style={{ color: 'var(--text-muted)' }} className="mb-4">
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{filtered.length}</span> campanhas encontradas
            </p>
          )}

          {/* Grid */}
          <div className="row g-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="col-sm-6 col-lg-4"><SkeletonCard /></div>
                ))
              : filtered.length > 0
              ? filtered.map((c) => (
                  <div key={c.id} className="col-sm-6 col-lg-4">
                    <CampaignCard campanha={c} />
                  </div>
                ))
              : (
                <div className="col-12 text-center py-5">
                  <i className="bi bi-search fs-1" style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-muted)' }} className="mt-3">Nenhuma campanha encontrada.</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
