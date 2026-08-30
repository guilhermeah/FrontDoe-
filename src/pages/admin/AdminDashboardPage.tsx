import { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { useDashboard } from '../../hooks/useDashboard'
import { SkeletonLine, SkeletonTable } from '../../components/common/SkeletonLoader'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { UsuarioService } from '../../services/UsuarioService'
import { OngService } from '../../services/OngService'
import { CampanhaService } from '../../services/CampanhaService'
import { DoacaoService } from '../../services/DoacaoService'
import { Usuario } from '../../types/user.types'
import { Campanha } from '../../types/campaign.types'
import { Doacao } from '../../types/donation.types'
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

function OverviewSection() {
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
    <>
      <div className="dashboard-header mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Visão Geral</h4>
        <p style={{ color: 'var(--text-muted)' }}>Acompanhe os indicadores da plataforma</p>
      </div>

      <div className="row g-3 mb-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="col-sm-6 col-xl-4">
                <div className="glass-card-dark p-4">
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
                    <div className="text-white fw-black fs-4 lh-1">{m.value}</div>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="glass-card-dark p-4">
            <h6 className="fw-bold text-white mb-4">Arrecadação Mensal (R$)</h6>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }}
                  labelStyle={{ color: 'var(--text)' }}
                  formatter={(v: number) => [formatCurrency(v), 'Arrecadado']}
                />
                <Bar dataKey="valor" fill="#6C63FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card-dark p-4 h-100">
            <h6 className="fw-bold text-white mb-4">Status das Campanhas</h6>
            {!isLoading && resumo && (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="d-flex justify-content-center gap-4 mt-2">
                  {pieData.map((entry, i) => (
                    <div key={entry.name} className="d-flex align-items-center gap-2">
                      <div className="rounded-circle" style={{ width: 10, height: 10, background: COLORS[i] }} />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="glass-card-dark p-4">
            <h6 className="fw-bold text-white mb-4">Evolução de Doadores</h6>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockChartData.map((d, i) => ({ ...d, doadores: 120 + i * 45 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12 }} />
                <Line type="monotone" dataKey="doadores" stroke="#43D9A2" strokeWidth={2} dot={{ fill: '#43D9A2', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}

function UsuariosSection() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    UsuarioService.listar()
      .then(setUsuarios)
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() =>
    usuarios.filter((u) =>
      !search ||
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    ), [usuarios, search])

  return (
    <>
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Usuários</h4>
        <p style={{ color: 'var(--text-muted)' }}>{usuarios.length} usuários cadastrados</p>
      </div>
      <div className="glass-card-dark p-4">
        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-custom"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>
        {isLoading ? <SkeletonTable rows={6} /> : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ color: 'inherit' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Nome</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Email</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Tipo</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Telefone</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={`${u.role}-${u.id}`} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 32, height: 32, background: u.role === 'ONG' ? 'rgba(108,99,255,0.2)' : 'rgba(67,217,162,0.2)', fontSize: '0.75rem', fontWeight: 700, color: u.role === 'ONG' ? '#6C63FF' : '#43D9A2' }}>
                          {u.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>{u.nome}</span>
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.email}</span></td>
                    <td>
                      <span className="badge" style={{
                        background: u.role === 'ONG' ? 'rgba(108,99,255,0.2)' : 'rgba(67,217,162,0.2)',
                        color: u.role === 'ONG' ? '#6C63FF' : '#43D9A2',
                        fontSize: '0.72rem',
                      }}>{u.role}</span>
                    </td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.telefone || '—'}</span></td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.createdAt ? formatDate(u.createdAt) : '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-4">
                <p style={{ color: 'var(--text-muted)' }}>Nenhum usuário encontrado.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function OngsSection() {
  const [ongs, setOngs] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    OngService.listar()
      .then((result) => setOngs(result.ongs))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() =>
    ongs.filter((o) =>
      !search ||
      o.nome.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    ), [ongs, search])

  return (
    <>
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>ONGs</h4>
        <p style={{ color: 'var(--text-muted)' }}>{ongs.length} ONGs cadastradas</p>
      </div>
      <div className="glass-card-dark p-4">
        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-custom"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>
        {isLoading ? <SkeletonTable rows={6} /> : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ color: 'inherit' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Nome</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Email</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>CNPJ</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Localização</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Telefone</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 32, height: 32, background: 'rgba(108,99,255,0.2)', fontSize: '0.75rem', fontWeight: 700, color: '#6C63FF' }}>
                          {o.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>{o.nome}</span>
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{o.email}</span></td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{o.cnpj || '—'}</span></td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{o.localizacao || '—'}</span></td>
                    <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{o.telefone || '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-4">
                <p style={{ color: 'var(--text-muted)' }}>Nenhuma ONG encontrada.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function CampanhasSection() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    CampanhaService.listar()
      .then(setCampanhas)
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() =>
    campanhas.filter((c) =>
      !search || c.titulo.toLowerCase().includes(search.toLowerCase())
    ), [campanhas, search])

  const statusStyle: Record<string, { bg: string; color: string }> = {
    ATIVA: { bg: 'rgba(67,217,162,0.15)', color: '#43D9A2' },
    ENCERRADA: { bg: 'rgba(255,101,132,0.15)', color: '#FF6584' },
    PAUSADA: { bg: 'rgba(255,209,102,0.15)', color: '#FFD166' },
  }

  return (
    <>
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Campanhas</h4>
        <p style={{ color: 'var(--text-muted)' }}>{campanhas.length} campanhas cadastradas</p>
      </div>
      <div className="glass-card-dark p-4">
        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-custom"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>
        {isLoading ? <SkeletonTable rows={6} /> : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ color: 'inherit' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Título</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>ONG</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Status</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Meta</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Arrecadado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const st = statusStyle[c.status] ?? { bg: 'rgba(136,146,176,0.15)', color: 'var(--text-muted)' }
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td>
                        <span className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>{c.titulo}</span>
                      </td>
                      <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.ongNome || `ONG #${c.ongId}`}</span></td>
                      <td>
                        <span className="px-2 py-1 rounded-2" style={{ background: st.bg, color: st.color, fontSize: '0.72rem', fontWeight: 600 }}>
                          {c.status}
                        </span>
                      </td>
                      <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{formatCurrency(c.metaFinanceira)}</span></td>
                      <td><span style={{ color: '#43D9A2', fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrency(c.valorArrecadado || 0)}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-4">
                <p style={{ color: 'var(--text-muted)' }}>Nenhuma campanha encontrada.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function DoacoesSection() {
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    DoacaoService.listar()
      .then(setDoacoes)
      .finally(() => setIsLoading(false))
  }, [])

  const statusStyle: Record<string, { bg: string; color: string }> = {
    CONFIRMADA: { bg: 'rgba(67,217,162,0.15)', color: '#43D9A2' },
    PENDENTE: { bg: 'rgba(255,209,102,0.15)', color: '#FFD166' },
    CANCELADA: { bg: 'rgba(255,101,132,0.15)', color: '#FF6584' },
  }

  return (
    <>
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Doações</h4>
        <p style={{ color: 'var(--text-muted)' }}>{doacoes.length} doações registradas</p>
      </div>
      <div className="glass-card-dark p-4">
        {isLoading ? <SkeletonTable rows={6} /> : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ color: 'inherit' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Campanha</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Doador</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Valor</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Status</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {doacoes.map((d) => {
                  const st = statusStyle[(d.statusDoacao ?? '').toUpperCase()] ?? { bg: 'rgba(136,146,176,0.15)', color: 'var(--text-muted)' }
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td><span className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>{d.campanhaTitulo || `Campanha #${d.campanhaId}`}</span></td>
                      <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{d.doadorNome || `Doador #${d.doadorId}`}</span></td>
                      <td><span style={{ color: '#43D9A2', fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrency(d.valor)}</span></td>
                      <td>
                        <span className="px-2 py-1 rounded-2" style={{ background: st.bg, color: st.color, fontSize: '0.72rem', fontWeight: 600 }}>
                          {d.statusDoacao ?? '—'}
                        </span>
                      </td>
                      <td><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{d.createdAt ? formatDate(d.createdAt) : '—'}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {doacoes.length === 0 && (
              <div className="text-center py-4">
                <p style={{ color: 'var(--text-muted)' }}>Nenhuma doação encontrada.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export function AdminDashboardPage() {
  const location = useLocation()
  const section = location.pathname.split('/')[2] || 'dashboard'

  const titles: Record<string, string> = {
    dashboard: 'Dashboard Administrativo',
    usuarios: 'Usuários',
    ongs: 'ONGs',
    campanhas: 'Campanhas',
    doacoes: 'Doações',
  }

  return (
    <DashboardLayout title={titles[section] ?? 'Admin'}>
      {section === 'dashboard' && <OverviewSection />}
      {section === 'usuarios' && <UsuariosSection />}
      {section === 'ongs' && <OngsSection />}
      {section === 'campanhas' && <CampanhasSection />}
      {section === 'doacoes' && <DoacoesSection />}
    </DashboardLayout>
  )
}
