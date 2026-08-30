import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonLine } from '../../components/common/SkeletonLoader'
import { useAuth } from '../../contexts/AuthContext'
import { DoacaoService } from '../../services/DoacaoService'
import { Doacao } from '../../types/donation.types'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function DonorDashboardPage() {
  const { user } = useAuth()
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    DoacaoService.listarPorDoador(user.id)
      .then(setDoacoes)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [user])

  const totalDoado = doacoes.reduce((acc, d) => acc + d.valor, 0)
  const campanhasApoiadas = new Set(doacoes.map((d) => d.campanhaId)).size

  const chartData = doacoes
    .slice(-6)
    .map((d) => ({
      data: formatDate(d.createdAt),
      valor: d.valor,
    }))

  const metrics = [
    { label: 'Total Doado', value: formatCurrency(totalDoado), icon: 'bi-cash-stack', color: '#43D9A2', bg: 'rgba(67,217,162,0.1)' },
    { label: 'Doações Realizadas', value: doacoes.length, icon: 'bi-heart', color: '#FF6584', bg: 'rgba(255,101,132,0.1)' },
    { label: 'Campanhas Apoiadas', value: campanhasApoiadas, icon: 'bi-megaphone', color: '#6C63FF', bg: 'rgba(108,99,255,0.1)' },
  ]

  return (
    <DashboardLayout title="Meu Dashboard">
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Olá, {user?.nome}!</h4>
        <p style={{ color: 'var(--text-muted)' }}>Obrigado pelo seu impacto social</p>
      </div>

      <div className="row g-3 mb-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="col-sm-4">
                <div className="glass-card-dark p-4"><SkeletonLine height="1rem" className="mb-2" /><SkeletonLine width="60%" height="2rem" /></div>
              </div>
            ))
          : metrics.map((m) => (
              <div key={m.label} className="col-sm-4">
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

      {doacoes.length > 0 && (
        <div className="glass-card-dark p-4 mb-4">
          <h6 className="fw-bold text-white mb-4">Histórico de Doações</h6>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#43D9A2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#43D9A2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="data" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }} formatter={(v: number) => [formatCurrency(v), 'Doação']} />
              <Area type="monotone" dataKey="valor" stroke="#43D9A2" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="glass-card-dark p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="fw-bold text-white mb-0">Últimas Doações</h6>
          <Link to="/doador/historico" className="btn btn-sm" style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#6C63FF', borderRadius: 10 }}>
            Ver todas
          </Link>
        </div>
        {isLoading ? (
          <SkeletonLine height="60px" />
        ) : doacoes.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-heart fs-2" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }} className="mt-2 mb-3">Você ainda não realizou nenhuma doação.</p>
            <Link to="/doador/campanhas" className="btn btn-primary-custom px-4">Explorar campanhas</Link>
          </div>
        ) : (
          doacoes.slice(0, 5).map((d) => (
            <div key={d.id} className="d-flex align-items-center justify-content-between py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: 'rgba(67,217,162,0.1)' }}>
                  <i className="bi bi-heart" style={{ color: '#43D9A2' }} />
                </div>
                <div>
                  <div className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>{d.campanhaTitulo || `Campanha #${d.campanhaId}`}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{formatDate(d.createdAt)}</div>
                </div>
              </div>
              <span style={{ color: '#43D9A2', fontWeight: 700 }}>{formatCurrency(d.valor)}</span>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}
