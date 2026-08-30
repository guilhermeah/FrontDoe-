import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer-custom py-5 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: 36, height: 36, background: '#6C63FF' }}
              >
                <i className="bi bi-heart-fill text-white" />
              </div>
              <span className="fw-bold fs-5" style={{ color: 'var(--text)' }}>
                Doe<span style={{ color: '#6C63FF' }}>+</span>
              </span>
            </div>
            <p className="text-muted small">
              Conectando doadores a causas que transformam vidas. Juntos, fazemos a diferença.
            </p>
            <div className="d-flex gap-3 mt-3">
              {['facebook', 'twitter-x', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-muted"
                  style={{ transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#6C63FF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
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
                { to: '/sobre', label: 'Sobre' },
                { to: '/contato', label: 'Contato' },
              ].map((item) => (
                <li key={item.to} className="mb-2">
                  <Link to={item.to} className="text-muted text-decoration-none small" style={{ transition: 'color 0.2s' }}>
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
                  <Link to={item.to} className="text-muted text-decoration-none small">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4">
            <h6 className="fw-bold mb-3">Newsletter</h6>
            <p className="text-muted small mb-3">Receba atualizações sobre campanhas e impacto social.</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control form-control-custom"
                placeholder="seu@email.com"
                style={{ borderRadius: '12px 0 0 12px' }}
              />
              <button className="btn btn-primary-custom" style={{ borderRadius: '0 12px 12px 0' }}>
                <i className="bi bi-send-fill" />
              </button>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-25" />
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p className="text-muted small mb-0">
            © {new Date().getFullYear()} Doe+. Todos os direitos reservados.
          </p>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted small text-decoration-none">Privacidade</a>
            <a href="#" className="text-muted small text-decoration-none">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
