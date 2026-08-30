import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonLine } from '../../components/common/SkeletonLoader'
import { useAuth } from '../../contexts/AuthContext'
import { OngService } from '../../services/OngService'
import { CampanhaService } from '../../services/CampanhaService'
import { OngStats } from '../../types/user.types'
import { Campanha } from '../../types/campaign.types'
import { formatCurrency, getStatusColor, getStatusLabel, formatPercent } from '../../utils/formatters'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'

export function OngDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<OngStats | null>(null)
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      OngService.estatisticas(user.id).catch(() => null),
      CampanhaService.listarPorOng(user.id).catch(() => []),
    ]).then(([s, c]) => {
      setStats(s)
      setCampanhas(c as Campanha[])
    }).finally(() => setIsLoading(false))
  }, [user])

  const metrics = stats
    ? [
        { label: 'Total Campanhas', value: stats.totalCampanhas, icon: 'bi-megaphone', color: '#6C63FF', bg: 'rgba(108,99,255,0.1)' },
        { label: 'Ativas', value: stats.campanhasAtivas, icon: 'bi-activity', color: '#43D9A2', bg: 'rgba(67,217,162,0.1)' },
        { label: 'Arrecadado', value: formatCurrency(stats.totalArrecadado), icon: 'bi-cash-stack', color: '#FFD166', bg: 'rgba(255,209,102,0.1)' },
        { label: 'Doadores Ativos', value: stats.totalDoadores, icon: 'bi-people', color: '#FF6584', bg: 'rgba(255,101,132,0.1)' },
      ]
    : []

  return (
    <DashboardLayout title="Dashboard ONG">
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Olá, {user?.nome}!</h4>
          <p style={{ color: 'var(--text-muted)' }}>Acompanhe o desempenho das suas campanhas</p>
        </div>
        <Link to="/ong/campanhas/criar" className="btn btn-primary-custom px-4">
          <i className="bi bi-plus-lg me-2" />Nova Campanha
        </Link>
      </div>

      {/* Metrics */}
      <div className="row g-3 mb-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="col-sm-6 col-xl-3">
                <div className="glass-card-dark p-4"><SkeletonLine height="1rem" className="mb-2" /><SkeletonLine width="60%" height="2rem" /></div>
              </div>
            ))
          : metrics.map((m) => (
              <div key={m.label} className="col-sm-6 col-xl-3">
                <div className="metric-card d-flex align-items-center gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52, background: m.bg }}>
                    <i className={`bi ${m.icon} fs-4`} style={{ color: m.color }} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--card-text-muted)', fontSize: '0.8rem' }}>{m.label}</div>
                    <div className="text-white fw-black fs-4 lh-1">{m.value}</div>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {/* Charts */}
      {stats?.arrecadacaoPorMes && stats.arrecadacaoPorMes.length > 0 && (
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="glass-card-dark p-4">
              <h6 className="fw-bold text-white mb-4">Arrecadação por Mês</h6>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={stats.arrecadacaoPorMes}>
                  <defs>
                    <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="mes" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }} formatter={(v: number) => [formatCurrency(v), 'Arrecadado']} />
                  <Area type="monotone" dataKey="valor" stroke="#6C63FF" strokeWidth={2} fill="url(#gradArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="glass-card-dark p-4 h-100">
              <h6 className="fw-bold text-white mb-4">Doações por Mês</h6>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.arrecadacaoPorMes}>
                  <XAxis dataKey="mes" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }} />
                  <Bar dataKey="valor" fill="#43D9A2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent campaigns */}
      <div className="glass-card-dark p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="fw-bold text-white mb-0">Campanhas Recentes</h6>
          <Link to="/ong/campanhas" className="btn btn-sm" style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#6C63FF', borderRadius: 10 }}>
            Ver todas
          </Link>
        </div>
        {isLoading ? (
          <SkeletonLine height="60px" />
        ) : campanhas.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-megaphone fs-2" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }} className="mt-2 mb-3">Nenhuma campanha criada ainda.</p>
            <Link to="/ong/campanhas/criar" className="btn btn-primary-custom px-4">
              <i className="bi bi-plus-lg me-2" />Criar campanha
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ color: 'inherit' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Campanha</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Status</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Progresso</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Arrecadado</th>
                </tr>
              </thead>
              <tbody>
                {campanhas.slice(0, 5).map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td>
                      <div className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>{c.titulo}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Meta: {formatCurrency(c.metaFinanceira)}</div>
                    </td>
                    <td>
                      <span className={`badge bg-${getStatusColor(c.status)}`} style={{ fontSize: '0.72rem' }}>{getStatusLabel(c.status)}</span>
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <div className="progress progress-custom">
                        <div className="progress-bar" style={{ width: `${formatPercent(c.valorArrecadado || 0, c.metaFinanceira)}%` }} />
                      </div>
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{formatPercent(c.valorArrecadado || 0, c.metaFinanceira)}%</small>
                    </td>
                    <td>
                      <span style={{ color: '#43D9A2', fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrency(c.valorArrecadado || 0)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
