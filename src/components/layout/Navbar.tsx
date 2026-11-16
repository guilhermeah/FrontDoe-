import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

export function Navbar() {
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link fw-medium${isActive ? ' nav-link-active' : ''}`

  return (
    <nav className="navbar navbar-expand-lg navbar-glass fixed-top" style={{ padding: '0.875rem 0' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            }}
          >
            <i className="bi bi-heart-fill text-white" style={{ fontSize: '0.85rem' }} />
          </div>
          <span className="fw-bold fs-5 gradient-text">Doe+</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <i className={`bi bi-list fs-4 ${isDark ? 'text-white' : 'text-dark'}`} />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto gap-1">
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/campanhas">Campanhas</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/ongs">ONGs</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/contato">Contato</NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-link p-2 ${isDark ? 'text-white' : 'text-dark'}`}
              onClick={toggleTheme}
              title={isDark ? 'Modo claro' : 'Modo escuro'}
              style={{ opacity: 0.7 }}
            >
              <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-fill'} fs-5`} />
            </button>

            {isLoading ? null : isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/dashboard"
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-decoration-none overflow-hidden"
                  title="Ir para o Dashboard"
                  style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}
                >
                  {(() => {
                    const local = user ? localStorage.getItem(`@doemais:avatar:${user.id}`) : null
                    const src = local ?? user?.imagemUrl
                    return src
                      ? <img src={src} alt={user?.nome} style={{ width: 32, height: 32, objectFit: 'cover' }} />
                      : user?.nome?.charAt(0).toUpperCase()
                  })()}
                </Link>
                <span className="d-none d-lg-inline fw-medium" style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--navbar-text)', fontSize: '0.875rem' }}>
                  {user?.nome}
                </span>
                <button
                  className="btn btn-outline-danger rounded-pill px-3"
                  onClick={handleLogout}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
                >
                  <i className="bi bi-box-arrow-right me-1" />Sair
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  className={`btn rounded-pill ${isDark ? 'btn-outline-light' : 'btn-outline-dark'}`}
                  style={{ fontSize: '0.82rem', padding: '0.38rem 1.1rem' }}
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="btn btn-primary-custom rounded-pill"
                  style={{ fontSize: '0.82rem', padding: '0.38rem 1.1rem' }}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
