import api from './api'
import { Doacao, DoacaoItemRequest, DoacaoRequest, DoacaoStatus, PixResponse } from '../types/donation.types'

function parseFotos(json?: string): string[] | undefined {
  if (!json) return undefined
  try { return JSON.parse(json) } catch { return undefined }
}

function mapDoacao(raw: any): Doacao {
  return {
    id: raw.idDoacao ?? raw.id,
    valor: Number(raw.valorTotal ?? 0),
    campanhaId: raw.campanha?.idCampanha,
    campanhaTitulo: raw.campanha?.titulo,
    ongId: raw.ong?.idOng ?? raw.idOng,
    doadorId: raw.doador?.idDoador,
    doadorNome: raw.doador?.nome,
    tipoDoacao: raw.tipoDoacao,
    statusDoacao: raw.statusDoacao,
    mensagem: raw.observacoes,
    anonimo: false,
    createdAt: raw.dataDoacao ?? raw.createdAt ?? '',
    descricaoGeral: raw.descricaoGeral,
    modalidadeEntrega: raw.modalidadeEntrega,
    enderecoRetirada: raw.enderecoRetirada,
    horarioDisponivel: raw.horarioDisponivel,
    fotosUrls: parseFotos(raw.fotosUrls),
  }
}

function getUserFromStorage(): { id: number; role: string } | null {
  const stored = localStorage.getItem('@doemais:user')
  if (!stored) return null
  try { return JSON.parse(stored) } catch { return null }
}

export const DoacaoService = {
  async realizar(data: DoacaoRequest): Promise<Doacao> {
    const user = getUserFromStorage()

    const campanhaResp = await api.get<any>(`/campanhas/${data.campanhaId}`)
    const campanha = campanhaResp.data
    const idOng = campanha.idOng

    const payload = {
      idDoador: user?.id ?? 1,
      idOng,
      idCampanha: data.campanhaId,
      tipoDoacao: 'FINANCEIRA',
      valorTotal: data.valor,
      observacoes: data.mensagem ?? '',
    }

    const response = await api.post<any>('/doacoes', payload)
    return mapDoacao(response.data)
  },

  async obterPix(idDoacao: number): Promise<PixResponse> {
    const response = await api.get<any>(`/pix/doacao/${idDoacao}`)
    return {
      idDoacao: response.data.idDoacao,
      pixCopiaECola: response.data.pixCopiaECola,
      qrCodeBase64: response.data.qrCodeBase64,
      valor: Number(response.data.valor),
      txId: response.data.txId,
      mensagem: response.data.mensagem,
    }
  },

  async consultarStatus(idDoacao: number): Promise<DoacaoStatus> {
    const response = await api.get<any>(`/pix/doacao/${idDoacao}/status`)
    return {
      idDoacao: response.data.idDoacao,
      status: response.data.status,
      segundosRestantes: response.data.segundosRestantes,
    }
  },

  async confirmarPagamento(idDoacao: number): Promise<void> {
    await api.post(`/doacoes/${idDoacao}/confirmar-pagamento`)
  },

  async listar(): Promise<Doacao[]> {
    const response = await api.get<any[]>('/doacoes')
    return response.data.map(mapDoacao)
  },

  async listarPorDoador(doadorId: number): Promise<Doacao[]> {
    const all = await api.get<any[]>('/doacoes')
    return all.data
      .filter((d: any) => d.doador?.idDoador === doadorId)
      .map(mapDoacao)
  },

  async listarPorCampanha(campanhaId: number): Promise<Doacao[]> {
    const all = await api.get<any[]>('/doacoes')
    return all.data
      .filter((d: any) => d.campanha?.idCampanha === campanhaId)
      .map(mapDoacao)
  },

  async listarPorOng(ongId: number): Promise<Doacao[]> {
    const all = await api.get<any[]>('/doacoes')
    return all.data
      .filter((d: any) =>
        d.idOng === ongId ||
        d.ong?.idOng === ongId ||
        d.campanha?.idOng === ongId
      )
      .map(mapDoacao)
  },

  async doarItem(data: DoacaoItemRequest, fotos: File[]): Promise<Doacao> {
    const user = getUserFromStorage()
    const payload = {
      idDoador: user?.id ?? 1,
      idOng: data.idOng,
      idCampanha: data.idCampanha ?? null,
      tipoDoacao: 'objeto',
      descricaoGeral: data.descricaoGeral,
      observacoes: data.observacoes ?? '',
      modalidadeEntrega: data.modalidadeEntrega,
      enderecoRetirada: data.enderecoRetirada ?? '',
      horarioDisponivel: data.horarioDisponivel,
      statusDoacao: 'pendente',
    }

    const response = await api.post<any>('/doacoes', payload)
    const doacao = mapDoacao(response.data)

    if (fotos.length > 0) {
      const form = new FormData()
      fotos.forEach((f) => form.append('fotos', f))
      const withFotos = await api.post<any>(`/doacoes/${doacao.id}/fotos`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return mapDoacao(withFotos.data)
    }

    return doacao
  },
}
