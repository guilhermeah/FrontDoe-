import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { CampaignForm } from '../../components/campaign/CampaignForm'
import { CampanhaService } from '../../services/CampanhaService'
import { CampanhaRequest } from '../../types/campaign.types'
import { useAuth } from '../../contexts/AuthContext'

export function CreateCampaignPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pendingImageFile = useRef<File | null>(null)

  const handleSubmit = async (data: CampanhaRequest) => {
    if (!user?.id) {
      setError('Sessão inválida. Faça logout e login novamente.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const campanha = await CampanhaService.criar({ ...data, idOng: user.idOng ?? user.id })
      if (pendingImageFile.current) {
        await CampanhaService.uploadImagem(campanha.id, pendingImageFile.current)
      }
      navigate('/ong/campanhas')
    } catch (err: any) {
      console.log('[CreateCampaignPage] erro:', err?.response?.status, err?.response?.data)
      const msg = err?.response?.data?.message || err?.response?.data?.error || JSON.stringify(err?.response?.data) || 'Erro ao criar campanha'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout title="Nova Campanha">
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Criar Campanha</h4>
        <p style={{ color: 'var(--text-muted)' }}>Preencha as informações da sua campanha</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-card-dark p-4 p-md-5">
            <CampaignForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              submitLabel="Criar Campanha"
              onImageFile={(file) => { pendingImageFile.current = file }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
