import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { RegisterRequest, UserRole } from '../../types/auth.types'
import { Alert } from '../../components/common/Alert'

const ROLE_PATHS: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  ONG: '/ong/dashboard',
  DOADOR: '/doador/dashboard',
}

const roles: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: 'DOADOR', label: 'Doador', icon: 'bi-heart', desc: 'Quero fazer doações' },
  { value: 'ONG', label: 'ONG', icon: 'bi-building', desc: 'Represento uma ONG' },
]

function maskCPFCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2')
  }
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function validateCPFCNPJ(value: string): boolean {
  const digits = (value ?? '').replace(/\D/g, '')
  return digits.length === 11 || digits.length === 14
}

export function RegisterPage() {
  const { register: registerUser, user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('DOADOR')
  const [showPassword, setShowPassword] = useState(false)
  const [cpfCnpjValue, setCpfCnpjValue] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterRequest>({
    defaultValues: { role: 'DOADOR' },
  })

  if (user) return <Navigate to={ROLE_PATHS[user.role] || '/'} replace />

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setValue('role', role)
  }

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCPFCNPJ(e.target.value)
    setCpfCnpjValue(masked)
    setValue('cpfCnpj', masked)
  }

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      await registerUser(data)
      navigate(ROLE_PATHS[data.role] || '/', { replace: true })
    } catch (err: any) {
      const d = err?.response?.data
      setError(d?.message || d?.mensagem || err?.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-shell min-vh-100 d-flex align-items-center justify-content-center py-5 position-relative">
      <div className="orb" style={{ width: 400, height: 400, background: '#6C63FF', top: -100, right: -100 }} />
      <div className="orb" style={{ width: 300, height: 300, background: '#43D9A2', bottom: -50, left: -50, animationDelay: '3s' }} />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-11 col-md-9 col-lg-6">
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
                <h4 className="text-white fw-bold">Criar conta</h4>
                <p style={{ color: 'var(--text-muted)' }}>Junte-se a milhares de pessoas transformando vidas</p>
              </div>

              {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

              <div className="mb-4">
                <label className="form-label text-white fw-semibold mb-3">Tipo de conta</label>
                <div className="row g-2">
                  {roles.map((r) => (
                    <div key={r.value} className="col-6">
                      <button
                        type="button"
                        className="btn w-100 h-100 text-center py-3"
                        onClick={() => handleRoleSelect(r.value)}
                        style={{
                          borderRadius: 12,
                          border: `2px solid ${selectedRole === r.value ? '#6C63FF' : 'rgba(255,255,255,0.1)'}`,
                          background: selectedRole === r.value ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
                          color: selectedRole === r.value ? '#6C63FF' : 'var(--text-muted)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <i className={`bi ${r.icon} fs-4 d-block mb-1`} />
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{r.label}</div>
                        <div style={{ fontSize: '0.7rem' }}>{r.desc}</div>
                      </button>
                    </div>
                  ))}
                </div>
                <input type="hidden" {...register('role')} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">
                      {selectedRole === 'ONG' ? 'Nome do gestor' : 'Nome completo'}
                    </label>
                    <input
                      {...register('nome', {
                        required: 'Nome é obrigatório',
                        minLength: { value: 3, message: 'Nome deve ter pelo menos 3 caracteres' },
                      })}
                      className="form-control form-control-custom"
                      placeholder="Seu nome"
                    />
                    {errors.nome && <div className="text-danger small mt-1">{errors.nome.message}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">Email</label>
                    <input
                      {...register('email', {
                        required: 'Email é obrigatório',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Email inválido',
                        },
                      })}
                      type="email"
                      className="form-control form-control-custom"
                      placeholder="seu@email.com"
                    />
                    {errors.email && <div className="text-danger small mt-1">{errors.email.message}</div>}
                  </div>

                  {selectedRole === 'DOADOR' && (
                    <div className="col-12">
                      <label className="form-label text-white fw-semibold">CPF / CNPJ</label>
                      <input
                        {...register('cpfCnpj', {
                          required: 'CPF ou CNPJ é obrigatório',
                          validate: (v) => validateCPFCNPJ(v ?? '') || 'CPF (11 dígitos) ou CNPJ (14 dígitos) inválido',
                        })}
                        value={cpfCnpjValue}
                        onChange={handleCpfCnpjChange}
                        className="form-control form-control-custom"
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        maxLength={18}
                      />
                      {errors.cpfCnpj && <div className="text-danger small mt-1">{errors.cpfCnpj.message}</div>}
                    </div>
                  )}

                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">Senha</label>
                    <div className="input-group">
                      <input
                        {...register('senha', {
                          required: 'Senha é obrigatória',
                          validate: (v) => {
                            if (v.length < 8) return 'Mínimo 8 caracteres'
                            if (!/[A-Z]/.test(v)) return 'Precisa de ao menos uma letra maiúscula'
                            if (!/[a-z]/.test(v)) return 'Precisa de ao menos uma letra minúscula'
                            if (!/\d/.test(v)) return 'Precisa de ao menos um número'
                            if (!/[@#$%^&+=!*()_\-]/.test(v)) return 'Precisa de ao menos um símbolo especial (@#$%...)'
                            return true
                          },
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className="form-control form-control-custom"
                        placeholder="••••••••"
                        style={{ borderRight: 'none' }}
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

                  {selectedRole === 'ONG' && (
                    <div className="col-12">
                      <div className="p-3 rounded-3" style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}>
                        <i className="bi bi-info-circle me-2" style={{ color: '#6C63FF' }} />
                        <small style={{ color: 'var(--text-muted)' }}>
                          Sua conta será criada como gestora de ONG. A vinculação com a ONG será feita pelo administrador.
                        </small>
                      </div>
                    </div>
                  )}

                  <div className="col-12 pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary-custom w-100 py-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Criando conta...</>
                      ) : (
                        <><i className="bi bi-person-plus me-2" />Criar conta</>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <p className="text-center mt-3 mb-0" style={{ color: 'var(--text-muted)' }}>
                Já tem conta?{' '}
                <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#6C63FF' }}>
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
