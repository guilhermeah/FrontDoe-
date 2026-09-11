export interface Doacao {
  id: number
  valor: number
  campanhaId: number
  campanhaTitulo?: string
  ongId?: number
  doadorId?: number
  doadorNome?: string
  tipoDoacao?: string
  statusDoacao?: string
  mensagem?: string
  anonimo?: boolean
  createdAt: string
  /** Só vem preenchido enquanto a doação financeira está aguardando pagamento */
  expiraEm?: string
  segundosRestantes?: number
}

export interface Categoria {
  idCategoria: number
  nome: string
  descricao?: string
}

export interface Item {
  idItem: number
  nome: string
  unidadeMedida: string
  perecivel: boolean
}

export interface ItemDoacaoRequest {
  idItem: number
  quantidade: number
  estadoItem: 'novo' | 'usado_bom' | 'usado_regular'
  observacoes?: string
  validade?: string
}

export interface DoacaoRequest {
  tipo: 'financeira' | 'material'
  campanhaId: number
  // financeira
  valor?: number
  mensagem?: string
  // material
  descricaoGeral?: string
  observacoes?: string
  itens?: ItemDoacaoRequest[]
}
