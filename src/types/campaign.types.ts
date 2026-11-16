export type CampaignStatus = string

export type CampaignCategory = string

export interface Campanha {
  id: number
  titulo: string
  descricao: string
  metaFinanceira: number
  valorArrecadado: number
  imagemUrl?: string
  categoria: string
  localizacao?: string
  objetivo?: string
  dataInicio?: string
  dataFim?: string
  status: string
  ongId?: number
  ongNome?: string
  quantidadeDoadores?: number
  createdAt?: string
}

export interface CampanhaRequest {
  idOng?: number
  titulo: string
  descricao: string
  metaFinanceira: number
  imagemUrl?: string
  categoria: string
  localizacao?: string
  objetivo?: string
  dataInicio?: string
  dataFim?: string
  status?: string
}

export interface CampanhaFilter {
  categoria?: string
  status?: string
  localizacao?: string
  search?: string
}
