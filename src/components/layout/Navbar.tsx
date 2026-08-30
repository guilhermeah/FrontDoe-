import { Link, useNavigate } from 'react-router-dom'
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

  return (
    <nav className="navbar navbar-expand-lg navbar-glass fixed-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 36, height: 36, background: '#6C63FF' }}
          >
            <i className="bi bi-heart-fill text-white" style={{ fontSize: '1rem' }} />
          </div>
          <span className="fw-bold fs-5" style={{ color: 'var(--text)' }}>
            Doe<span style={{ color: '#6C63FF' }}>+</span>
          </span>
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
              <Link className="nav-link fw-medium" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/campanhas">Campanhas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/ongs">ONGs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/sobre">Sobre</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/contato">Contato</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-link p-2 ${isDark ? 'text-white' : 'text-dark'}`}
              onClick={toggleTheme}
              title={isDark ? 'Modo claro' : 'Modo escuro'}
            >
              <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-fill'} fs-5`} />
            </button>

            {isLoading ? null : isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to={
                    user?.role === 'ADMIN' ? '/admin/dashboard' :
                    user?.role === 'ONG' ? '/ong/dashboard' :
                    '/doador/dashboard'
                  }
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-decoration-none overflow-hidden"
                  title="Ir para o Dashboard"
                  style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}
                >
                  {user?.imagemUrl
                    ? <img src={user.imagemUrl} alt={user.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                    : user?.nome?.charAt(0).toUpperCase()}
                </Link>
                <span className="d-none d-lg-inline fw-medium" style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--navbar-text)' }}>
                  {user?.nome}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1" />Sair
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className={`btn rounded-pill px-4 ${isDark ? 'btn-outline-light' : 'btn-outline-dark'}`}>
                  Entrar
                </Link>
                <Link to="/cadastro" className="btn btn-primary-custom rounded-pill px-4">
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
