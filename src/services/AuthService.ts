import api from './api'
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth.types'

function makeToken(id: number, role: string): string {
  return btoa(JSON.stringify({ id, role }))
}

const PERFIL_TO_ROLE: Record<string, User['role']> = {
  admin: 'ADMIN',
  ong: 'ONG',
  doador: 'DOADOR',
  funcionario: 'ADMIN',
  voluntario: 'ADMIN',
}

function mapLoginResponse(data: any): User {
  const perfil = String(data.perfil).toLowerCase()
  const role = PERFIL_TO_ROLE[perfil] ?? 'DOADOR'

  let id: number
  if (perfil === 'ong') {
    id = data.idOng  // null when ONG not linked yet — resolved after login via /ongs lookup
  } else if (perfil === 'doador') {
    id = data.idDoador ?? data.idUsuario ?? data.id
  } else {
    id = data.idUsuario ?? data.id
  }

  return {
    id,
    nome: data.nome,
    email: data.email ?? '',
    role,
    ...(data.idOng != null ? { idOng: data.idOng } : {}),
  }
}

export const AuthService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email: data.email, senha: data.senha })
    const raw = response.data
    const user = mapLoginResponse(raw)

    // Backend returns idOng: null on login — resolve real ONG id by listing ONGs
    if (user.role === 'ONG' && !user.id) {
      try {
        const ongsResp = await api.get<any[]>('/ongs')
        const ong = ongsResp.data.find((o: any) => o.email === raw.email)
        if (ong) { user.id = ong.idOng; user.idOng = ong.idOng }
      } catch {
        // keep id as-is
      }
    }

    return { token: makeToken(user.id, user.role), user }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (data.role === 'ONG') {
      const response = await api.post('/usuarios', {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        perfil: 'ong',
      })
      const raw = response.data
      const user: User = {
        id: raw.idOng ?? raw.idUsuario,
        nome: raw.nome,
        email: raw.email ?? '',
        role: 'ONG',
      }
      return { token: makeToken(user.id, 'ONG'), user }
    }

    const response = await api.post('/doadores', {
      tipoDoador: 'pessoa_fisica',
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      cpfCnpj: data.cpfCnpj ?? '',
    })
    const d = response.data
    const user: User = {
      id: d.idDoador,
      nome: d.nome,
      email: d.email ?? '',
      role: 'DOADOR',
    }
    return { token: makeToken(user.id, 'DOADOR'), user }
  },

  async me(): Promise<User> {
    const stored = localStorage.getItem('@doemais:user')
    if (stored) return JSON.parse(stored) as User
    throw new Error('Não autenticado')
  },
}
