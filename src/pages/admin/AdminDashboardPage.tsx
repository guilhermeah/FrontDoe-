import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { useDashboard } from '../../hooks/useDashboard'
import { SkeletonLine } from '../../components/common/SkeletonLoader'
import { formatCurrency } from '../../utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

const COLORS = ['#6C63FF', '#FF6584', '#43D9A2', '#FFD166']

const mockChartData = [
  { mes: 'Jan', valor: 42000 },
  { mes: 'Fev', valor: 58000 },
  { mes: 'Mar', valor: 35000 },
  { mes: 'Abr', valor: 72000 },
  { mes: 'Mai', valor: 89000 },
  { mes: 'Jun', valor: 65000 },
]

export function AdminDashboardPage() {
  const { resumo, isLoading } = useDashboard()

  const metrics = resumo
    ? [
        { label: 'Total ONGs', value: resumo.totalOngs, icon: 'bi-building', color: '#6C63FF', bg: 'rgba(108,99,255,0.1)' },
        { label: 'Campanhas', value: resumo.totalCampanhas, icon: 'bi-megaphone', color: '#FF6584', bg: 'rgba(255,101,132,0.1)' },
        { label: 'Doadores', value: resumo.totalDoadores, icon: 'bi-people', color: '#43D9A2', bg: 'rgba(67,217,162,0.1)' },
        { label: 'Arrecadado', value: formatCurrency(resumo.totalArrecadado), icon: 'bi-cash-stack', color: '#FFD166', bg: 'rgba(255,209,102,0.1)' },
        { label: 'Ativas', value: resumo.campanhasAtivas, icon: 'bi-activity', color: '#4ECDC4', bg: 'rgba(78,205,196,0.1)' },
        { label: 'Total Doações', value: resumo.totalDoacoes, icon: 'bi-heart', color: '#A8E6CF', bg: 'rgba(168,230,207,0.1)' },
      ]
    : []

  const pieData = resumo
    ? [
        { name: 'Ativas', value: resumo.campanhasAtivas },
        { name: 'Encerradas', value: resumo.totalCampanhas - resumo.campanhasAtivas },
      ]
    : []

  return (
    <DashboardLayout title="Dashboard Administrativo">
      <div className="dashboard-header mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Visão Geral</h4>
        <p style={{ color: 'var(--text-muted)' }}>Acompanhe os indicadores da plataforma</p>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="col-sm-6 col-xl-4">
                <div className="surface-card p-4">
                  <SkeletonLine height="1rem" className="mb-2" />
                  <SkeletonLine width="60%" height="2rem" />
                </div>
              </div>
            ))
          : metrics.map((m) => (
              <div key={m.label} className="col-sm-6 col-xl-4">
                <div className="metric-card d-flex align-items-center gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 56, height: 56, background: m.bg }}>
                    <i className={`bi ${m.icon} fs-4`} style={{ color: m.color }} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--card-text-muted)', fontSize: '0.8rem' }}>{m.label}</div>
                    <div className="fw-black fs-4 lh-1" style={{ color: 'var(--card-text)' }}>{m.value}</div>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="chart-card">
            <h6 className="fw-bold mb-4" style={{ color: 'var(--glass-dark-text)' }}>Arrecadação Mensal (R$)</h6>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="mes" tick={{ fill: '#8892B0', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8892B0', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(v: number) => [formatCurrency(v), 'Arrecadado']}
                />
                <Bar dataKey="valor" fill="#6C63FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="chart-card h-100">
            <h6 className="fw-bold mb-4" style={{ color: 'var(--glass-dark-text)' }}>Status das Campanhas</h6>
            {!isLoading && resumo && (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="d-flex justify-content-center gap-4 mt-2">
                  {pieData.map((entry, i) => (
                    <div key={entry.name} className="d-flex align-items-center gap-2">
                      <div className="rounded-circle" style={{ width: 10, height: 10, background: COLORS[i] }} />
                      <span style={{ color: '#8892B0', fontSize: '0.8rem' }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="chart-card">
            <h6 className="fw-bold mb-4" style={{ color: 'var(--glass-dark-text)' }}>Evolução de Doadores</h6>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockChartData.map((d, i) => ({ ...d, doadores: 120 + i * 45 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="mes" tick={{ fill: '#8892B0', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8892B0', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }} />
                <Line type="monotone" dataKey="doadores" stroke="#43D9A2" strokeWidth={2} dot={{ fill: '#43D9A2', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
