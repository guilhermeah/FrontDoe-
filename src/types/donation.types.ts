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
  // Campos de doação de item
  descricaoGeral?: string
  modalidadeEntrega?: 'retirada' | 'entrega_na_ong'
  enderecoRetirada?: string
  horarioDisponivel?: string
  fotosUrls?: string[]
}

export interface DoacaoRequest {
  valor: number
  campanhaId: number
  mensagem?: string
  anonimo?: boolean
}

export interface DoacaoItemRequest {
  idOng: number
  idCampanha?: number
  descricaoGeral: string
  tipoItem: string
  modalidadeEntrega: 'retirada' | 'entrega_na_ong'
  enderecoRetirada?: string
  horarioDisponivel: string
  observacoes?: string
}

export interface PixResponse {
  idDoacao: number
  pixCopiaECola: string
  qrCodeBase64: string
  valor: number
  txId: string
  mensagem: string
}

export interface DoacaoStatus {
  idDoacao: number
  status: 'pendente' | 'confirmada' | 'expirada' | string
  segundosRestantes: number | null
}
