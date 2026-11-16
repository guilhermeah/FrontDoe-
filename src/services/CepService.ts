import { somenteDigitosCep } from '../utils/endereco'

/** Resposta crua do ViaCEP. */
interface ViaCepResponse {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean | string
}

export interface EnderecoViaCep {
  cep: string
  endereco: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

/**
 * Consulta de CEP no ViaCEP (https://viacep.com.br).
 * Servico publico e gratuito, sem chave de API e com CORS liberado,
 * entao a chamada sai direto do navegador — nao passa pela nossa API.
 */
export const CepService = {
  async buscar(cep: string): Promise<EnderecoViaCep> {
    const digitos = somenteDigitosCep(cep)

    if (digitos.length !== 8) {
      throw new Error('CEP deve ter 8 digitos.')
    }

    const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)

    if (!resposta.ok) {
      throw new Error('Nao foi possivel consultar o CEP agora.')
    }

    const dados: ViaCepResponse = await resposta.json()

    // O ViaCEP devolve 200 com { "erro": true } quando o CEP nao existe.
    if (dados.erro) {
      throw new Error('CEP nao encontrado.')
    }

    return {
      cep: digitos,
      endereco: dados.logradouro ?? '',
      complemento: dados.complemento ?? '',
      bairro: dados.bairro ?? '',
      cidade: dados.localidade ?? '',
      estado: dados.uf ?? '',
    }
  },
}
