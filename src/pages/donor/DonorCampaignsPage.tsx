import { useState } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { DonationModal } from '../../components/donation/DonationModal'
import { useCampaigns } from '../../hooks/useCampaigns'
import { Campanha } from '../../types/campaign.types'

export function DonorCampaignsPage() {
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('')
  const [selected, setSelected] = useState<Campanha | null>(null)

  const { campanhas, isLoading, refetch } = useCampaigns({ status: 'ATIVA' })

  const filtered = campanhas.filter((c) => {
    const matchSearch = !search || c.titulo.toLowerCase().includes(search.toLowerCase())
    const matchCat = !categoria || c.categoria === categoria
    return matchSearch && matchCat
  })

  return (
    <DashboardLayout title="Campanhas">
      {selected && (
        <DonationModal
          campanhaId={selected.id}
          campanhaTitulo={selected.titulo}
          tipoCampanha={selected.tipoCampanha}
          onSuccess={refetch}
          onClose={() => setSelected(null)}
        />
      )}

      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Campanhas Ativas</h4>
        <p style={{ color: 'var(--text-muted)' }}>Escolha uma causa para apoiar</p>
      </div>

      <div className="glass-card-dark p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text" style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                <i className="bi bi-search" />
              </span>
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="Buscar campanhas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderLeft: 'none' }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select form-control-custom" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Todas as categorias</option>
              <option value="SAUDE">Saúde</option>
              <option value="EDUCACAO">Educação</option>
              <option value="MEIO_AMBIENTE">Meio Ambiente</option>
              <option value="ANIMAL">Animal</option>
              <option value="SOCIAL">Social</option>
              <option value="CULTURA">Cultura</option>
              <option value="ESPORTE">Esporte</option>
              <option value="ALIMENTOS">Alimentos</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="col-sm-6 col-xl-4"><SkeletonCard /></div>
            ))
          : filtered.map((c) => (
              <div key={c.id} className="col-sm-6 col-xl-4">
                <CampaignCard campanha={c} onDonate={setSelected} />
              </div>
            ))
        }
        {!isLoading && filtered.length === 0 && (
          <div className="col-12 text-center py-5">
            <i className="bi bi-search fs-1" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }} className="mt-3">Nenhuma campanha encontrada.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
