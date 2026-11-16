import api from './api'
import { Usuario, OngStats } from '../types/user.types'

function mapOngToUsuario(o: any): Usuario {
  return {
    id: o.idOng,
    nome: o.nomeFantasia || o.razaoSocial || '',
    email: o.email ?? '',
    role: 'ONG',
    telefone: o.telefone,
    cnpj: o.cnpj,
    imagemUrl: o.imagemUrl,
    descricao: o.areaAtuacao,
    localizacao: o.localizacao || (o.cidade ? `${o.cidade}${o.estado ? ' - ' + o.estado : ''}` : undefined),
    site: o.site,
    createdAt: o.dataCadastro,
  }
}

export const OngService = {
  async listar(): Promise<Usuario[]> {
    const response = await api.get<any[]>('/ongs')
    return response.data.map(mapOngToUsuario)
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
      totalArrecadado: Number(data.valorArrecadado ?? 0),
      totalDoadores: data.totalDoacoes ?? 0,
      arrecadacaoPorMes: [],
    }
  },
}
