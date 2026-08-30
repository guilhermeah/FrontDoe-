import { useState, useEffect } from 'react'
import { DoacaoService } from '../../services/DoacaoService'
import { CategoriaService } from '../../services/CategoriaService'
import { Categoria, Item, ItemDoacaoRequest } from '../../types/donation.types'
import { TipoCampanha } from '../../types/campaign.types'
import { formatCurrency } from '../../utils/formatters'
import { Alert } from '../common/Alert'

interface Props {
  campanhaId: number
  campanhaTitulo: string
  tipoCampanha: TipoCampanha
  onSuccess: () => void
  onClose: () => void
}

type DonationType = 'financeira' | 'material'
type EstadoItem = 'novo' | 'usado_bom' | 'usado_regular'

const QUICK_VALUES = [10, 25, 50, 100, 250, 500]

const ESTADO_LABELS: Record<EstadoItem, string> = {
  novo: 'Novo',
  usado_bom: 'Usado — bom estado',
  usado_regular: 'Usado — estado regular',
}

type ItemSelecionado = ItemDoacaoRequest & { nome: string; unidade: string; perecivel: boolean }

export function DonationModal({ campanhaId, campanhaTitulo, tipoCampanha, onSuccess, onClose }: Props) {
  const initialTipo: DonationType | null =
    tipoCampanha === 'financeira' ? 'financeira' :
    tipoCampanha === 'material'   ? 'material'   : null

  const [tipo, setTipo] = useState<DonationType | null>(initialTipo)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pixData, setPixData] = useState<{ qrCodeBase64: string; pixCopiaECola: string } | null>(null)
  const [pixCopiado, setPixCopiado] = useState(false)
  const [pixError, setPixError] = useState<string | null>(null)

  // — financeira —
  const [valorInput, setValorInput] = useState('')
  const [quickValue, setQuickValue] = useState<number | null>(null)
  const [mensagem, setMensagem] = useState('')

  // — material —
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaId, setCategoriaId] = useState<number | ''>('')
  const [itensCategoria, setItensCategoria] = useState<Item[]>([])
  const [loadingItens, setLoadingItens] = useState(false)
  const [itemId, setItemId] = useState<number | ''>('')
  const [quantidade, setQuantidade] = useState(1)
  const [estado, setEstado] = useState<EstadoItem>('novo')
  const [validade, setValidade] = useState('')
  const [obsItem, setObsItem] = useState('')
  const [itensSelecionados, setItensSelecionados] = useState<ItemSelecionado[]>([])
  const [descricaoGeral, setDescricaoGeral] = useState('')
  const [observacoes, setObservacoes] = useState('')

  useEffect(() => {
    if (tipo === 'material') {
      CategoriaService.listar().then(setCategorias).catch(() => {})
    }
  }, [tipo])

  useEffect(() => {
    if (!categoriaId) { setItensCategoria([]); setItemId(''); return }
    setLoadingItens(true)
    setItemId('')
    CategoriaService.listarItens(Number(categoriaId))
      .then(setItensCategoria)
      .catch(() => {})
      .finally(() => setLoadingItens(false))
  }, [categoriaId])

  const itemAtual = itensCategoria.find(i => i.idItem === Number(itemId))

  const handleQuickValue = (v: number) => {
    setQuickValue(v)
    setValorInput(String(v))
  }

  const handleAddItem = () => {
    if (!itemAtual || quantidade < 1) return
    const novo: ItemSelecionado = {
      idItem: itemAtual.idItem,
      nome: itemAtual.nome,
      unidade: itemAtual.unidadeMedida,
      perecivel: itemAtual.perecivel,
      quantidade,
      estadoItem: estado,
      validade: itemAtual.perecivel && validade ? validade : undefined,
      observacoes: obsItem.trim() || undefined,
    }
    setItensSelecionados(prev => {
      const idx = prev.findIndex(i => i.idItem === novo.idItem)
      if (idx >= 0) return prev.map((it, i) => i === idx ? novo : it)
      return [...prev, novo]
    })
    setItemId('')
    setQuantidade(1)
    setEstado('novo')
    setValidade('')
    setObsItem('')
  }

  const handleRemoveItem = (idItem: number) => {
    setItensSelecionados(prev => prev.filter(i => i.idItem !== idItem))
  }

  const handleSubmit = async () => {
    setError(null)
    setPixError(null)

    if (tipo === 'financeira') {
      const v = parseFloat(valorInput.replace(',', '.'))
      if (!v || v < 1) { setError('Informe um valor válido (mínimo R$1)'); return }
      setIsLoading(true)
      try {
        const doacao = await DoacaoService.realizar({ tipo: 'financeira', campanhaId, valor: v, mensagem })
        try {
          if (!doacao.id) throw new Error('A API não retornou o id da doação (idDoacao ausente na resposta do POST /doacoes)')
          const pix = await DoacaoService.buscarPix(doacao.id)
          if (!pix?.qrCodeBase64 || !pix?.pixCopiaECola) {
            throw new Error(`Resposta do PIX incompleta: ${JSON.stringify(pix)}`)
          }
          setPixData(pix)
        } catch (pixErr: any) {
          // PIX indisponível — a doação foi registrada, mas o QR code não pôde ser gerado
          console.error(
            '[PIX] Falha ao buscar o QR code da doação',
            doacao?.id,
            '| status:', pixErr?.response?.status,
            '| resposta:', pixErr?.response?.data,
            '| erro:', pixErr?.message,
            pixErr,
          )
          setPixError(
            pixErr?.response?.status === 404
              ? 'Não encontramos o PIX desta doação. Sua contribuição foi registrada — procure a ONG para concluir o pagamento.'
              : 'Não foi possível gerar o QR code do PIX agora. Sua contribuição foi registrada.',
          )
        }
        setSuccess(true)
        onSuccess()
      } catch (err: any) {
        const d = err?.response?.data
        setError(d?.message || d?.mensagem || 'Erro ao processar doação')
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (tipo === 'material') {
      if (itensSelecionados.length === 0) { setError('Adicione pelo menos um item'); return }
      if (!descricaoGeral.trim()) { setError('Informe uma descrição geral'); return }
      setIsLoading(true)
      try {
        await DoacaoService.realizar({
          tipo: 'material',
          campanhaId,
          descricaoGeral: descricaoGeral.trim(),
          observacoes: observacoes.trim(),
          itens: itensSelecionados.map(({ idItem, quantidade, estadoItem, observacoes, validade }) => ({
            idItem, quantidade, estadoItem, observacoes, validade,
          })),
        })
        setSuccess(true)
        setTimeout(() => { onSuccess(); onClose() }, 1500)
      } catch (err: any) {
        const d = err?.response?.data
        setError(d?.message || d?.mensagem || 'Erro ao processar doação')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: tipo === 'material' ? 580 : 480 }}>
        <div className="modal-content border-0" style={{ borderRadius: 20, overflow: 'hidden' }}>

          {/* Header */}
          <div className="modal-header border-0 pb-0" style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', padding: '1.5rem' }}>
            <div>
              <h5 className="modal-title text-white fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-heart-fill" />
                Fazer Doação
              </h5>
              <p className="text-white opacity-75 small mb-0 mt-1">{campanhaTitulo}</p>
            </div>
            <button className="btn btn-link text-white p-0 ms-auto" onClick={onClose}>
              <i className="bi bi-x-lg fs-5" />
            </button>
          </div>

          <div className="modal-body p-4">

            {/* Sucesso */}
            {success && (
              <div className="text-center py-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #43D9A2, #6C63FF)' }}>
                  <i className="bi bi-check-lg text-white fs-3" />
                </div>
                <h5 className="fw-bold">Doação registrada!</h5>
                <p className="text-muted mb-0">Obrigado pela sua contribuição.</p>

                {pixData && (
                  <div className="mt-4 text-start">
                    <div className="fw-semibold mb-3 text-center" style={{ color: '#6C63FF' }}>
                      <i className="bi bi-qr-code me-2" />Pague via PIX
                    </div>

                    <div className="text-center mb-3">
                      <img
                        src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                        alt="QR Code PIX"
                        style={{ width: 180, height: 180, borderRadius: 12, border: '2px solid rgba(108,99,255,0.3)' }}
                      />
                    </div>

                    <label className="form-label small fw-semibold">Código PIX (copia e cola)</label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        value={pixData.pixCopiaECola}
                        readOnly
                        style={{ fontSize: '0.75rem' }}
                      />
                    </div>

                    <button
                      className="btn w-100 fw-semibold"
                      style={{ borderRadius: 12, background: pixCopiado ? 'rgba(67,217,162,0.15)' : 'rgba(108,99,255,0.1)', border: `1px solid ${pixCopiado ? '#43D9A2' : 'rgba(108,99,255,0.4)'}`, color: pixCopiado ? '#43D9A2' : '#6C63FF' }}
                      onClick={() => {
                        navigator.clipboard.writeText(pixData.pixCopiaECola)
                        setPixCopiado(true)
                        setTimeout(() => setPixCopiado(false), 2500)
                      }}
                    >
                      <i className={`bi ${pixCopiado ? 'bi-check-lg' : 'bi-clipboard'} me-2`} />
                      {pixCopiado ? 'Copiado!' : 'Copiar código PIX'}
                    </button>

                    <button className="btn btn-link w-100 mt-2 small" style={{ color: 'var(--text-muted)' }} onClick={onClose}>
                      Fechar
                    </button>
                  </div>
                )}

                {!pixData && (
                  <>
                    {pixError && tipo === 'financeira' && (
                      <div
                        className="mt-3 p-3 rounded-3 text-start small"
                        style={{ background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.4)', color: '#FFD166' }}
                      >
                        <i className="bi bi-exclamation-triangle me-2" />
                        {pixError}
                      </div>
                    )}
                    <button className="btn btn-link mt-3 small" style={{ color: 'var(--text-muted)' }} onClick={onClose}>
                      Fechar
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Escolha do tipo */}
            {!success && !tipo && (
              <div>
                <p className="fw-semibold mb-3" style={{ color: 'var(--text)' }}>Qual tipo de doação você deseja fazer?</p>
                <div className="row g-3">
                  <div className="col-6">
                    <button
                      className="btn w-100 h-100 py-4 text-center"
                      onClick={() => setTipo('financeira')}
                      style={{ borderRadius: 14, border: '2px solid rgba(108,99,255,0.3)', background: 'rgba(108,99,255,0.07)', color: 'var(--text)', transition: 'all 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#6C63FF')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(108,99,255,0.3)')}
                    >
                      <i className="bi bi-cash-stack d-block fs-2 mb-2" style={{ color: '#6C63FF' }} />
                      <div className="fw-bold">Financeira</div>
                      <div className="small text-muted mt-1">Doação em dinheiro</div>
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      className="btn w-100 h-100 py-4 text-center"
                      onClick={() => setTipo('material')}
                      style={{ borderRadius: 14, border: '2px solid rgba(67,217,162,0.3)', background: 'rgba(67,217,162,0.07)', color: 'var(--text)', transition: 'all 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#43D9A2')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(67,217,162,0.3)')}
                    >
                      <i className="bi bi-box-seam d-block fs-2 mb-2" style={{ color: '#43D9A2' }} />
                      <div className="fw-bold">Material</div>
                      <div className="small text-muted mt-1">Roupas, alimentos, etc.</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Formulário financeiro */}
            {!success && tipo === 'financeira' && (
              <div>
                {tipoCampanha === 'ambas' && (
                  <button className="btn btn-link p-0 mb-4 small" style={{ color: 'var(--text-muted)' }} onClick={() => { setTipo(null); setError(null) }}>
                    <i className="bi bi-arrow-left me-1" />Voltar
                  </button>
                )}

                {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

                <div className="mb-4">
                  <label className="form-label fw-semibold mb-3">Escolha um valor</label>
                  <div className="row g-2 mb-3">
                    {QUICK_VALUES.map(v => (
                      <div key={v} className="col-4">
                        <button
                          type="button"
                          className="btn w-100 fw-semibold"
                          onClick={() => handleQuickValue(v)}
                          style={{
                            borderRadius: 12,
                            border: `2px solid ${quickValue === v ? '#6C63FF' : 'var(--border)'}`,
                            background: quickValue === v ? 'rgba(108,99,255,0.1)' : 'transparent',
                            color: quickValue === v ? '#6C63FF' : 'inherit',
                            transition: 'all 0.2s',
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          {formatCurrency(v)}
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="form-label fw-semibold">Ou insira outro valor</label>
                  <div className="input-group">
                    <span className="input-group-text border-0" style={{ background: 'rgba(108,99,255,0.1)', color: '#6C63FF', fontWeight: 700 }}>R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      className="form-control form-control-custom"
                      placeholder="0,00"
                      value={valorInput}
                      onChange={e => { setValorInput(e.target.value); setQuickValue(null) }}
                      style={{ borderLeft: 'none' }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Mensagem (opcional)</label>
                  <textarea
                    className="form-control form-control-custom"
                    rows={2}
                    placeholder="Deixe uma mensagem de apoio..."
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary-custom w-100 py-3" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Processando...</>
                    : <><i className="bi bi-heart-fill me-2" />Confirmar Doação</>
                  }
                </button>
              </div>
            )}

            {/* Formulário material */}
            {!success && tipo === 'material' && (
              <div>
                {tipoCampanha === 'ambas' && (
                  <button className="btn btn-link p-0 mb-3 small" style={{ color: 'var(--text-muted)' }} onClick={() => { setTipo(null); setError(null); setItensSelecionados([]) }}>
                    <i className="bi bi-arrow-left me-1" />Voltar
                  </button>
                )}

                {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

                {/* Seleção de item */}
                <div className="p-3 mb-3 rounded-3 modal-item-box">
                  <div className="fw-semibold mb-3" style={{ fontSize: '0.875rem' }}>Adicionar item</div>

                  <div className="row g-2">
                    <div className="col-12">
                      <label className="form-label small fw-semibold mb-1">Categoria</label>
                      <select
                        className="form-select form-control-custom"
                        value={categoriaId}
                        onChange={e => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
                      >
                        <option value="">Selecione a categoria...</option>
                        {categorias.map(c => (
                          <option key={c.idCategoria} value={c.idCategoria}>{c.nome}</option>
                        ))}
                      </select>
                    </div>

                    {categoriaId !== '' && (
                      <div className="col-12">
                        <label className="form-label small fw-semibold mb-1">Item</label>
                        <select
                          className="form-select form-control-custom"
                          value={itemId}
                          onChange={e => setItemId(e.target.value ? Number(e.target.value) : '')}
                          disabled={loadingItens}
                        >
                          <option value="">{loadingItens ? 'Carregando...' : 'Selecione o item...'}</option>
                          {itensCategoria.map(i => (
                            <option key={i.idItem} value={i.idItem}>{i.nome} ({i.unidadeMedida})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {itemId !== '' && (
                      <>
                        <div className="col-6">
                          <label className="form-label small fw-semibold mb-1">Quantidade</label>
                          <input
                            type="number"
                            min="1"
                            className="form-control form-control-custom"
                            value={quantidade}
                            onChange={e => setQuantidade(Math.max(1, Number(e.target.value)))}
                          />
                        </div>

                        <div className="col-6">
                          <label className="form-label small fw-semibold mb-1">Estado</label>
                          <select
                            className="form-select form-control-custom"
                            value={estado}
                            onChange={e => setEstado(e.target.value as EstadoItem)}
                          >
                            {Object.entries(ESTADO_LABELS).map(([v, l]) => (
                              <option key={v} value={v}>{l}</option>
                            ))}
                          </select>
                        </div>

                        {itemAtual?.perecivel && (
                          <div className="col-12">
                            <label className="form-label small fw-semibold mb-1">Validade</label>
                            <input
                              type="date"
                              className="form-control form-control-custom"
                              value={validade}
                              onChange={e => setValidade(e.target.value)}
                            />
                          </div>
                        )}

                        <div className="col-12">
                          <label className="form-label small fw-semibold mb-1">Observação do item (opcional)</label>
                          <input
                            type="text"
                            className="form-control form-control-custom"
                            placeholder="Ex: Tamanho M, marca X..."
                            value={obsItem}
                            onChange={e => setObsItem(e.target.value)}
                          />
                        </div>

                        <div className="col-12">
                          <button
                            type="button"
                            className="btn w-100"
                            onClick={handleAddItem}
                            style={{ borderRadius: 10, border: '1px solid rgba(67,217,162,0.4)', background: 'rgba(67,217,162,0.1)', color: '#43D9A2', fontWeight: 600 }}
                          >
                            <i className="bi bi-plus-lg me-2" />Adicionar item
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Lista de itens selecionados */}
                {itensSelecionados.length > 0 && (
                  <div className="mb-3">
                    <div className="fw-semibold mb-2" style={{ fontSize: '0.875rem' }}>
                      Itens adicionados <span className="badge ms-1" style={{ background: 'rgba(67,217,162,0.2)', color: '#43D9A2' }}>{itensSelecionados.length}</span>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {itensSelecionados.map(it => (
                        <div key={it.idItem} className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                          <div className="flex-grow-1" style={{ fontSize: '0.82rem' }}>
                            <span className="fw-semibold" style={{ color: 'var(--text)' }}>{it.nome}</span>
                            <span className="text-muted ms-2">{it.quantidade} {it.unidade}</span>
                            <span className="ms-2" style={{ color: 'var(--text-muted)' }}>· {ESTADO_LABELS[it.estadoItem]}</span>
                            {it.validade && <span className="ms-2" style={{ color: '#FFD166', fontSize: '0.75rem' }}>val: {it.validade}</span>}
                          </div>
                          <button
                            className="btn btn-link p-0"
                            style={{ color: '#FF6584' }}
                            onClick={() => handleRemoveItem(it.idItem)}
                          >
                            <i className="bi bi-x-lg" style={{ fontSize: '0.75rem' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Descrição e observações gerais */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Descrição geral *</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="Ex: Doação de roupas de inverno"
                    value={descricaoGeral}
                    onChange={e => setDescricaoGeral(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Observações (opcional)</label>
                  <textarea
                    className="form-control form-control-custom"
                    rows={2}
                    placeholder="Informações adicionais sobre a doação..."
                    value={observacoes}
                    onChange={e => setObservacoes(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary-custom w-100 py-3"
                  onClick={handleSubmit}
                  disabled={isLoading || itensSelecionados.length === 0}
                >
                  {isLoading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Enviando...</>
                    : <><i className="bi bi-box-seam me-2" />Confirmar Doação Material</>
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
