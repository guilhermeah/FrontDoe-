import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { DoacaoRequest, PixResponse } from '../../types/donation.types'
import { DoacaoService } from '../../services/DoacaoService'
import { formatCurrency } from '../../utils/formatters'
import { Alert } from '../common/Alert'

type Step = 'form' | 'pix' | 'success' | 'expired'

const quickValueStyle = (active: boolean): React.CSSProperties => ({
  borderRadius: 12,
  border: `2px solid ${active ? '#6C63FF' : '#e5e7eb'}`,
  background: active ? 'rgba(108,99,255,0.1)' : 'transparent',
  color: active ? '#6C63FF' : 'inherit',
  transition: 'all 0.2s',
  padding: '0.5rem',
  fontSize: '0.875rem',
})

interface Props {
  campanhaId: number
  campanhaTitulo: string
  onSuccess: () => void
  onClose: () => void
}

const QUICK_VALUES = [10, 25, 50, 100, 250, 500]
const POLL_INTERVAL_MS = 3000
const PIX_TOTAL_SECONDS = 900 // 15 min

export function DonationModal({ campanhaId, campanhaTitulo, onSuccess, onClose }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quickValue, setQuickValue] = useState<number | null>(null)
  const [pix, setPix] = useState<PixResponse | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(PIX_TOTAL_SECONDS)
  const [copied, setCopied] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DoacaoRequest>({
    defaultValues: { campanhaId, anonimo: false },
  })

  const stopIntervals = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }, [])

  useEffect(() => {
    return () => stopIntervals()
  }, [stopIntervals])

  const startPolling = useCallback((idDoacao: number, initialSeconds: number) => {
    setSecondsLeft(initialSeconds)

    countdownRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          stopIntervals()
          setStep('expired')
          return 0
        }
        return s - 1
      })
    }, 1000)

    pollRef.current = setInterval(async () => {
      try {
        const { status } = await DoacaoService.consultarStatus(idDoacao)
        if (status === 'confirmada') {
          stopIntervals()
          setStep('success')
        } else if (status === 'expirada') {
          stopIntervals()
          setStep('expired')
        }
      } catch {
        // ignora erros transientes de rede
      }
    }, POLL_INTERVAL_MS)
  }, [stopIntervals])

  const handleQuickValue = (value: number) => {
    setQuickValue(value)
    setValue('valor', value)
  }

  const onSubmit = async (data: DoacaoRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const doacao = await DoacaoService.realizar(data)
      const [pixData, statusData] = await Promise.all([
        DoacaoService.obterPix(doacao.id),
        DoacaoService.consultarStatus(doacao.id),
      ])
      setPix(pixData)
      const initialSeconds = statusData.segundosRestantes ?? PIX_TOTAL_SECONDS
      setStep('pix')
      startPolling(doacao.id, initialSeconds)
    } catch (err: any) {
      setError(
        err?.response?.data?.mensagem ||
        err?.response?.data?.message ||
        'Erro ao processar doação. Tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!pix?.pixCopiaECola) return
    await navigator.clipboard.writeText(pix.pixCopiaECola)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRetry = () => {
    stopIntervals()
    setStep('form')
    setPix(null)
    setError(null)
    setQuickValue(null)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progressPercent = Math.max(0, (secondsLeft / PIX_TOTAL_SECONDS) * 100)
  const isUrgent = secondsLeft < 60

  const headerGradient =
    step === 'success' ? 'linear-gradient(135deg, #43D9A2, #6C63FF)'
    : step === 'expired' ? 'linear-gradient(135deg, #f97316, #ef4444)'
    : 'linear-gradient(135deg, #6C63FF, #FF6584)'

  const headerIcon =
    step === 'success' ? 'bi bi-check-circle-fill'
    : step === 'expired' ? 'bi bi-clock-history'
    : step === 'pix' ? 'bi bi-qr-code-scan'
    : 'bi bi-heart-fill'

  const headerTitle =
    step === 'success' ? 'Doação confirmada!'
    : step === 'expired' ? 'Tempo esgotado'
    : step === 'pix' ? 'Pague com PIX'
    : 'Fazer Doação'

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: step === 'pix' ? 420 : 480 }}>
        <div className="modal-content border-0" style={{ borderRadius: 20, overflow: 'hidden' }}>

          {/* Header */}
          <div
            className="modal-header border-0 pb-0"
            style={{ background: headerGradient, padding: '1.5rem' }}
          >
            <div>
              <h5 className="modal-title text-white fw-bold d-flex align-items-center gap-2">
                <i className={headerIcon} />
                {headerTitle}
              </h5>
              {(step === 'form' || step === 'pix') && (
                <p className="text-white opacity-75 small mb-0 mt-1">
                  {step === 'pix' && pix ? `${formatCurrency(pix.valor)} · ` : ''}{campanhaTitulo}
                </p>
              )}
            </div>
            {(step === 'form' || step === 'expired') && (
              <button className="btn btn-link text-white p-0 ms-auto" onClick={onClose}>
                <i className="bi bi-x-lg fs-5" />
              </button>
            )}
          </div>

          <div className="modal-body p-4">

            {/* ── STEP: FORM ─────────────────────────────────── */}
            {step === 'form' && (
              <form onSubmit={handleSubmit(onSubmit)}>
                {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

                <div className="mb-4">
                  <label className="form-label fw-semibold mb-3">Escolha um valor</label>
                  <div className="row g-2 mb-3">
                    {QUICK_VALUES.map((v) => (
                      <div key={v} className="col-4">
                        <button
                          type="button"
                          className="btn w-100 fw-semibold"
                          onClick={() => handleQuickValue(v)}
                          style={quickValueStyle(quickValue === v)}
                        >
                          {formatCurrency(v)}
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="form-label fw-semibold">Ou insira outro valor</label>
                  <div className="input-group">
                    <span
                      className="input-group-text border-0"
                      style={{ background: 'rgba(108,99,255,0.1)', color: '#6C63FF', fontWeight: 700 }}
                    >
                      R$
                    </span>
                    <input
                      {...register('valor', {
                        required: 'Informe o valor',
                        min: { value: 1, message: 'Valor mínimo R$1' },
                        valueAsNumber: true,
                      })}
                      type="number"
                      step="0.01"
                      className="form-control form-control-custom"
                      placeholder="0,00"
                      style={{ borderLeft: 'none' }}
                      onChange={() => setQuickValue(null)}
                    />
                  </div>
                  {errors.valor && (
                    <div className="text-danger small mt-1">{errors.valor.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Mensagem (opcional)</label>
                  <textarea
                    {...register('mensagem')}
                    className="form-control form-control-custom"
                    rows={2}
                    placeholder="Deixe uma mensagem de apoio..."
                  />
                </div>

                <div className="form-check mb-4">
                  <input
                    {...register('anonimo')}
                    type="checkbox"
                    className="form-check-input"
                    id="anonimo"
                  />
                  <label className="form-check-label text-muted small" htmlFor="anonimo">
                    Fazer doação anonimamente
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Gerando PIX...</>
                  ) : (
                    <><i className="bi bi-qr-code me-2" />Gerar PIX</>
                  )}
                </button>
              </form>
            )}

            {/* ── STEP: PIX ──────────────────────────────────── */}
            {step === 'pix' && pix && (
              <div className="text-center animate-fadeInUp">

                {/* QR Code */}
                <div className="mb-3 d-inline-block">
                  <div style={{
                    padding: 12,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 24px rgba(108,99,255,0.18)',
                    display: 'inline-block',
                  }}>
                    <img
                      src={`data:image/png;base64,${pix.qrCodeBase64}`}
                      alt="QR Code PIX"
                      style={{ width: 200, height: 200, display: 'block' }}
                    />
                  </div>
                </div>

                {/* Countdown */}
                <div className="mb-3 px-2">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <i className="bi bi-clock small text-muted" />
                    <span className="text-muted small">PIX expira em</span>
                    <span
                      className="fw-bold"
                      style={{
                        color: isUrgent ? '#ef4444' : '#f59e0b',
                        fontSize: '1rem',
                        transition: 'color 0.3s',
                      }}
                    >
                      {formatTime(secondsLeft)}
                    </span>
                  </div>
                  <div style={{
                    height: 5,
                    borderRadius: 3,
                    background: 'rgba(108,99,255,0.12)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      background: isUrgent
                        ? 'linear-gradient(90deg, #ef4444, #f97316)'
                        : 'linear-gradient(90deg, #6C63FF, #43D9A2)',
                      transition: 'width 1s linear, background 0.5s ease',
                      borderRadius: 3,
                    }} />
                  </div>
                </div>

                {/* Status pulsante */}
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                  <span style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#43D9A2',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    flexShrink: 0,
                  }} />
                  <span className="text-muted" style={{ fontSize: '0.83rem' }}>
                    Aguardando confirmação do pagamento...
                  </span>
                </div>

                {/* Copia e cola */}
                <div className="mb-3">
                  <p className="text-muted small mb-2">Ou use o código Pix Copia e Cola:</p>
                  <div
                    className="p-2 rounded d-flex align-items-center gap-2"
                    style={{
                      background: 'rgba(108,99,255,0.06)',
                      border: '1px solid rgba(108,99,255,0.15)',
                    }}
                  >
                    <code
                      className="text-muted flex-grow-1 text-start"
                      style={{ fontSize: '0.62rem', wordBreak: 'break-all', lineHeight: 1.5 }}
                    >
                      {pix.pixCopiaECola.slice(0, 72)}…
                    </code>
                    <button
                      className="btn btn-sm flex-shrink-0"
                      onClick={handleCopy}
                      style={{
                        borderRadius: 8,
                        background: copied ? 'rgba(67,217,162,0.15)' : 'rgba(108,99,255,0.1)',
                        border: `1px solid ${copied ? '#43D9A2' : 'rgba(108,99,255,0.2)'}`,
                        color: copied ? '#43D9A2' : '#6C63FF',
                        fontSize: '0.75rem',
                        padding: '0.3rem 0.8rem',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {copied
                        ? <><i className="bi bi-check-lg me-1" />Copiado!</>
                        : <><i className="bi bi-copy me-1" />Copiar</>
                      }
                    </button>
                  </div>
                </div>

                <p className="text-muted" style={{ fontSize: '0.78rem' }}>
                  Escaneie o QR Code com o app do seu banco para confirmar a doação
                </p>

              </div>
            )}

            {/* ── STEP: SUCCESS ──────────────────────────────── */}
            {step === 'success' && (
              <div className="text-center py-3 animate-fadeInUp">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: 72,
                    height: 72,
                    background: 'linear-gradient(135deg, #43D9A2, #6C63FF)',
                    boxShadow: '0 8px 32px rgba(67,217,162,0.35)',
                  }}
                >
                  <i className="bi bi-check-lg text-white" style={{ fontSize: '2rem' }} />
                </div>
                <h5 className="fw-bold mb-2">Pagamento confirmado!</h5>
                <p className="text-muted mb-4">
                  Obrigado pela sua contribuição. Sua doação foi recebida com sucesso.
                </p>
                <button
                  className="btn btn-primary-custom w-100 py-3"
                  onClick={() => { onSuccess(); onClose() }}
                >
                  <i className="bi bi-heart-fill me-2" />
                  Fechar
                </button>
              </div>
            )}

            {/* ── STEP: EXPIRED ──────────────────────────────── */}
            {step === 'expired' && (
              <div className="text-center py-3 animate-fadeInUp">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: 72,
                    height: 72,
                    background: 'linear-gradient(135deg, #f97316, #ef4444)',
                    boxShadow: '0 8px 32px rgba(239,68,68,0.3)',
                  }}
                >
                  <i className="bi bi-clock-history text-white" style={{ fontSize: '2rem' }} />
                </div>
                <h5 className="fw-bold mb-2">PIX expirado</h5>
                <p className="text-muted mb-4">
                  O prazo para pagamento expirou. Faça uma nova doação para continuar.
                </p>
                <div className="d-flex gap-2">
                  <button
                    className="btn w-100 py-3"
                    style={{ borderRadius: 12, border: '1px solid var(--border)' }}
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-primary-custom w-100 py-3" onClick={handleRetry}>
                    <i className="bi bi-arrow-clockwise me-2" />
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
