import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

interface SidebarItem {
  to: string
  icon: string
  label: string
  end?: boolean
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

const adminItems: SidebarItem[] = [
  { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/admin/usuarios', icon: 'bi-people', label: 'Usuários' },
  { to: '/admin/ongs', icon: 'bi-building', label: 'ONGs' },
  { to: '/admin/campanhas', icon: 'bi-megaphone', label: 'Campanhas' },
  { to: '/admin/doacoes', icon: 'bi-currency-dollar', label: 'Doações' },
]

const ongItems: SidebarItem[] = [
  { to: '/ong/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/ong/campanhas', icon: 'bi-megaphone', label: 'Campanhas', end: true },
  { to: '/ong/campanhas/criar', icon: 'bi-plus-circle', label: 'Nova Campanha' },
  { to: '/ong/doacoes', icon: 'bi-box-arrow-in-down', label: 'Doações Recebidas' },
  { to: '/ong/perfil', icon: 'bi-person-circle', label: 'Perfil' },
]

const doadorItems: SidebarItem[] = [
  { to: '/doador/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/doador/campanhas', icon: 'bi-heart', label: 'Campanhas' },
  { to: '/doador/historico', icon: 'bi-clock-history', label: 'Histórico' },
  { to: '/doador/perfil', icon: 'bi-person-circle', label: 'Perfil' },
]

function getNavItems(role?: string): SidebarItem[] {
  if (role === 'ADMIN') return adminItems
  if (role === 'ONG') return ongItems
  return doadorItems
}

export function Sidebar({ isOpen, onClose }: Props) {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = getNavItems(user?.role)

  return (
    <>
      {isOpen && (
        <div
          className="d-md-none position-fixed inset-0"
          style={{ inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar d-flex flex-column`}
        style={{
          background: 'var(--card-secondary)',
          borderRight: '1px solid var(--glass-border)',
          transform: isOpen ? 'translateX(0)' : '',
        }}
      >
        <div className="p-4 border-bottom" style={{ borderColor: 'rgba(108,99,255,0.2) !important' }}>
          <NavLink to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{ width: 36, height: 36, background: '#6C63FF' }}
            >
              <i className="bi bi-heart-fill text-white" />
            </div>
            <span className="fw-bold fs-5" style={{ color: 'var(--text)' }}>
              Doe<span style={{ color: '#6C63FF' }}>+</span>
            </span>
          </NavLink>
        </div>

        <div className="p-3 border-bottom d-flex align-items-center gap-3" style={{ borderColor: 'rgba(108,99,255,0.1) !important' }}>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden"
            style={{
              width: 42,
              height: 42,
              background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'white',
            }}
          >
            {user?.imagemUrl
              ? <img src={user.imagemUrl} alt={user.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              : user?.nome?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden" style={{ color: 'var(--text)' }}>
            <div className="fw-semibold text-truncate" style={{ fontSize: '0.9rem' }}>{user?.nome}</div>
            <div className="small" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user?.role}</div>
          </div>
        </div>

        <nav className="flex-grow-1 p-3 overflow-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => window.innerWidth < 768 && onClose()}
            >
              <i className={`bi ${item.icon} fs-5`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-top" style={{ borderColor: 'rgba(108,99,255,0.2) !important' }}>
          <button
            className="sidebar-nav-item w-100 border-0 bg-transparent"
            onClick={handleLogout}
            style={{ color: '#FF6584' }}
          >
            <i className="bi bi-box-arrow-right fs-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
