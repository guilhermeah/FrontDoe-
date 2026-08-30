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
  { icon: 'bi-envelope', label: 'Email', value: 'contato@doemais.com.br', href: 'mailto:contato@doemais.com.br' },
  { icon: 'bi-telephone', label: 'Telefone', value: '(19) 98128-6709', href: 'tel:+5519981286709' },
  { icon: 'bi-geo-alt', label: 'Endereço', value: 'São Paulo, SP — Brasil', href: null },
  { icon: 'bi-clock', label: 'Atendimento', value: 'Segunda a sexta, das 9h às 18h', href: null },
]

const socialLinks = [
  { icon: 'bi-facebook', href: 'https://facebook.com/doemais', label: 'Facebook' },
  { icon: 'bi-instagram', href: 'https://instagram.com/doemais', label: 'Instagram' },
  { icon: 'bi-linkedin', href: 'https://linkedin.com/company/doemais', label: 'LinkedIn' },
  { icon: 'bi-twitter-x', href: 'https://x.com/doemais', label: 'X' },
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

          <div className="mb-5">
            <h1 className="fw-black display-5 mb-1">Contato</h1>
            <p style={{ color: 'var(--text-muted)' }}>Entre em contato conosco por qualquer canal abaixo.</p>
          </div>

          <div className="row g-5">
            {/* Informações */}
            <div className="col-lg-4">
              <div className="glass-card-dark p-4 mb-4">
                <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                  Informações
                </h6>
                <ul className="list-unstyled mb-0">
                  {contactInfo.map((info) => (
                    <li key={info.label} className="d-flex gap-3 align-items-start py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <i className={`bi ${info.icon} mt-1 flex-shrink-0`} style={{ color: 'var(--primary)', fontSize: '1rem' }} />
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: 2 }}>{info.label}</div>
                        {info.href ? (
                          <a href={info.href} className="fw-semibold text-decoration-none" style={{ color: 'inherit', fontSize: '0.9rem' }}>
                            {info.value}
                          </a>
                        ) : (
                          <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{info.value}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card-dark p-4">
                <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                  Redes sociais
                </h6>
                <div className="d-flex flex-column gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.icon}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center gap-3 py-2 text-decoration-none"
                      style={{ color: 'inherit', borderRadius: 8, transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                    >
                      <i className={`bi ${s.icon}`} style={{ fontSize: '1.1rem', width: 20, textAlign: 'center' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="col-lg-8">
              <div className="glass-card-dark p-4 p-md-5">
                <h5 className="fw-bold mb-1">Enviar mensagem</h5>
                <p className="mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Preencha o formulário e responderemos em até 1 dia útil.
                </p>

                {success && <Alert type="success" message="Mensagem enviada! Entraremos em contato em breve." />}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Nome</label>
                      <input
                        {...register('nome', { required: 'Nome é obrigatório' })}
                        className="form-control form-control-custom"
                        placeholder="Seu nome completo"
                      />
                      {errors.nome && <div className="text-danger small mt-1">{errors.nome.message}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        {...register('email', { required: 'Email é obrigatório' })}
                        type="email"
                        className="form-control form-control-custom"
                        placeholder="seu@email.com"
                      />
                      {errors.email && <div className="text-danger small mt-1">{errors.email.message}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Assunto</label>
                      <input
                        {...register('assunto', { required: 'Assunto é obrigatório' })}
                        className="form-control form-control-custom"
                        placeholder="Sobre o que você quer falar?"
                      />
                      {errors.assunto && <div className="text-danger small mt-1">{errors.assunto.message}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Mensagem</label>
                      <textarea
                        {...register('mensagem', { required: 'Mensagem é obrigatória' })}
                        className="form-control form-control-custom"
                        rows={6}
                        placeholder="Escreva sua mensagem..."
                      />
                      {errors.mensagem && <div className="text-danger small mt-1">{errors.mensagem.message}</div>}
                    </div>
                    <div className="col-12 pt-1">
                      <button type="submit" className="btn btn-primary-custom px-5 py-2" disabled={isSubmitting}>
                        {isSubmitting
                          ? <><span className="spinner-border spinner-border-sm me-2" />Enviando...</>
                          : <><i className="bi bi-send me-2" />Enviar mensagem</>}
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
