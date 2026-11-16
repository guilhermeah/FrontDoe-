import api from './api'

export const ChatService = {
  async enviar(idDoador: number, mensagem: string): Promise<string> {
    const response = await api.post<{ resposta: string }>('/chat', { idDoador, mensagem })
    return response.data.resposta
  },
}
