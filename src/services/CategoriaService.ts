import api from './api'
import { Categoria, Item } from '../types/donation.types'

export const CategoriaService = {
  async listar(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>('/categorias')
    return response.data
  },

  async listarItens(categoriaId: number): Promise<Item[]> {
    const response = await api.get<Item[]>(`/categorias/${categoriaId}/itens`)
    return response.data
  },

  async listarTodosItens(): Promise<Item[]> {
    const response = await api.get<Item[]>('/itens')
    return response.data
  },
}
