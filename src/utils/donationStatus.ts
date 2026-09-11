/**
 * Status de doação usados pela API (coluna doacoes.status_doacao).
 *
 * Doação financeira nasce `pendente` (PIX gerado, ainda não pago), vira
 * `confirmada` quando o pagamento é confirmado ou `expirada` quando o prazo
 * de 15 minutos acaba. Doação material entra direto como `recebida`.
 *
 * Só o que está fora de NAO_CONTABILIZADOS soma no total da campanha —
 * a mesma regra vale no back-end (DoacaoRepository.NAO_CONTABILIZADAS).
 */

const NAO_CONTABILIZADOS = ['pendente', 'expirada', 'cancelada']

export const STATUS_LABELS: Record<string, string> = {
  pendente: 'Aguardando pagamento',
  confirmada: 'Confirmada',
  recebida: 'Recebida',
  expirada: 'Expirada',
  cancelada: 'Cancelada',
}

export const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pendente:   { bg: 'rgba(255,209,102,0.15)', color: '#FFD166' },
  confirmada: { bg: 'rgba(67,217,162,0.15)',  color: '#43D9A2' },
  recebida:   { bg: 'rgba(67,217,162,0.15)',  color: '#43D9A2' },
  expirada:   { bg: 'rgba(136,146,176,0.18)', color: '#8892B0' },
  cancelada:  { bg: 'rgba(255,101,132,0.15)', color: '#FF6584' },
}

const NEUTRO = { bg: 'rgba(136,146,176,0.15)', color: '#8892B0' }

export function statusKey(status?: string | null): string {
  return (status ?? '').trim().toLowerCase()
}

export function statusLabel(status?: string | null): string {
  const key = statusKey(status)
  return STATUS_LABELS[key] ?? (status || '—')
}

export function statusStyle(status?: string | null) {
  return STATUS_STYLE[statusKey(status)] ?? NEUTRO
}

/** A doação já entrou no total arrecadado da campanha? */
export function doacaoContabilizada(status?: string | null): boolean {
  // status vazio/desconhecido conta, igual ao back-end (registros antigos)
  return !NAO_CONTABILIZADOS.includes(statusKey(status))
}
