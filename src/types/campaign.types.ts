export type CampaignStatus = string

export type CampaignCategory = string

export type TipoCampanha = 'financeira' | 'material' | 'ambas'

export interface Campanha {
  id: number
  titulo: string
  descricao: string
  tipoCampanha: TipoCampanha
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
  tipoCampanha: TipoCampanha
  titulo: string
  descricao: string
  metaFinanceira?: number
  imagemUrl?: string
  categoria?: string
  localizacao?: string
  objetivo?: string
  dataInicio?: string
  dataFim?: string
  status?: string
}

export interface ItensDoadosSummary {
  idItem: number
  nomeItem: string
  categoria: string
  unidadeMedida: string
  totalDoado: number
}

export interface CampanhaFilter {
  categoria?: string
  status?: string
  localizacao?: string
  search?: string
}
