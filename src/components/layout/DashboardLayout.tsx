import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { useTheme } from '../../contexts/ThemeContext'

interface Props {
  children: ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  return (
    <div
      className={`min-vh-100 ${isDark ? 'bg-gradient-dark' : ''}`}
      style={{ display: 'flex', background: isDark ? undefined : 'var(--bg)' }}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content flex-grow-1" style={{ minWidth: 0 }}>
        <header
          className="sticky-top d-flex align-items-center justify-content-between px-4 py-3"
          style={{
            background: isDark ? 'rgba(15,15,26,0.9)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${isDark ? 'rgba(108,99,255,0.2)' : '#e5e7eb'}`,
            zIndex: 100,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link p-0 d-md-none"
              onClick={() => setSidebarOpen(true)}
            >
              <i className={`bi bi-list fs-4 ${isDark ? 'text-white' : 'text-dark'}`} />
            </button>
            {title && (
              <h5 className={`mb-0 fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>{title}</h5>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-link p-2 ${isDark ? 'text-white' : 'text-dark'}`}
              onClick={toggleTheme}
            >
              <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-fill'} fs-5`} />
            </button>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
