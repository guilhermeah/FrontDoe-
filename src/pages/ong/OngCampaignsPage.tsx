import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { Alert } from '../../components/common/Alert'
import { useAuth } from '../../contexts/AuthContext'
import { CampanhaService } from '../../services/CampanhaService'
import { Campanha } from '../../types/campaign.types'

export function OngCampaignsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Campanha | null>(null)

  const loadCampanhas = () => {
    if (!user) return
    setIsLoading(true)
    CampanhaService.listarPorOng(user.id)
      .then(setCampanhas)
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { loadCampanhas() }, [user])

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await CampanhaService.excluir(confirmDelete.id)
      setAlert({ type: 'success', msg: 'Campanha excluída com sucesso.' })
      setConfirmDelete(null)
      loadCampanhas()
    } catch {
      setAlert({ type: 'danger', msg: 'Erro ao excluir campanha.' })
    }
  }

  const handleEncerrar = async (campanha: Campanha) => {
    try {
      await CampanhaService.encerrar(campanha.id)
      setAlert({ type: 'success', msg: 'Campanha encerrada com sucesso.' })
      loadCampanhas()
    } catch {
      setAlert({ type: 'danger', msg: 'Erro ao encerrar campanha.' })
    }
  }

  return (
    <DashboardLayout title="Minhas Campanhas">
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Campanhas</h4>
          <p style={{ color: 'var(--text-muted)' }}>{campanhas.length} campanhas criadas</p>
        </div>
        <Link to="/ong/campanhas/criar" className="btn btn-primary-custom px-4">
          <i className="bi bi-plus-lg me-2" />Nova Campanha
        </Link>
      </div>

      {alert && <Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 glass-card-dark" style={{ borderRadius: 16 }}>
              <div className="modal-body p-4 text-center">
                <i className="bi bi-exclamation-triangle text-danger fs-1 d-block mb-3" />
                <h5 className="text-white fw-bold">Excluir campanha?</h5>
                <p style={{ color: 'var(--text-muted)' }}>Esta ação não pode ser desfeita. A campanha "{confirmDelete.titulo}" será removida permanentemente.</p>
                <div className="d-flex gap-3 justify-content-center mt-4">
                  <button className="btn btn-outline-secondary px-4" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                  <button className="btn btn-danger px-4" onClick={handleDelete}>Excluir</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="col-sm-6 col-xl-4"><SkeletonCard /></div>
            ))
          : campanhas.length === 0
          ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-megaphone fs-1" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-muted)' }} className="mt-3 mb-4">Você ainda não criou nenhuma campanha.</p>
              <Link to="/ong/campanhas/criar" className="btn btn-primary-custom px-5">
                <i className="bi bi-plus-lg me-2" />Criar minha primeira campanha
              </Link>
            </div>
          )
          : campanhas.map((c) => (
              <div key={c.id} className="col-sm-6 col-xl-4">
                <CampaignCard
                  campanha={c}
                  showActions
                  onEdit={(camp) => navigate(`/ong/campanhas/editar/${camp.id}`)}
                  onDelete={setConfirmDelete}
                  onEncerrar={handleEncerrar}
                />
              </div>
            ))
        }
      </div>
    </DashboardLayout>
  )
}
