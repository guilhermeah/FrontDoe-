import { UserRole } from './auth.types'

export interface Usuario {
  id: number
  nome: string
  email: string
  role: UserRole
  telefone?: string
  imagemUrl?: string
  cnpj?: string
  descricao?: string
  localizacao?: string
  site?: string
  razaoSocial?: string
  chavePix?: string
  createdAt?: string
}

export interface UsuarioUpdateRequest {
  nome?: string
  telefone?: string
  imagemUrl?: string
  descricao?: string
  localizacao?: string
  site?: string
  razaoSocial?: string
  chavePix?: string
}

export interface DashboardResumo {
  totalOngs: number
  totalCampanhas: number
  totalDoadores: number
  totalArrecadado: number
  campanhasAtivas: number
  totalDoacoes: number
  crescimentoMensal?: number
}

export interface ArrecadacaoMensal {
  mes: string
  valor: number
}

export interface OngStats {
  totalCampanhas: number
  campanhasAtivas: number
  totalArrecadado: number
  totalDoadores: number
  arrecadacaoPorMes: ArrecadacaoMensal[]
}
