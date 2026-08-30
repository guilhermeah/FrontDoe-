import api, { prefixUrl } from './api'
import { Campanha, CampanhaRequest, CampanhaFilter, ItensDoadosSummary, TipoCampanha } from '../types/campaign.types'

function mapTipo(raw: any): TipoCampanha {
  const t = String(raw ?? '').toLowerCase()
  if (t === 'material') return 'material'
  if (t === 'ambas') return 'ambas'
  return 'financeira'
}

function mapCampanha(raw: any): Campanha {
  return {
    id: raw.idCampanha ?? raw.id,
    titulo: raw.titulo ?? '',
    descricao: raw.descricao ?? '',
    tipoCampanha: mapTipo(raw.tipoCampanha),
    metaFinanceira: Number(raw.metaFinanceira ?? 0),
    valorArrecadado: Number(raw.valorArrecadado ?? 0),
    imagemUrl: prefixUrl(raw.imagemUrl),
    categoria: raw.categoria ?? '',
    localizacao: raw.localizacao,
    objetivo: raw.objetivo,
    dataInicio: raw.dataInicio,
    dataFim: raw.dataFim,
    status: String(raw.status ?? '').toUpperCase() || 'ATIVA',
    ongId: raw.idOng,
    ongNome: raw.nomeOng,
    quantidadeDoadores: raw.quantidadeDoadores,
    createdAt: raw.createdAt,
  }
}

function buildPayload(data: CampanhaRequest) {
  const payload: Record<string, any> = {
    idOng: data.idOng,
    tipoCampanha: data.tipoCampanha,
    titulo: data.titulo,
    descricao: data.descricao,
    status: (data.status || 'ativa').toLowerCase(),
  }
  if (data.tipoCampanha !== 'material') {
    payload.metaFinanceira = data.metaFinanceira
  }
  if (data.imagemUrl)  payload.imagemUrl  = data.imagemUrl
  if (data.categoria)  payload.categoria  = data.categoria
  if (data.localizacao) payload.localizacao = data.localizacao
  if (data.objetivo)   payload.objetivo   = data.objetivo
  if (data.dataInicio) payload.dataInicio = data.dataInicio
  if (data.dataFim)    payload.dataFim    = data.dataFim
  return payload
}

export const CampanhaService = {
  async listar(_filters?: CampanhaFilter): Promise<Campanha[]> {
    const response = await api.get<any[]>('/campanhas')
    return response.data.map(mapCampanha)
  },

  async buscarPorId(id: number): Promise<Campanha> {
    const response = await api.get<any>(`/campanhas/${id}`)
    return mapCampanha(response.data)
  },

  async criar(data: CampanhaRequest): Promise<Campanha> {
    const payload = buildPayload(data)
    console.log('[CampanhaService] criar payload:', payload)
    const response = await api.post<any>('/campanhas', payload)
    return mapCampanha(response.data)
  },

  async atualizar(id: number, data: CampanhaRequest): Promise<Campanha> {
    const response = await api.put<any>(`/campanhas/${id}`, buildPayload(data))
    return mapCampanha(response.data)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/campanhas/${id}`)
  },

  async uploadImagem(id: number, file: File): Promise<Campanha> {
    const formData = new FormData()
    formData.append('arquivo', file)
    const response = await api.post<any>(`/campanhas/${id}/imagem`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return mapCampanha(response.data)
  },

  async encerrar(id: number): Promise<Campanha> {
    const response = await api.patch<any>(`/campanhas/${id}/encerrar`)
    return mapCampanha(response.data)
  },

  async listarPorOng(ongId: number): Promise<Campanha[]> {
    const response = await api.get<any[]>(`/campanhas/ong/${ongId}`)
    return response.data.map(mapCampanha)
  },

  async listarItensDados(campanhaId: number): Promise<ItensDoadosSummary[]> {
    const response = await api.get<ItensDoadosSummary[]>(`/campanhas/${campanhaId}/itens-doados`)
    return response.data
  },
}
