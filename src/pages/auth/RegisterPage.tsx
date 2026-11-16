import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { RegisterRequest, UserRole } from '../../types/auth.types'
import { Alert } from '../../components/common/Alert'

const roles: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: 'DOADOR', label: 'Doador', icon: 'bi-heart', desc: 'Quero fazer doações' },
  { value: 'ONG', label: 'ONG', icon: 'bi-building', desc: 'Represento uma ONG' },
]

function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/[^\d]/g, '')
  if (digits.length !== 14) return false
  if (/^(\d)\1+$/.test(digits)) return false

  let sum = 0
  let pos = 5
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * pos--
    if (pos < 2) pos = 9
  }
  let check = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (check !== parseInt(digits[12])) return false

  sum = 0
  pos = 6
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * pos--
    if (pos < 2) pos = 9
  }
  check = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return check === parseInt(digits[13])
}

function maskCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function validatePhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10 || digits.length === 11
}

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('DOADOR')
  const [showPassword, setShowPassword] = useState(false)
  const [cnpjValue, setCnpjValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterRequest>({
    defaultValues: { role: 'DOADOR' },
  })

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setValue('role', role)
  }

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCNPJ(e.target.value)
    setCnpjValue(masked)
    setValue('cnpj', masked)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value)
    setPhoneValue(masked)
    setValue('telefone', masked)
  }

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      await registerUser(data)
      const paths: Record<string, string> = {
        ADMIN: '/admin/dashboard',
        ONG: '/ong/dashboard',
        DOADOR: '/doador/dashboard',
      }
      navigate(paths[data.role] || '/')
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.erro ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        err?.message ||
        'Erro ao criar conta. Tente novamente.'
      setError(msg)
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
                <p style={{ color: '#8892B0' }}>Junte-se a milhares de pessoas transformando vidas</p>
              </div>

              {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

              <div className="mb-4">
                <label className="form-label text-white fw-semibold mb-3">Tipo de conta</label>
                <div className="row g-2">
                  {roles.map((r) => (
                    <div key={r.value} className="col-4">
                      <button
                        type="button"
                        className="btn w-100 h-100 text-center py-3"
                        onClick={() => handleRoleSelect(r.value)}
                        style={{
                          borderRadius: 12,
                          border: `2px solid ${selectedRole === r.value ? '#6C63FF' : 'rgba(255,255,255,0.1)'}`,
                          background: selectedRole === r.value ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.03)',
                          color: selectedRole === r.value ? '#6C63FF' : '#8892B0',
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
                    <label className="form-label text-white fw-semibold">Nome completo</label>
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

                  {selectedRole === 'ONG' && (
                    <div className="col-12">
                      <label className="form-label text-white fw-semibold">CNPJ</label>
                      <input
                        {...register('cnpj', {
                          required: 'CNPJ é obrigatório para ONG',
                          validate: (v) => validateCNPJ(v ?? '') || 'CNPJ inválido',
                        })}
                        value={cnpjValue}
                        onChange={handleCNPJChange}
                        className="form-control form-control-custom"
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                      />
                      {errors.cnpj && <div className="text-danger small mt-1">{errors.cnpj.message}</div>}
                    </div>
                  )}

                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">Telefone</label>
                    <input
                      {...register('telefone', {
                        required: 'Telefone é obrigatório',
                        validate: (v) => validatePhone(v ?? '') || 'Telefone inválido. Use o formato (00) 00000-0000',
                      })}
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      className="form-control form-control-custom"
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                    {errors.telefone && <div className="text-danger small mt-1">{errors.telefone.message}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label text-white fw-semibold">Senha</label>
                    <div className="input-group">
                      <input
                        {...register('senha', {
                          required: 'Senha é obrigatória',
                          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className="form-control form-control-custom"
                        placeholder="••••••••"
                        style={{ borderRight: 'none' }}
                      />
                      <button
                        type="button"
                        className="input-group-text border-0"
                        style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: '#8892B0' }}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                      </button>
                    </div>
                    {errors.senha && <div className="text-danger small mt-1">{errors.senha.message}</div>}
                  </div>

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

              <p className="text-center mt-3 mb-0" style={{ color: '#8892B0' }}>
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
