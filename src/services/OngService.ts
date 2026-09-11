import api, { prefixUrl } from './api'
import { Usuario, OngStats } from '../types/user.types'

function mapOngToUsuario(o: any): Usuario {
  return {
    id: o.idOng,
    nome: o.nomeFantasia || o.razaoSocial || '',
    email: o.email ?? '',
    role: 'ONG',
    telefone: o.telefone,
    cnpj: o.cnpj,
    // A API devolve o campo como logoUrl; sem isso o card caia sempre no
    // avatar de inicial em vez de mostrar a logo da ONG.
    imagemUrl: prefixUrl(o.logoUrl ?? o.imagemUrl),
    descricao: o.areaAtuacao,
    localizacao: o.localizacao || (o.cidade ? `${o.cidade}${o.estado ? ' - ' + o.estado : ''}` : undefined),
    site: o.site,
    chavePix: o.chavePix,
    createdAt: o.dataCadastro,
    cep: o.cep,
    endereco: o.endereco,
    numero: o.numero,
    complemento: o.complemento,
    bairro: o.bairro,
    cidade: o.cidade,
    estado: o.estado,
  }
}

export interface OngPage {
  ongs: Usuario[]
  totalPages: number
  totalElements: number
}

const PAGE_SIZE = 9

export const OngService = {
  async listar(page = 0, search = ''): Promise<OngPage> {
    const params: Record<string, any> = { page, size: PAGE_SIZE }
    if (search) params.nome = search

    const response = await api.get<any>('/ongs', { params })

    // Spring Page response
    if (response.data?.content) {
      return {
        ongs: response.data.content.map(mapOngToUsuario),
        totalPages: response.data.totalPages ?? 1,
        totalElements: response.data.totalElements ?? 0,
      }
    }

    // Flat array fallback — paginate client-side
    const all: Usuario[] = (response.data as any[]).map(mapOngToUsuario)
    const filtered = search
      ? all.filter((o) => o.nome.toLowerCase().includes(search.toLowerCase()))
      : all
    const start = page * PAGE_SIZE
    return {
      ongs: filtered.slice(start, start + PAGE_SIZE),
      totalPages: Math.ceil(filtered.length / PAGE_SIZE) || 1,
      totalElements: filtered.length,
    }
  },

  async buscarPorId(id: number): Promise<Usuario> {
    const response = await api.get<any>(`/ongs/${id}`)
    return mapOngToUsuario(response.data)
  },

  async estatisticas(ongId: number): Promise<OngStats> {
    const response = await api.get<any>(`/ongs/${ongId}/dashboard`)
    const data = response.data
    return {
      totalCampanhas: data.totalCampanhas ?? 0,
      campanhasAtivas: data.campanhasAtivas ?? 0,
      totalArrecadado: Number(data.totalArrecadado ?? data.valorArrecadado ?? 0),
      totalDoadores: data.totalDoadores ?? data.totalDoacoes ?? 0,
      arrecadacaoPorMes: [],
    }
  },
}
