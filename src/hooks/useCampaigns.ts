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
  const [refreshKey, setRefreshKey] = useState(0)
  const idCarregado = useRef<number | null>(null)

  useEffect(() => {
    if (!id) return
    // O loading de tela cheia so vale para a primeira carga desta campanha.
    // Num refetch (ex.: logo apos uma doacao) a pagina precisa continuar
    // montada - senao o CampaignDetailPage troca tudo por um spinner, o
    // DonationModal e desmontado e o QR Code do PIX aparece e some.
    if (idCarregado.current !== id) setIsLoading(true)
    CampanhaService.buscarPorId(id)
      .then((c) => {
        setCampanha(c)
        idCarregado.current = id
      })
      .catch(() => setError('Campanha não encontrada'))
      .finally(() => setIsLoading(false))
  }, [id, refreshKey])

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), [])

  return { campanha, isLoading, error, refetch }
}
