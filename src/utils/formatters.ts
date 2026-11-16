export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr))
}

export function formatPercent(value: number, total: number): number {
  if (!total) return 0
  return Math.min(Math.round((value / total) * 100), 100)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    SAUDE: 'Saúde',
    EDUCACAO: 'Educação',
    MEIO_AMBIENTE: 'Meio Ambiente',
    ANIMAL: 'Animal',
    SOCIAL: 'Social',
    CULTURA: 'Cultura',
    ESPORTE: 'Esporte',
    ALIMENTOS: 'Alimentos',
    OUTRO: 'Outro',
  }
  return labels[category] || category
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    SAUDE: 'bi-heart-pulse',
    EDUCACAO: 'bi-book',
    MEIO_AMBIENTE: 'bi-tree',
    ANIMAL: 'bi-paw-fill',
    SOCIAL: 'bi-people',
    CULTURA: 'bi-palette',
    ESPORTE: 'bi-trophy',
    ALIMENTOS: 'bi-basket-fill',
    OUTRO: 'bi-three-dots',
  }
  return icons[category] || 'bi-tag'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ATIVA: 'Ativa', ativa: 'Ativa',
    ENCERRADA: 'Encerrada', encerrada: 'Encerrada',
    PAUSADA: 'Pausada', pausada: 'Pausada',
    PENDENTE: 'Pendente', pendente: 'Pendente',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ATIVA: 'success', ativa: 'success',
    ENCERRADA: 'secondary', encerrada: 'secondary',
    PAUSADA: 'warning', pausada: 'warning',
    PENDENTE: 'info', pendente: 'info',
  }
  return colors[status] || 'secondary'
}
