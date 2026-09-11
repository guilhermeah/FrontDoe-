import { useState, useMemo } from 'react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonTable } from '../../components/common/SkeletonLoader'
import { useAuth } from '../../contexts/AuthContext'
import { useDonationsByOng } from '../../hooks/useDonations'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { doacaoContabilizada, statusKey, statusLabel, statusStyle } from '../../utils/donationStatus'

const TIPO_LABELS: Record<string, string> = {
  FINANCEIRA: 'Financeira',
  financeira: 'Financeira',
  MATERIAL: 'Material',
  material: 'Material',
  SERVICO: 'Serviço',
  servico: 'Serviço',
}

export function OngDonationsPage() {
  const { user } = useAuth()
  const { doacoes, isLoading, error } = useDonationsByOng(user?.id)
  const [search, setSearch] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  const filtered = useMemo(() => {
    return doacoes.filter((d) => {
      const matchSearch =
        !search ||
        (d.campanhaTitulo ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (d.doadorNome ?? '').toLowerCase().includes(search.toLowerCase())
      const matchTipo = !filtroTipo || (d.tipoDoacao ?? '').toUpperCase() === filtroTipo
      return matchSearch && matchTipo
    })
  }, [doacoes, search, filtroTipo])

  // pendente/expirada/cancelada não entra no dinheiro que a ONG realmente tem
  const contabilizadas = doacoes.filter((d) => doacaoContabilizada(d.statusDoacao))
  const totalArrecadado = contabilizadas.reduce((acc, d) => acc + d.valor, 0)
  const aguardandoPagamento = doacoes.filter((d) => statusKey(d.statusDoacao) === 'pendente').length
  const mediaValor = contabilizadas.length > 0 ? totalArrecadado / contabilizadas.length : 0

  const metrics = [
    { label: 'Total Recebidas', value: contabilizadas.length, icon: 'bi-box-arrow-in-down', color: '#6C63FF', bg: 'rgba(108,99,255,0.1)' },
    { label: 'Valor Confirmado', value: formatCurrency(totalArrecadado), icon: 'bi-cash-stack', color: '#43D9A2', bg: 'rgba(67,217,162,0.1)' },
    { label: 'Aguardando Pagamento', value: aguardandoPagamento, icon: 'bi-clock-history', color: '#FFD166', bg: 'rgba(255,209,102,0.1)' },
    { label: 'Média por Doação', value: formatCurrency(mediaValor), icon: 'bi-graph-up', color: '#FF6584', bg: 'rgba(255,101,132,0.1)' },
  ]

  return (
    <DashboardLayout title="Doações Recebidas">
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Doações Recebidas</h4>
        <p style={{ color: 'var(--text-muted)' }}>
          Todas as doações direcionadas às campanhas da sua ONG
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="row g-3 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="col-sm-6 col-xl-3">
            <div className="metric-card d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 52, height: 52, background: m.bg }}
              >
                <i className={`bi ${m.icon} fs-4`} style={{ color: m.color }} />
              </div>
              <div>
                <div style={{ color: 'var(--card-text-muted)', fontSize: '0.8rem' }}>{m.label}</div>
                <div className="text-white fw-black fs-4 lh-1">{m.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="glass-card-dark p-4">
        <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
          <div className="flex-grow-1" style={{ minWidth: 220 }}>
            <div className="input-group">
              <span
                className="input-group-text"
                style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <i className="bi bi-search" />
              </span>
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="Buscar por campanha ou doador..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderLeft: 'none' }}
              />
            </div>
          </div>
          <select
            className="form-select form-control-custom"
            style={{ width: 'auto', minWidth: 160 }}
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="FINANCEIRA">Financeira</option>
            <option value="MATERIAL">Material</option>
            <option value="SERVICO">Serviço</option>
          </select>
          {(search || filtroTipo) && (
            <button
              className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', borderRadius: 10 }}
              onClick={() => { setSearch(''); setFiltroTipo('') }}
            >
              <i className="bi bi-x-lg me-1" />Limpar
            </button>
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>
            {filtered.length} de {doacoes.length} doações
          </span>
        </div>

        {/* Tabela */}
        {isLoading ? (
          <SkeletonTable rows={6} />
        ) : error ? (
          <div className="text-center py-5">
            <i className="bi bi-exclamation-triangle fs-2" style={{ color: '#FF6584' }} />
            <p style={{ color: 'var(--text-muted)' }} className="mt-3">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox fs-1" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }} className="mt-3 mb-0">
              {doacoes.length === 0
                ? 'Nenhuma doação recebida ainda.'
                : 'Nenhuma doação encontrada com os filtros aplicados.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0" style={{ color: 'inherit' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Campanha</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Doador</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Tipo</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Valor</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Status</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const badge = statusStyle(d.statusDoacao)
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: 34, height: 34, background: 'rgba(108,99,255,0.12)' }}
                          >
                            <i className="bi bi-megaphone" style={{ color: '#6C63FF', fontSize: '0.75rem' }} />
                          </div>
                          <div>
                            <div className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>
                              {d.campanhaTitulo || `Campanha #${d.campanhaId}`}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>ID #{d.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-white" style={{ fontSize: '0.875rem' }}>
                          {d.doadorNome || (d.doadorId ? `Doador #${d.doadorId}` : '—')}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          {TIPO_LABELS[d.tipoDoacao ?? ''] || d.tipoDoacao || '—'}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            color: doacaoContabilizada(d.statusDoacao) ? '#43D9A2' : 'var(--text-muted)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                          }}
                        >
                          {d.valor > 0 ? formatCurrency(d.valor) : '—'}
                        </span>
                      </td>
                      <td>
                        <span
                          className="px-2 py-1 rounded-2"
                          style={{ background: badge.bg, color: badge.color, fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          {statusLabel(d.statusDoacao)}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          {d.createdAt ? formatDate(d.createdAt) : '—'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
