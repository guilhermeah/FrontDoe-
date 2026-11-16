import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Alert } from '../../components/common/Alert'
import { useAuth } from '../../contexts/AuthContext'
import { UsuarioService } from '../../services/UsuarioService'
import { UsuarioUpdateRequest } from '../../types/user.types'

const avatarKey = (id: number) => `@doemais:avatar:${id}`

export function DonorProfilePage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset } = useForm<UsuarioUpdateRequest>()

  useEffect(() => {
    if (!user) return
    const local = localStorage.getItem(avatarKey(user.id))
    UsuarioService.buscarPorId(user.id)
      .then((data) => {
        reset({ nome: data.nome, telefone: data.telefone, imagemUrl: data.imagemUrl })
        setPreviewUrl(local ?? data.imagemUrl ?? null)
      })
      .catch(() => {})
  }, [user, reset])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      localStorage.setItem(avatarKey(user.id), result)
      setPreviewUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (data: UsuarioUpdateRequest) => {
    if (!user) return
    setIsLoading(true)
    try {
      const updated = await UsuarioService.atualizar(user.id, data, user.role)
      updateUser({ ...user, ...updated })
      if (data.imagemUrl) {
        localStorage.removeItem(avatarKey(user.id))
        setPreviewUrl(data.imagemUrl)
      }
      setAlert({ type: 'success', msg: 'Perfil atualizado com sucesso!' })
    } catch {
      setAlert({ type: 'danger', msg: 'Erro ao atualizar perfil.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout title="Meu Perfil">
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Meu Perfil</h4>
        <p style={{ color: 'var(--text-muted)' }}>Gerencie suas informações pessoais</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="surface-card p-4 p-md-5">
            {alert && <Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

            <div className="text-center mb-5">
              <div
                className="position-relative mx-auto mb-3"
                style={{ width: 80, height: 80, cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
                title="Clique para alterar a foto"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={user?.nome}
                    className="rounded-circle"
                    style={{ width: 80, height: 80, objectFit: 'cover', border: '3px solid #6C63FF' }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', fontSize: '2rem', fontWeight: 700, color: 'white' }}
                  >
                    {user?.nome?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div
                  className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 26, height: 26, background: '#6C63FF', border: '2px solid var(--card-bg, #1e1e2e)' }}
                >
                  <i className="bi bi-camera-fill text-white" style={{ fontSize: '0.65rem' }} />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleImageUpload}
              />
              <h5 className="fw-bold" style={{ color: 'var(--card-text)' }}>{user?.nome}</h5>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <span className="badge" style={{ background: 'rgba(108,99,255,0.12)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.25)' }}>{user?.email}</span>
                <span className="badge" style={{ background: 'rgba(67,217,162,0.12)', color: '#43D9A2', border: '1px solid rgba(67,217,162,0.25)' }}>{user?.role}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: 'var(--card-text)' }}>Nome</label>
                  <input {...register('nome')} className="form-control form-control-custom" placeholder="Seu nome" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: 'var(--card-text)' }}>Telefone</label>
                  <input {...register('telefone')} className="form-control form-control-custom" placeholder="(00) 00000-0000" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: 'var(--card-text)' }}>URL da foto de perfil</label>
                  <input {...register('imagemUrl')} className="form-control form-control-custom" placeholder="https://... (ou use o botão acima para fazer upload)" />
                </div>
                <div className="col-12 pt-2">
                  <button type="submit" className="btn btn-primary-custom px-5 py-2" disabled={isLoading}>
                    {isLoading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Salvando...</>
                      : <><i className="bi bi-check-lg me-2" />Salvar</>
                    }
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
