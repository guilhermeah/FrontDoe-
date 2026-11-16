import api from './api'
import { Campanha, CampanhaRequest, CampanhaFilter } from '../types/campaign.types'

function mapCampanha(raw: any): Campanha {
  return {
    id: raw.idCampanha ?? raw.id,
    titulo: raw.titulo ?? '',
    descricao: raw.descricao ?? '',
    metaFinanceira: Number(raw.metaFinanceira ?? 0),
    valorArrecadado: Number(raw.valorArrecadado ?? 0),
    imagemUrl: raw.imagemUrl,
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
  return {
    idOng: data.idOng,
    titulo: data.titulo,
    descricao: data.descricao,
    metaFinanceira: data.metaFinanceira,
    imagemUrl: data.imagemUrl,
    categoria: data.categoria,
    localizacao: data.localizacao,
    objetivo: data.objetivo,
    dataInicio: data.dataInicio,
    dataFim: data.dataFim,
    status: (data.status || 'ativa').toLowerCase(),
  }
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
    const response = await api.post<any>('/campanhas', buildPayload(data))
    return mapCampanha(response.data)
  },

  async atualizar(id: number, data: CampanhaRequest): Promise<Campanha> {
    const response = await api.put<any>(`/campanhas/${id}`, buildPayload(data))
    return mapCampanha(response.data)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/campanhas/${id}`)
  },

  async encerrar(id: number): Promise<Campanha> {
    const response = await api.patch<any>(`/campanhas/${id}/encerrar`)
    return mapCampanha(response.data)
  },

  async listarPorOng(ongId: number): Promise<Campanha[]> {
    const response = await api.get<any[]>(`/campanhas/ong/${ongId}`)
    return response.data.map(mapCampanha)
  },
}
