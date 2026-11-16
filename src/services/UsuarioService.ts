import api from './api'
import { Usuario, UsuarioUpdateRequest } from '../types/user.types'

function mapDoadorToUsuario(d: any): Usuario {
  return {
    id: d.idDoador,
    nome: d.nome,
    email: d.email ?? '',
    role: 'DOADOR',
    telefone: d.telefone,
    imagemUrl: d.fotoUrl ?? d.imagemUrl,
    createdAt: d.dataCadastro,
  }
}

function mapOngToUsuario(o: any): Usuario {
  return {
    id: o.idOng,
    nome: o.nomeFantasia || o.razaoSocial || '',
    email: o.email ?? '',
    role: 'ONG',
    telefone: o.telefone,
    cnpj: o.cnpj,
    imagemUrl: o.logoUrl ?? o.imagemUrl,
    descricao: o.areaAtuacao,
    localizacao: o.localizacao || (o.cidade ? `${o.cidade}${o.estado ? ' - ' + o.estado : ''}` : undefined),
    site: o.site,
    createdAt: o.dataCadastro,
  }
}

export const UsuarioService = {
  async buscarPorId(id: number): Promise<Usuario> {
    const [doadoresResp, ongsResp] = await Promise.all([
      api.get<any[]>('/doadores'),
      api.get<any[]>('/ongs'),
    ])
    const doador = doadoresResp.data.find((d: any) => d.idDoador === id)
    if (doador) return mapDoadorToUsuario(doador)
    const ong = ongsResp.data.find((o: any) => o.idOng === id)
    if (ong) return mapOngToUsuario(ong)
    throw new Error('Usuário não encontrado')
  },

  async atualizar(id: number, data: UsuarioUpdateRequest, role?: string): Promise<Usuario> {
    if (role === 'ONG') {
      const payload = {
        nomeFantasia: data.nome,
        telefone: data.telefone,
        areaAtuacao: data.descricao,
        localizacao: data.localizacao,
        imagemUrl: data.imagemUrl,
        site: data.site,
      }
      const response = await api.put<any>(`/ongs/${id}`, payload)
      return mapOngToUsuario(response.data)
    }
    const payload = {
      nome: data.nome,
      telefone: data.telefone,
      imagemUrl: data.imagemUrl,
    }
    const response = await api.put<any>(`/doadores/${id}`, payload)
    return mapDoadorToUsuario(response.data)
  },

  async listar(): Promise<Usuario[]> {
    const [doadoresResp, ongsResp] = await Promise.all([
      api.get<any[]>('/doadores'),
      api.get<any[]>('/ongs'),
    ])
    const doadores = doadoresResp.data.map(mapDoadorToUsuario)
    const ongs = ongsResp.data.map((o: any): Usuario => ({
      id: o.idOng,
      nome: o.nomeFantasia || o.razaoSocial,
      email: o.email ?? '',
      role: 'ONG',
      telefone: o.telefone,
      cnpj: o.cnpj,
      createdAt: o.dataCadastro,
    }))
    return [...doadores, ...ongs]
  },
}
