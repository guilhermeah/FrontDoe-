import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer className="footer-custom py-5 mt-auto">
      <style>{`
        .footer-social-link { transition: color 0.2s; }
        .footer-social-link:hover { color: #6C63FF !important; }
        .footer-nav-link { transition: color 0.2s; }
        .footer-nav-link:hover { color: #6C63FF !important; }
      `}</style>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}
              >
                <i className="bi bi-heart-fill text-white" />
              </div>
              <span className="fw-bold fs-5 gradient-text">Doe+</span>
            </div>
            <p className="text-muted small">
              Conectando doadores a causas que transformam vidas. Juntos, fazemos a diferença.
            </p>
            <div className="d-flex gap-3 mt-3">
              {['facebook', 'twitter-x', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-muted footer-social-link"
                >
                  <i className={`bi bi-${social} fs-5`} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-sm-6 col-lg-2">
            <h6 className="fw-bold mb-3">Plataforma</h6>
            <ul className="list-unstyled">
              {[
                { to: '/campanhas', label: 'Campanhas' },
                { to: '/ongs', label: 'ONGs' },
                { to: '/contato', label: 'Contato' },
              ].map((item) => (
                <li key={item.to} className="mb-2">
                  <Link to={item.to} className="text-muted text-decoration-none small footer-nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-sm-6 col-lg-2">
            <h6 className="fw-bold mb-3">Conta</h6>
            <ul className="list-unstyled">
              {[
                { to: '/login', label: 'Entrar' },
                { to: '/cadastro', label: 'Cadastrar' },
              ].map((item) => (
                <li key={item.to} className="mb-2">
                  <Link to={item.to} className="text-muted text-decoration-none small footer-nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4">
            <h6 className="fw-bold mb-3">Newsletter</h6>
            <p className="text-muted small mb-3">Receba atualizações sobre campanhas e impacto social.</p>
            {subscribed ? (
              <div className="alert alert-success py-2 px-3 small mb-0" style={{ borderRadius: 12 }}>
                <i className="bi bi-check-circle me-2" />Obrigado! Em breve você receberá novidades.
              </div>
            ) : (
              <form onSubmit={handleNewsletter}>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control form-control-custom"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ borderRadius: '12px 0 0 12px' }}
                  />
                  <button type="submit" className="btn btn-primary-custom" style={{ borderRadius: '0 12px 12px 0' }}>
                    <i className="bi bi-send-fill" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <hr className="border-secondary opacity-25" />
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p className="text-muted small mb-0">
            © {new Date().getFullYear()} Doe+. Todos os direitos reservados.
          </p>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted small text-decoration-none footer-nav-link">Privacidade</a>
            <a href="#" className="text-muted small text-decoration-none footer-nav-link">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
