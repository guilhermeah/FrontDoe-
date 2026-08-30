import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Alert } from '../../components/common/Alert'
import { ImageUpload } from '../../components/common/ImageUpload'
import { useAuth } from '../../contexts/AuthContext'
import { UsuarioService } from '../../services/UsuarioService'
import { DoacaoService } from '../../services/DoacaoService'
import { UsuarioUpdateRequest } from '../../types/user.types'
import { formatCurrency } from '../../utils/formatters'

export function DonorProfilePage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingFoto, setIsUploadingFoto] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null)
  const [totalDoado, setTotalDoado] = useState<number | null>(null)
  const [totalDoacoes, setTotalDoacoes] = useState<number | null>(null)

  const { register, handleSubmit, reset } = useForm<UsuarioUpdateRequest>()

  useEffect(() => {
    if (!user) return
    UsuarioService.buscarPorId(user.id, user.role)
      .then((data) => {
        reset({
          nome: data.nome,
          telefone: data.telefone,
        })
      })
      .catch(() => {})
    DoacaoService.listarPorDoador(user.id)
      .then((doacoes) => {
        setTotalDoacoes(doacoes.length)
        setTotalDoado(doacoes.reduce((acc, d) => acc + d.valor, 0))
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role])

  const handleFotoUpload = async (file: File) => {
    if (!user) return
    setIsUploadingFoto(true)
    try {
      const updated = await UsuarioService.uploadFotoDoador(user.id, file)
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
          <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Meu Perfil</h4>
          <p className="mb-0" style={{ color: 'var(--text-muted)' }}>Gerencie suas informações pessoais</p>
        </div>
        <Link to="/" className="btn btn-sm rounded-pill" style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', color: '#6C63FF', fontWeight: 600, whiteSpace: 'nowrap' }}>
          <i className="bi bi-house-fill me-2" />Home
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="glass-card-dark p-4 p-md-5">
            {alert && <Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

            <div className="text-center mb-5">
              <ImageUpload
                currentUrl={user?.imagemUrl}
                onFileSelect={handleFotoUpload}
                isUploading={isUploadingFoto}
                shape="circle"
                label="Clique para alterar a foto"
              />
              <h5 className="text-white fw-bold mt-2">{user?.nome}</h5>
              <div className="d-flex gap-2 justify-content-center">
                <span className="badge" style={{ background: 'rgba(108,99,255,0.2)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.3)' }}>{user?.email}</span>
                <span className="badge" style={{ background: 'rgba(67,217,162,0.2)', color: '#43D9A2', border: '1px solid rgba(67,217,162,0.3)' }}>{user?.role}</span>
              </div>
              {totalDoado !== null && (
                <div className="d-flex gap-3 justify-content-center mt-3">
                  <div className="text-center px-3 py-2 rounded-3" style={{ background: 'rgba(67,217,162,0.08)', border: '1px solid rgba(67,217,162,0.2)' }}>
                    <div className="fw-black" style={{ color: '#43D9A2', fontSize: '1.1rem' }}>{formatCurrency(totalDoado)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total Doado</div>
                  </div>
                  <div className="text-center px-3 py-2 rounded-3" style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}>
                    <div className="fw-black" style={{ color: '#6C63FF', fontSize: '1.1rem' }}>{totalDoacoes}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Doações</div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Nome</label>
                  <input {...register('nome')} className="form-control form-control-custom" placeholder="Seu nome" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Telefone</label>
                  <input {...register('telefone')} className="form-control form-control-custom" placeholder="(00) 00000-0000" />
                </div>
                <div className="col-12 pt-2">
                  <button type="submit" className="btn btn-primary-custom px-5 py-2" disabled={isLoading}>
                    {isLoading ? <><span className="spinner-border spinner-border-sm me-2" />Salvando...</> : <><i className="bi bi-check-lg me-2" />Salvar</>}
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
