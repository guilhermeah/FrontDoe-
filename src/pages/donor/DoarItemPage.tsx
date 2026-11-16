import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Alert } from '../../components/common/Alert'
import { DoacaoService } from '../../services/DoacaoService'
import { OngService } from '../../services/OngService'
import { Usuario } from '../../types/user.types'

const CATEGORIAS = [
  'Roupas e Calçados',
  'Alimentos',
  'Móveis e Utensílios',
  'Brinquedos',
  'Livros e Material Escolar',
  'Eletrônicos',
  'Medicamentos',
  'Outros',
]

interface FormData {
  idOng: string
  tipoItem: string
  descricaoGeral: string
  modalidadeEntrega: 'retirada' | 'entrega_na_ong'
  enderecoRetirada?: string
  horarioDisponivel: string
  observacoes?: string
}

export function DoarItemPage() {
  const navigate = useNavigate()
  const [ongs, setOngs] = useState<Usuario[]>([])
  const [fotos, setFotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { modalidadeEntrega: 'retirada' },
  })

  const modalidade = watch('modalidadeEntrega')

  useEffect(() => {
    OngService.listar().then(setOngs).catch(() => {})
  }, [])

  const handleFotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const novos = files.slice(0, 5 - fotos.length)
    setFotos((prev) => [...prev, ...novos])
    novos.forEach((f) => {
      const reader = new FileReader()
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target?.result as string])
      reader.readAsDataURL(f)
    })
    e.target.value = ''
  }

  const removerFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    try {
      await DoacaoService.doarItem(
        {
          idOng: Number(data.idOng),
          descricaoGeral: data.descricaoGeral,
          tipoItem: data.tipoItem,
          modalidadeEntrega: data.modalidadeEntrega,
          enderecoRetirada: data.modalidadeEntrega === 'retirada' ? data.enderecoRetirada : undefined,
          horarioDisponivel: data.horarioDisponivel,
          observacoes: data.observacoes,
        },
        fotos,
      )
      setSuccess(true)
      setTimeout(() => navigate('/doador/historico'), 2500)
    } catch (err: any) {
      setError(err?.response?.data?.mensagem ?? 'Erro ao registrar doação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <DashboardLayout title="Doação registrada!">
        <div className="text-center py-5">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #43D9A2, #6C63FF)', boxShadow: '0 8px 32px rgba(67,217,162,0.35)' }}
          >
            <i className="bi bi-check-lg text-white" style={{ fontSize: '2.2rem' }} />
          </div>
          <h4 className="fw-bold mb-2" style={{ color: 'var(--text)' }}>Doação registrada com sucesso!</h4>
          <p style={{ color: 'var(--text-muted)' }}>A ONG foi notificada e entrará em contato. Redirecionando…</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Doar um Item">
      <div className="mb-4">
        <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Doar um Item</h4>
        <p style={{ color: 'var(--text-muted)' }}>Preencha as informações do item e escolha como a ONG poderá recebê-lo.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

        <div className="row g-4">
          {/* Coluna esquerda */}
          <div className="col-lg-7">
            <div className="surface-card p-4 mb-4">
              <h6 className="fw-bold mb-4" style={{ color: 'var(--card-text)' }}>
                <i className="bi bi-box-seam me-2" style={{ color: '#6C63FF' }} />
                Informações do Item
              </h6>

              <div className="mb-3">
                <label className="form-label fw-semibold">ONG destinatária *</label>
                <select
                  {...register('idOng', { required: 'Selecione uma ONG' })}
                  className="form-select form-control-custom"
                >
                  <option value="">Selecione uma ONG...</option>
                  {ongs.map((o) => (
                    <option key={o.id} value={o.id}>{o.nome}</option>
                  ))}
                </select>
                {errors.idOng && <div className="text-danger small mt-1">{errors.idOng.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Categoria do item *</label>
                <select
                  {...register('tipoItem', { required: 'Selecione uma categoria' })}
                  className="form-select form-control-custom"
                >
                  <option value="">Selecione...</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.tipoItem && <div className="text-danger small mt-1">{errors.tipoItem.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Descrição detalhada *</label>
                <textarea
                  {...register('descricaoGeral', { required: 'Descreva o item', minLength: { value: 10, message: 'Mínimo 10 caracteres' } })}
                  className="form-control form-control-custom"
                  rows={4}
                  placeholder="Descreva o item: estado de conservação, quantidade, tamanho, cor, etc."
                />
                {errors.descricaoGeral && <div className="text-danger small mt-1">{errors.descricaoGeral.message}</div>}
              </div>

              <div className="mb-1">
                <label className="form-label fw-semibold">Observações adicionais</label>
                <textarea
                  {...register('observacoes')}
                  className="form-control form-control-custom"
                  rows={2}
                  placeholder="Alguma informação extra relevante..."
                />
              </div>
            </div>

            {/* Fotos */}
            <div className="surface-card p-4">
              <h6 className="fw-bold mb-1" style={{ color: 'var(--card-text)' }}>
                <i className="bi bi-images me-2" style={{ color: '#43D9A2' }} />
                Fotos do Item
              </h6>
              <p className="small mb-3" style={{ color: 'var(--text-muted)' }}>
                Adicione até 5 fotos para ajudar a ONG a identificar o item. (opcional, mas recomendado)
              </p>

              <div className="d-flex flex-wrap gap-3 mb-3">
                {previews.map((src, i) => (
                  <div key={i} className="position-relative" style={{ width: 100, height: 100 }}>
                    <img
                      src={src}
                      alt={`Foto ${i + 1}`}
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, border: '2px solid var(--border)' }}
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-0 end-0 p-0"
                      style={{ width: 24, height: 24, borderRadius: '50%', background: '#ef4444', transform: 'translate(30%, -30%)' }}
                      onClick={() => removerFoto(i)}
                    >
                      <i className="bi bi-x text-white" style={{ fontSize: '0.75rem' }} />
                    </button>
                  </div>
                ))}

                {fotos.length < 5 && (
                  <button
                    type="button"
                    className="d-flex align-items-center justify-content-center flex-column gap-1"
                    style={{
                      width: 100, height: 100, borderRadius: 10,
                      border: '2px dashed var(--border)', background: 'transparent',
                      cursor: 'pointer', color: 'var(--text-muted)',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="bi bi-plus-lg fs-4" />
                    <span style={{ fontSize: '0.7rem' }}>Adicionar</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="d-none"
                onChange={handleFotoSelect}
              />
            </div>
          </div>

          {/* Coluna direita */}
          <div className="col-lg-5">
            <div className="surface-card p-4">
              <h6 className="fw-bold mb-4" style={{ color: 'var(--card-text)' }}>
                <i className="bi bi-truck me-2" style={{ color: '#FF6584' }} />
                Logística de Entrega
              </h6>

              <div className="mb-4">
                <label className="form-label fw-semibold">Como prefere fazer a entrega? *</label>
                <div className="d-flex flex-column gap-2 mt-2">
                  {[
                    { value: 'retirada', label: 'A ONG vem buscar em mim', icon: 'bi-house-door', desc: 'Informe seu endereço abaixo' },
                    { value: 'entrega_na_ong', label: 'Vou levar até a ONG', icon: 'bi-building', desc: 'Você entrega no endereço da ONG' },
                  ].map((opt) => {
                    const isSelected = modalidade === opt.value
                    return (
                      <label
                        key={opt.value}
                        className="d-flex align-items-start gap-3 p-3 rounded-3"
                        style={{
                          border: `2px solid ${isSelected ? '#6C63FF' : 'var(--border)'}`,
                          background: isSelected ? 'rgba(108,99,255,0.07)' : 'transparent',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          {...register('modalidadeEntrega', { required: true })}
                          className="mt-1 flex-shrink-0"
                          style={{ accentColor: '#6C63FF' }}
                        />
                        <div>
                          <div className="d-flex align-items-center gap-2 fw-semibold" style={{ color: 'var(--card-text)', fontSize: '0.9rem' }}>
                            <i className={`bi ${opt.icon}`} style={{ color: isSelected ? '#6C63FF' : 'var(--text-muted)' }} />
                            {opt.label}
                          </div>
                          <div className="small mt-1" style={{ color: 'var(--text-muted)' }}>{opt.desc}</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {modalidade === 'retirada' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Endereço para retirada *</label>
                  <input
                    {...register('enderecoRetirada', {
                      required: modalidade === 'retirada' ? 'Informe o endereço' : false,
                    })}
                    className="form-control form-control-custom"
                    placeholder="Rua, número, bairro, cidade"
                  />
                  {errors.enderecoRetirada && <div className="text-danger small mt-1">{errors.enderecoRetirada.message}</div>}
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">Disponibilidade de horário *</label>
                <input
                  {...register('horarioDisponivel', { required: 'Informe sua disponibilidade' })}
                  className="form-control form-control-custom"
                  placeholder="Ex: Seg a Sex das 9h às 18h, finais de semana"
                />
                {errors.horarioDisponivel && <div className="text-danger small mt-1">{errors.horarioDisponivel.message}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Registrando doação...</>
                ) : (
                  <><i className="bi bi-send-check me-2" />Registrar Doação</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}
