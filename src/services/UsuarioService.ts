import api, { prefixUrl } from './api'
import { Usuario, UsuarioUpdateRequest } from '../types/user.types'

function mapDoadorToUsuario(d: any): Usuario {
  return {
    id: d.idDoador,
    nome: d.nome,
    email: d.email ?? '',
    role: 'DOADOR',
    telefone: d.telefone,
    imagemUrl: prefixUrl(d.fotoUrl ?? d.imagemUrl),
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
    imagemUrl: prefixUrl(o.logoUrl ?? o.imagemUrl),
    descricao: o.areaAtuacao,
    localizacao: o.localizacao || (o.cidade ? `${o.cidade}${o.estado ? ' - ' + o.estado : ''}` : undefined),
    site: o.site,
    razaoSocial: o.razaoSocial,
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

export const UsuarioService = {
  async buscarPorId(id: number, role?: string): Promise<Usuario> {
    if (role === 'ONG') {
      const response = await api.get<any>(`/ongs/${id}`)
      return mapOngToUsuario(response.data)
    }
    if (role === 'DOADOR') {
      const response = await api.get<any>(`/doadores/${id}`)
      return mapDoadorToUsuario(response.data)
    }
    try {
      const response = await api.get<any>(`/doadores/${id}`)
      return mapDoadorToUsuario(response.data)
    } catch {
      const response = await api.get<any>(`/ongs/${id}`)
      return mapOngToUsuario(response.data)
    }
  },

  async atualizar(id: number, data: UsuarioUpdateRequest, role?: string): Promise<Usuario> {
    if (role === 'ONG') {
      const payload = {
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nome,
        telefone: data.telefone,
        areaAtuacao: data.descricao,
        localizacao: data.localizacao,
        site: data.site,
        chavePix: data.chavePix,
        cep: data.cep,
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
      }
      const response = await api.put<any>(`/ongs/${id}`, payload)
      return mapOngToUsuario(response.data)
    }
    const payload = {
      nome: data.nome,
      telefone: data.telefone,
    }
    const response = await api.put<any>(`/doadores/${id}`, payload)
    return mapDoadorToUsuario(response.data)
  },

  async uploadFotoOng(id: number, file: File): Promise<Usuario> {
    const formData = new FormData()
    formData.append('arquivo', file)
    const response = await api.post<any>(`/ongs/${id}/foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return mapOngToUsuario(response.data)
  },

  async uploadFotoDoador(id: number, file: File): Promise<Usuario> {
    const formData = new FormData()
    formData.append('arquivo', file)
    const response = await api.post<any>(`/doadores/${id}/foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
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
