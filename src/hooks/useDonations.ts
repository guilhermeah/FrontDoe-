import { useState, useEffect } from 'react'
import { Doacao } from '../types/donation.types'
import { DoacaoService } from '../services/DoacaoService'

export function useDonationsByDoador(doadorId: number | undefined) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!doadorId) { setIsLoading(false); return }
    DoacaoService.listarPorDoador(doadorId)
      .then(setDoacoes)
      .catch(() => setError('Erro ao carregar doações'))
      .finally(() => setIsLoading(false))
  }, [doadorId])

  return { doacoes, isLoading, error }
}

export function useDonationsByCampanha(campanhaId: number | undefined) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!campanhaId) { setIsLoading(false); return }
    DoacaoService.listarPorCampanha(campanhaId)
      .then(setDoacoes)
      .finally(() => setIsLoading(false))
  }, [campanhaId])

  return { doacoes, isLoading }
}

export function useDonationsByOng(ongId: number | undefined) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ongId) { setIsLoading(false); return }
    DoacaoService.listarPorOng(ongId)
      .then(setDoacoes)
      .catch(() => setError('Erro ao carregar doações'))
      .finally(() => setIsLoading(false))
  }, [ongId])

  return { doacoes, isLoading, error }
}
