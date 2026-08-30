import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Alert } from '../../components/common/Alert'
import { ImageUpload } from '../../components/common/ImageUpload'
import { useAuth } from '../../contexts/AuthContext'
import { UsuarioService } from '../../services/UsuarioService'
import { UsuarioUpdateRequest } from '../../types/user.types'

export function OngProfilePage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingFoto, setIsUploadingFoto] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null)

  const { register, handleSubmit, reset } = useForm<UsuarioUpdateRequest>()

  useEffect(() => {
    if (!user) return
    UsuarioService.buscarPorId(user.id, user.role)
      .then((data) => {
        reset({
          nome: data.nome,
          razaoSocial: data.razaoSocial,
          telefone: data.telefone,
          descricao: data.descricao,
          localizacao: data.localizacao,
          site: data.site,
          chavePix: data.chavePix,
        })
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role])

  const handleFotoUpload = async (file: File) => {
    if (!user) return
    setIsUploadingFoto(true)
    try {
      const updated = await UsuarioService.uploadFotoOng(user.id, file)
      updateUser({ imagemUrl: updated.imagemUrl })
      setAlert({ type: 'success', msg: 'Foto atualizada com sucesso!' })
    } catch {
      setAlert({ type: 'danger', msg: 'Erro ao enviar foto. Verifique o formato e o tamanho (máx. 5MB).' })
    } finally {
      setIsUploadingFoto(false)
    }
  }

  const onSubmit = async (data: UsuarioUpdateRequest) => {
    if (!user) return
    setIsLoading(true)
    try {
      await UsuarioService.atualizar(user.id, data, user.role)
      updateUser({ nome: data.nome })
      setAlert({ type: 'success', msg: 'Perfil atualizado com sucesso!' })
    } catch {
      setAlert({ type: 'danger', msg: 'Erro ao atualizar perfil.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout title="Meu Perfil">
      <div className="mb-4 d-flex align-items-start justify-content-between gap-3 flex-wrap">
        <div>
          <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Perfil da ONG</h4>
          <p className="mb-0" style={{ color: 'var(--text-muted)' }}>Mantenha suas informações atualizadas</p>
        </div>
        <Link to="/" className="btn btn-sm rounded-pill" style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', color: '#6C63FF', fontWeight: 600, whiteSpace: 'nowrap' }}>
          <i className="bi bi-house-fill me-2" />Home
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-card-dark p-4 p-md-5">
            {alert && <Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

            <div className="text-center mb-5">
              <ImageUpload
                currentUrl={user?.imagemUrl}
                onFileSelect={handleFotoUpload}
                isUploading={isUploadingFoto}
                shape="circle"
                label="Clique para alterar a logo"
              />
              <h5 className="text-white fw-bold mt-2">{user?.nome}</h5>
              <span className="badge" style={{ background: 'rgba(108,99,255,0.2)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.3)' }}>
                {user?.email}
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Nome da ONG</label>
                  <input {...register('nome')} className="form-control form-control-custom" placeholder="Nome fantasia" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Razão Social <span className="text-danger">*</span></label>
                  <input {...register('razaoSocial')} className="form-control form-control-custom" placeholder="Razão social" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Telefone</label>
                  <input {...register('telefone')} className="form-control form-control-custom" placeholder="(00) 00000-0000" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Localização</label>
                  <input {...register('localizacao')} className="form-control form-control-custom" placeholder="Cidade, Estado" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Site</label>
                  <input {...register('site')} className="form-control form-control-custom" placeholder="https://..." />
                </div>
                <div className="col-12">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.25)' }}>
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <i className="bi bi-qr-code" style={{ color: '#6C63FF' }} />
                      Chave PIX para receber doações
                    </label>
                    <input
                      {...register('chavePix')}
                      className="form-control form-control-custom"
                      placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                    />
                    <div className="small mt-2" style={{ color: 'var(--text-muted)' }}>
                      É esta chave que aparece no QR Code gerado quando alguém faz uma doação financeira
                      para suas campanhas. Sem ela, o pagamento cai na chave padrão da plataforma.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Descrição</label>
                  <textarea {...register('descricao')} className="form-control form-control-custom" rows={4} placeholder="Descreva sua ONG, missão e atuação..." />
                </div>
                <div className="col-12 pt-2">
                  <button type="submit" className="btn btn-primary-custom px-5 py-2" disabled={isLoading}>
                    {isLoading ? <><span className="spinner-border spinner-border-sm me-2" />Salvando...</> : <><i className="bi bi-check-lg me-2" />Salvar Perfil</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
