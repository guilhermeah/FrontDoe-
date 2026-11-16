import { useState, useEffect, useCallback, useRef } from 'react'
import { Campanha, CampanhaFilter } from '../types/campaign.types'
import { CampanhaService } from '../services/CampanhaService'

export function useCampaigns(filters?: CampanhaFilter) {
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const filtersKey = JSON.stringify(filters)
  const keyRef = useRef(filtersKey)
  keyRef.current = filtersKey

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await CampanhaService.listar(JSON.parse(keyRef.current) ?? undefined)
      setCampanhas(data)
    } catch {
      setError('Erro ao carregar campanhas')
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  useEffect(() => { fetch() }, [fetch])

  return { campanhas, isLoading, error, refetch: fetch }
}

export function useCampaign(id: number) {
  const [campanha, setCampanha] = useState<Campanha | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    CampanhaService.buscarPorId(id)
      .then(setCampanha)
      .catch(() => setError('Campanha não encontrada'))
      .finally(() => setIsLoading(false))
  }, [id])

  return { campanha, isLoading, error }
}
