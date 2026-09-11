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
  // Endereco da ONG (usado no perfil e no card publico com o botao do mapa)
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
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
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
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
