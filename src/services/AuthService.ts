import api from './api'
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth.types'

function makeToken(id: number, role: string): string {
  return btoa(JSON.stringify({ id, role }))
}

function mapDoadorToUser(d: any): User {
  return {
    id: d.idDoador,
    nome: d.nome,
    email: d.email ?? '',
    role: 'DOADOR',
    telefone: d.telefone,
    imagemUrl: d.imagemUrl ?? d.fotoUrl,
  }
}

function mapOngToUser(o: any): User {
  return {
    id: o.idOng,
    nome: o.nomeFantasia || o.razaoSocial,
    email: o.email ?? '',
    role: 'ONG',
    telefone: o.telefone,
    imagemUrl: o.imagemUrl ?? o.logoUrl,
  }
}

export const AuthService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const [doadoresResp, ongsResp] = await Promise.all([
      api.get('/doadores'),
      api.get('/ongs'),
    ])

    const doador = doadoresResp.data.find((d: any) => d.email === data.email)
    if (doador) {
      const user = mapDoadorToUser(doador)
      return { token: makeToken(user.id, 'DOADOR'), user }
    }

    const ong = ongsResp.data.find((o: any) => o.email === data.email)
    if (ong) {
      const user = mapOngToUser(ong)
      return { token: makeToken(user.id, 'ONG'), user }
    }

    throw { response: { data: { message: 'Email não encontrado. Verifique seus dados.' } } }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (data.role === 'ONG') {
      const response = await api.post('/ongs', {
        razaoSocial: data.nome,
        cnpj: data.cnpj ?? '',
        email: data.email,
        senha: data.senha,
        telefone: data.telefone ?? '',
      })
      const user = mapOngToUser(response.data)
      return { token: makeToken(user.id, 'ONG'), user }
    }

    const response = await api.post('/doadores', {
      tipoDoador: 'pessoa_fisica',
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      telefone: data.telefone ?? '',
    })
    const user = mapDoadorToUser(response.data)
    return { token: makeToken(user.id, 'DOADOR'), user }
  },

  async me(): Promise<User> {
    const stored = localStorage.getItem('@doemais:user')
    if (stored) return JSON.parse(stored) as User
    throw new Error('Não autenticado')
  },
}
