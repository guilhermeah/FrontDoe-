import { useState, useEffect } from 'react'
import { DashboardResumo } from '../types/user.types'
import { DashboardService } from '../services/DashboardService'

export function useDashboard() {
  const [resumo, setResumo] = useState<DashboardResumo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    DashboardService.resumo()
      .then(setResumo)
      .catch(() => setError('Erro ao carregar dados do dashboard'))
      .finally(() => setIsLoading(false))
  }, [])

  return { resumo, isLoading, error }
}
