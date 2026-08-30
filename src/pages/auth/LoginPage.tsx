import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { LoginRequest } from '../../types/auth.types'
import { Alert } from '../../components/common/Alert'

const ROLE_PATHS: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  ONG: '/ong/dashboard',
  DOADOR: '/doador/dashboard',
}

export function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>()

  if (user) return <Navigate to={ROLE_PATHS[user.role] || '/'} replace />

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      await login(data)
      const role = JSON.parse(localStorage.getItem('@doemais:user') || '{}').role
      navigate(ROLE_PATHS[role] || '/', { replace: true })
    } catch (err: any) {
      const errData = err?.response?.data
      setError(errData?.message || errData?.mensagem || 'Email ou senha inválidos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-shell min-vh-100 d-flex align-items-center justify-content-center position-relative">
      <div className="orb" style={{ width: 400, height: 400, background: '#6C63FF', top: -100, left: -100 }} />
      <div className="orb" style={{ width: 300, height: 300, background: '#FF6584', bottom: -50, right: -50, animationDelay: '3s' }} />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-8 col-lg-5">
            <div className="glass-card-dark p-4 p-md-5 animate-fadeInUp">
              <div className="text-center mb-4">
                <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}
                  >
                    <i className="bi bi-heart-fill text-white fs-5" />
                  </div>
                  <span className="fw-bold fs-4 gradient-text">Doe+</span>
                </Link>
                <h4 className="text-white fw-bold">Bem-vindo de volta</h4>
                <p style={{ color: 'var(--text-muted)' }}>Entre na sua conta para continuar</p>
              </div>

              {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label text-white fw-semibold">Email</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid var(--input-group-border)', color: 'var(--text-muted)' }}>
                      <i className="bi bi-envelope" />
                    </span>
                    <input
                      {...register('email', {
                        required: 'Email é obrigatório',
                        pattern: { value: /\S+@\S+\.\S+/, message: 'Email inválido' },
                      })}
                      type="email"
                      className="form-control form-control-custom"
                      placeholder="seu@email.com"
                      style={{ borderLeft: 'none' }}
                    />
                  </div>
                  {errors.email && <div className="text-danger small mt-1">{errors.email.message}</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label text-white fw-semibold">Senha</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid var(--input-group-border)', color: 'var(--text-muted)' }}>
                      <i className="bi bi-lock" />
                    </span>
                    <input
                      {...register('senha', { required: 'Senha é obrigatória' })}
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-control-custom"
                      placeholder="••••••••"
                      style={{ borderLeft: 'none', borderRight: 'none' }}
                    />
                    <button
                      type="button"
                      className="input-group-text border-0"
                      style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid var(--input-group-border)', cursor: 'pointer', color: 'var(--text-muted)' }}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                    </button>
                  </div>
                  {errors.senha && <div className="text-danger small mt-1">{errors.senha.message}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-3 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Entrando...</>
                  ) : (
                    <><i className="bi bi-box-arrow-in-right me-2" />Entrar</>
                  )}
                </button>
              </form>

              <p className="text-center mb-0" style={{ color: 'var(--text-muted)' }}>
                Não tem conta?{' '}
                <Link to="/cadastro" className="text-decoration-none fw-semibold" style={{ color: '#6C63FF' }}>
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
