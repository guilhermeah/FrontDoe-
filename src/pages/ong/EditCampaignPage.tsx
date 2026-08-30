import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { CampaignForm } from '../../components/campaign/CampaignForm'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useCampaign } from '../../hooks/useCampaigns'
import { CampanhaService } from '../../services/CampanhaService'
import { CampanhaRequest } from '../../types/campaign.types'
import { useAuth } from '../../contexts/AuthContext'

export function EditCampaignPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { campanha, isLoading: isFetching } = useCampaign(Number(id))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>()
  const pendingImageFile = useRef<File | null>(null)

  const handleSubmit = async (data: CampanhaRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      await CampanhaService.atualizar(Number(id), { ...data, idOng: campanha?.ongId ?? user?.id })
      if (pendingImageFile.current) {
        const updated = await CampanhaService.uploadImagem(Number(id), pendingImageFile.current)
        setCurrentImageUrl(updated.imagemUrl)
      }
      navigate('/ong/campanhas')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao atualizar campanha')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) return <LoadingSpinner fullScreen />

  return (
    <DashboardLayout title="Editar Campanha">
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Editar Campanha</h4>
        <p style={{ color: 'var(--text-muted)' }}>Atualize as informações da campanha</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-card-dark p-4 p-md-5">
            {campanha && (
              <CampaignForm
                onSubmit={handleSubmit}
                defaultValues={{
                  tipoCampanha: campanha.tipoCampanha,
                  titulo: campanha.titulo,
                  descricao: campanha.descricao,
                  metaFinanceira: campanha.metaFinanceira,
                  imagemUrl: campanha.imagemUrl,
                  categoria: campanha.categoria,
                  localizacao: campanha.localizacao,
                  objetivo: campanha.objetivo,
                  dataInicio: campanha.dataInicio?.split('T')[0],
                  dataFim: campanha.dataFim?.split('T')[0],
                  status: campanha.status,
                }}
                currentImageUrl={currentImageUrl ?? campanha.imagemUrl}
                isLoading={isLoading}
                error={error}
                submitLabel="Salvar Alterações"
                onImageFile={(file) => { pendingImageFile.current = file }}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
