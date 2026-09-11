import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { SkeletonTable } from '../../components/common/SkeletonLoader'
import { useAuth } from '../../contexts/AuthContext'
import { useDonationsByDoador } from '../../hooks/useDonations'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { doacaoContabilizada, statusLabel, statusStyle } from '../../utils/donationStatus'
import { Link } from 'react-router-dom'

export function DonationHistoryPage() {
  const { user } = useAuth()
  const { doacoes, isLoading } = useDonationsByDoador(user?.id)

  // o total é o que foi efetivamente pago — pendente e expirada ficam de fora
  const confirmadas = doacoes.filter((d) => doacaoContabilizada(d.statusDoacao))
  const total = confirmadas.reduce((acc, d) => acc + d.valor, 0)

  return (
    <DashboardLayout title="Histórico de Doações">
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Histórico de Doações</h4>
          <p style={{ color: 'var(--text-muted)' }}>{confirmadas.length} doações concluídas • Total: <span style={{ color: '#43D9A2' }}>{formatCurrency(total)}</span></p>
        </div>
        <Link to="/doador/campanhas" className="btn btn-primary-custom px-4">
          <i className="bi bi-heart me-2" />Fazer Doação
        </Link>
      </div>

      <div className="glass-card-dark p-4">
        {isLoading ? (
          <SkeletonTable rows={6} />
        ) : doacoes.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-clock-history fs-1" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }} className="mt-3 mb-4">Você ainda não realizou nenhuma doação.</p>
            <Link to="/doador/campanhas" className="btn btn-primary-custom px-5">Explorar campanhas</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle" style={{ color: 'inherit' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Campanha</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Valor</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Data</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Mensagem</th>
                  <th style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.8rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {doacoes.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 36, height: 36, background: 'rgba(67,217,162,0.1)' }}>
                          <i className="bi bi-heart" style={{ color: '#43D9A2', fontSize: '0.8rem' }} />
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
                      <span
                        style={{
                          color: doacaoContabilizada(d.statusDoacao) ? '#43D9A2' : 'var(--text-muted)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      >
                        {formatCurrency(d.valor)}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{formatDate(d.createdAt)}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{d.mensagem || '-'}</span>
                    </td>
                    <td>
                      <span
                        className="px-2 py-1 rounded-2"
                        style={{
                          background: statusStyle(d.statusDoacao).bg,
                          color: statusStyle(d.statusDoacao).color,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {statusLabel(d.statusDoacao)}
                      </span>
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
