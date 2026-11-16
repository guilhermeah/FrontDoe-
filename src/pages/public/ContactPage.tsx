import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { Alert } from '../../components/common/Alert'

interface ContactForm {
  nome: string
  email: string
  assunto: string
  mensagem: string
}

const contactInfo = [
  { icon: 'bi-envelope', label: 'Email', value: 'guilhermehenriquea80@gmail.com', color: '#6C63FF' },
  { icon: 'bi-telephone', label: 'Telefone', value: '(19) 98128-6709', color: '#43D9A2' },
  { icon: 'bi-geo-alt', label: 'Endereço', value: 'São Paulo, SP - Brasil', color: '#FF6584' },
  { icon: 'bi-clock', label: 'Horário', value: 'Seg-Sex, 9h às 18h', color: '#FFD166' },
]

export function ContactPage() {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>()

  const onSubmit = async (_data: ContactForm) => {
    await new Promise((r) => setTimeout(r, 1000))
    setSuccess(true)
    reset()
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="page-shell">
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <div className="container py-5">

          <div className="text-center mb-5">
            <span className="label-caps d-block mb-2">Contato</span>
            <h1 className="fw-black display-5 mb-2">Entre em <span className="gradient-text">contato</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Estamos aqui para ajudar</p>
          </div>

          <div className="row g-5">
            <div className="col-lg-5">
              <div className="surface-card p-4 mb-4">
                <h5 className="fw-bold mb-4" style={{ color: 'var(--card-text)' }}>Informações de contato</h5>
                {contactInfo.map((info) => (
                  <div key={info.label} className="d-flex align-items-center gap-3 mb-4">
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44, background: `${info.color}15` }}>
                      <i className={`bi ${info.icon}`} style={{ color: info.color }} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{info.label}</div>
                      <div className="fw-semibold" style={{ color: 'var(--card-text)' }}>{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="surface-card p-4">
                <h6 className="fw-bold mb-3" style={{ color: 'var(--card-text)' }}>Redes sociais</h6>
                <div className="d-flex gap-3">
                  {['facebook', 'instagram', 'linkedin', 'twitter-x'].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 44, height: 44, background: 'rgba(108,99,255,0.08)', color: '#6C63FF', transition: 'all 0.2s', textDecoration: 'none', border: '1px solid rgba(108,99,255,0.18)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(108,99,255,0.2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(108,99,255,0.08)')}
                    >
                      <i className={`bi bi-${s}`} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="surface-card p-4 p-md-5">
                <h5 className="fw-bold mb-4" style={{ color: 'var(--card-text)' }}>Envie uma mensagem</h5>
                {success && <Alert type="success" message="Mensagem enviada com sucesso! Entraremos em contato em breve." />}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ color: 'var(--card-text)' }}>Nome</label>
                      <input {...register('nome', { required: 'Nome é obrigatório' })} className="form-control form-control-custom" placeholder="Seu nome" />
                      {errors.nome && <div className="text-danger small mt-1">{errors.nome.message}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ color: 'var(--card-text)' }}>Email</label>
                      <input {...register('email', { required: 'Email é obrigatório' })} type="email" className="form-control form-control-custom" placeholder="seu@email.com" />
                      {errors.email && <div className="text-danger small mt-1">{errors.email.message}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold" style={{ color: 'var(--card-text)' }}>Assunto</label>
                      <input {...register('assunto', { required: 'Assunto é obrigatório' })} className="form-control form-control-custom" placeholder="Como podemos ajudar?" />
                      {errors.assunto && <div className="text-danger small mt-1">{errors.assunto.message}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold" style={{ color: 'var(--card-text)' }}>Mensagem</label>
                      <textarea {...register('mensagem', { required: 'Mensagem é obrigatória' })} className="form-control form-control-custom" rows={5} placeholder="Escreva sua mensagem..." />
                      {errors.mensagem && <div className="text-danger small mt-1">{errors.mensagem.message}</div>}
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary-custom px-5 py-3" disabled={isSubmitting}>
                        {isSubmitting
                          ? <><span className="spinner-border spinner-border-sm me-2" />Enviando...</>
                          : <><i className="bi bi-send me-2" />Enviar mensagem</>
                        }
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
