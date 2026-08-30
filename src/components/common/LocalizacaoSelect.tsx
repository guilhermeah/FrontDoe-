import { useState, useEffect } from 'react'

interface Estado {
  id: number
  sigla: string
  nome: string
}

interface Municipio {
  id: number
  nome: string
}

interface Props {
  value?: string
  onChange: (localizacao: string) => void
}

export function LocalizacaoSelect({ value, onChange }: Props) {
  const [estados, setEstados] = useState<Estado[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [estadoSelecionado, setEstadoSelecionado] = useState('')
  const [cidadeSelecionada, setCidadeSelecionada] = useState('')
  const [loadingEstados, setLoadingEstados] = useState(true)
  const [loadingCidades, setLoadingCidades] = useState(false)

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((r) => r.json())
      .then((data: Estado[]) => setEstados(data))
      .finally(() => setLoadingEstados(false))
  }, [])

  // Pré-preenche estado e cidade se vier um valor inicial
  useEffect(() => {
    if (!value || estados.length === 0) return
    const partes = value.split(', ')
    if (partes.length === 2) {
      const cidade = partes[0]
      const sigla = partes[1]
      const estado = estados.find((e) => e.sigla === sigla)
      if (estado) {
        setEstadoSelecionado(estado.sigla)
        fetchCidades(estado.sigla, cidade)
      }
    }
  }, [value, estados])

  function fetchCidades(sigla: string, cidadeInicial?: string) {
    setLoadingCidades(true)
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios?orderBy=nome`)
      .then((r) => r.json())
      .then((data: Municipio[]) => {
        setMunicipios(data)
        if (cidadeInicial) setCidadeSelecionada(cidadeInicial)
      })
      .finally(() => setLoadingCidades(false))
  }

  function handleEstadoChange(sigla: string) {
    setEstadoSelecionado(sigla)
    setCidadeSelecionada('')
    setMunicipios([])
    onChange('')
    if (sigla) fetchCidades(sigla)
  }

  function handleCidadeChange(cidade: string) {
    setCidadeSelecionada(cidade)
    if (cidade && estadoSelecionado) {
      onChange(`${cidade}, ${estadoSelecionado}`)
    } else {
      onChange('')
    }
  }

  return (
    <div className="localizacao-select row g-2">
      <div className="col-md-4">
        <label className="form-label fw-semibold">Estado</label>
        <select
          value={estadoSelecionado}
          onChange={(e) => handleEstadoChange(e.target.value)}
          className="form-select form-control-custom"
          disabled={loadingEstados}
        >
          <option value="">{loadingEstados ? 'Carregando...' : 'Selecione...'}</option>
          {estados.map((e) => (
            <option key={e.id} value={e.sigla}>
              {e.sigla} — {e.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-8">
        <label className="form-label fw-semibold">Cidade</label>
        <select
          value={cidadeSelecionada}
          onChange={(e) => handleCidadeChange(e.target.value)}
          className="form-select form-control-custom"
          disabled={!estadoSelecionado || loadingCidades}
        >
          <option value="">
            {!estadoSelecionado
              ? 'Selecione um estado primeiro'
              : loadingCidades
              ? 'Carregando...'
              : 'Selecione a cidade...'}
          </option>
          {municipios.map((m) => (
            <option key={m.id} value={m.nome}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
