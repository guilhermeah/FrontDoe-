export type UserRole = 'ADMIN' | 'ONG' | 'DOADOR'

export interface User {
  id: number
  nome: string
  email: string
  role: UserRole
  imagemUrl?: string
  telefone?: string
  createdAt?: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface RegisterRequest {
  nome: string
  email: string
  senha: string
  role: UserRole
  telefone?: string
  cnpj?: string
  descricao?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}
