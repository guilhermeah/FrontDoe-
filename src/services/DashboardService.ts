import api from './api'
import { DashboardResumo } from '../types/user.types'

export const DashboardService = {
  async resumo(): Promise<DashboardResumo> {
    const response = await api.get<any>('/dashboard/resumo')
    const data = response.data
    return {
      totalOngs: data.totalOngs ?? 0,
      totalCampanhas: data.totalCampanhas ?? 0,
      totalDoadores: data.totalDoadores ?? 0,
      totalArrecadado: Number(data.valorArrecadado ?? 0),
      campanhasAtivas: data.campanhasAtivas ?? 0,
      totalDoacoes: data.totalDoacoes ?? 0,
      crescimentoMensal: undefined,
    }
  },
}
