import api from './api'
import { Doacao, DoacaoRequest } from '../types/donation.types'

function mapDoacao(raw: any): Doacao {
  return {
    id: raw.idDoacao ?? raw.id,
    valor: Number(raw.valorTotal ?? raw.valor ?? 0),
    campanhaId: raw.campanha?.idCampanha,
    campanhaTitulo: raw.campanha?.titulo,
    ongId: raw.ong?.idOng ?? raw.idOng,
    doadorId: raw.doador?.idDoador,
    doadorNome: raw.doador?.nome,
    tipoDoacao: raw.tipoDoacao,
    statusDoacao: raw.statusDoacao,
    mensagem: raw.observacoes,
    anonimo: false,
    createdAt: raw.dataDoacao ?? raw.createdAt ?? '',
  }
}

function getUserFromStorage(): { id: number; role: string } | null {
  const stored = localStorage.getItem('@doemais:user')
  if (!stored) return null
  try { return JSON.parse(stored) } catch { return null }
}

export const DoacaoService = {
  async realizar(data: DoacaoRequest): Promise<Doacao> {
    const user = getUserFromStorage()

    const campanhaResp = await api.get<any>(`/campanhas/${data.campanhaId}`)
    const idOng = campanhaResp.data.idOng

    let payload: Record<string, any>

    if (data.tipo === 'material') {
      payload = {
        idDoador: user?.id ?? null,
        idOng,
        idCampanha: data.campanhaId,
        tipoDoacao: 'material',
        descricaoGeral: data.descricaoGeral ?? '',
        observacoes: data.observacoes ?? '',
        itens: data.itens ?? [],
      }
    } else {
      payload = {
        idDoador: user?.id ?? null,
        idOng,
        idCampanha: data.campanhaId,
        tipoDoacao: 'financeira',
        valorTotal: data.valor,
        descricaoGeral: 'Doação em dinheiro',
        observacoes: data.mensagem ?? '',
      }
    }

    const response = await api.post<any>('/doacoes', payload)
    return mapDoacao(response.data)
  },

  async listar(): Promise<Doacao[]> {
    const response = await api.get<any[]>('/doacoes')
    return response.data.map(mapDoacao)
  },

  async listarPorDoador(doadorId: number): Promise<Doacao[]> {
    try {
      const response = await api.get<any[]>(`/doadores/${doadorId}/doacoes`)
      return response.data.map(mapDoacao)
    } catch {
      const all = await api.get<any[]>('/doacoes')
      return all.data
        .filter((d: any) => d.doador?.idDoador === doadorId)
        .map(mapDoacao)
    }
  },

  async listarPorCampanha(campanhaId: number): Promise<Doacao[]> {
    try {
      const response = await api.get<any[]>(`/campanhas/${campanhaId}/doacoes`)
      return response.data.map(mapDoacao)
    } catch {
      const all = await api.get<any[]>('/doacoes')
      return all.data
        .filter((d: any) => d.campanha?.idCampanha === campanhaId)
        .map(mapDoacao)
    }
  },

  async buscarPix(doacaoId: number): Promise<{ qrCodeBase64: string; pixCopiaECola: string }> {
    const resp = await api.get(`/pix/doacao/${doacaoId}`)
    return resp.data
  },

  async listarPorOng(ongId: number): Promise<Doacao[]> {
    try {
      const response = await api.get<any[]>(`/ongs/${ongId}/doacoes`)
      return response.data.map(mapDoacao)
    } catch {
      const all = await api.get<any[]>('/doacoes')
      return all.data
        .filter((d: any) =>
          d.idOng === ongId ||
          d.ong?.idOng === ongId ||
          d.campanha?.idOng === ongId
        )
        .map(mapDoacao)
    }
  },
}
