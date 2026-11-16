/**
 * Utilitarios de endereco das ONGs: formatacao para exibicao e
 * montagem do link de busca no Google Maps.
 */

export interface EnderecoOng {
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
}

/** Mantem apenas digitos e limita a 8 (formato do CEP). */
export function somenteDigitosCep(valor: string): string {
  return (valor || '').replace(/\D/g, '').slice(0, 8)
}

/** Formata "01001000" -> "01001-000". */
export function formatarCep(valor?: string): string {
  const digitos = somenteDigitosCep(valor || '')
  if (digitos.length <= 5) return digitos
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`
}

/** True quando o endereco tem informacao suficiente para ser exibido/localizado. */
export function temEndereco(e?: EnderecoOng | null): boolean {
  if (!e) return false
  return Boolean(e.endereco || e.cidade || somenteDigitosCep(e.cep || '').length === 8)
}

/**
 * Endereco em uma linha, pulando os campos vazios.
 * Ex.: "Rua das Flores, 120 - Centro, Sao Paulo - SP, 01001-000"
 */
export function formatarEndereco(e?: EnderecoOng | null): string {
  if (!e) return ''

  const logradouro = [e.endereco, e.numero].filter(Boolean).join(', ')
  const primeiraParte = [logradouro, e.complemento].filter(Boolean).join(' - ')

  const cidadeUf = [e.cidade, e.estado].filter(Boolean).join(' - ')
  const cep = formatarCep(e.cep)

  return [primeiraParte, e.bairro, cidadeUf, cep].filter(Boolean).join(', ')
}

/** Versao curta para o card da listagem: "Bairro, Cidade - UF". */
export function formatarEnderecoCurto(e?: EnderecoOng | null): string {
  if (!e) return ''
  const cidadeUf = [e.cidade, e.estado].filter(Boolean).join(' - ')
  return [e.bairro, cidadeUf].filter(Boolean).join(', ')
}

/**
 * Link de busca do Google Maps. Nao precisa de chave de API: usa a
 * Maps URLs API publica, que aceita o endereco como texto livre.
 * Se so houver o CEP, o proprio CEP e usado como termo de busca.
 */
export function googleMapsUrl(e?: EnderecoOng | null): string | null {
  if (!temEndereco(e)) return null

  // Quando existe logradouro, a busca vai por rua/numero/bairro/cidade — sem o
  // CEP. Um CEP levemente errado joga o pino para longe; o endereco escrito o
  // Google resolve bem. O CEP so entra quando e a unica informacao disponivel.
  const consulta = e?.endereco
    ? [
        [e.endereco, e.numero].filter(Boolean).join(', '),
        e.bairro,
        [e.cidade, e.estado].filter(Boolean).join(' - '),
      ]
        .filter(Boolean)
        .join(', ')
    : formatarEndereco(e) || formatarCep(e?.cep)

  if (!consulta) return null

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${consulta}, Brasil`)}`
}
