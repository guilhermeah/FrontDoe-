import { useForm, Controller, useWatch } from 'react-hook-form'
import { CampanhaRequest, CampaignCategory, TipoCampanha } from '../../types/campaign.types'
import { Alert } from '../common/Alert'
import { ImageUpload } from '../common/ImageUpload'
import { LocalizacaoSelect } from '../common/LocalizacaoSelect'

interface Props {
  onSubmit: (data: CampanhaRequest) => Promise<void>
  defaultValues?: Partial<CampanhaRequest>
  isLoading?: boolean
  error?: string | null
  submitLabel?: string
  onImageFile?: (file: File | null) => void
  currentImageUrl?: string
}

const categories: { value: CampaignCategory; label: string }[] = [
  { value: 'SAUDE', label: 'Saúde' },
  { value: 'EDUCACAO', label: 'Educação' },
  { value: 'MEIO_AMBIENTE', label: 'Meio Ambiente' },
  { value: 'ANIMAL', label: 'Animal' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'CULTURA', label: 'Cultura' },
  { value: 'ESPORTE', label: 'Esporte' },
  { value: 'ALIMENTOS', label: 'Alimentos' },
  { value: 'OUTRO', label: 'Outro' },
]

const tipoOpts: { value: TipoCampanha; label: string; icon: string; color: string; desc: string }[] = [
  { value: 'financeira', label: 'Financeira', icon: 'bi-cash-stack', color: '#6C63FF', desc: 'Arrecadação em dinheiro' },
  { value: 'material', label: 'Itens', icon: 'bi-box-seam', color: '#43D9A2', desc: 'Roupas, alimentos, etc.' },
  { value: 'ambas', label: 'Ambas', icon: 'bi-layers', color: '#FFD166', desc: 'Dinheiro e itens físicos' },
]

export function CampaignForm({ onSubmit, defaultValues, isLoading, error, submitLabel = 'Salvar', onImageFile, currentImageUrl }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CampanhaRequest>({
    defaultValues: { tipoCampanha: 'financeira', ...defaultValues } as CampanhaRequest,
  })

  const tipoCampanha = useWatch({ control, name: 'tipoCampanha' })
  const showMeta = tipoCampanha !== 'material'

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert type="danger" message={error} />}

      {/* Tipo de campanha */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Tipo de Campanha *</label>
        <Controller
          name="tipoCampanha"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <div className="row g-2">
              {tipoOpts.map(opt => (
                <div key={opt.value} className="col-4">
                  <button
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className="btn w-100 py-3 text-center"
                    style={{
                      borderRadius: 14,
                      border: `2px solid ${field.value === opt.value ? opt.color : 'rgba(255,255,255,0.1)'}`,
                      background: field.value === opt.value ? `${opt.color}15` : 'transparent',
                      color: 'var(--text)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <i className={`bi ${opt.icon} d-block fs-4 mb-1`} style={{ color: opt.color }} />
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>{opt.label}</div>
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{opt.desc}</div>
                  </button>
                </div>
              ))}
            </div>
          )}
        />
      </div>

      <div className="row g-3">
        <div className="col-12">
          <label className="form-label fw-semibold">Título *</label>
          <input
            {...register('titulo', { required: 'Título é obrigatório' })}
            className="form-control form-control-custom"
            placeholder="Título da campanha"
          />
          {errors.titulo && <div className="text-danger small mt-1">{errors.titulo.message}</div>}
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Descrição *</label>
          <textarea
            {...register('descricao', { required: 'Descrição é obrigatória' })}
            className="form-control form-control-custom"
            rows={4}
            placeholder="Descreva sua campanha..."
          />
          {errors.descricao && <div className="text-danger small mt-1">{errors.descricao.message}</div>}
        </div>

        {showMeta && (
          <div className="col-md-6">
            <label className="form-label fw-semibold">Meta Financeira (R$) *</label>
            <input
              {...register('metaFinanceira', {
                required: showMeta ? 'Meta é obrigatória' : false,
                min: { value: 1, message: 'Valor mínimo é R$1' },
                valueAsNumber: true,
              })}
              type="number"
              step="0.01"
              className="form-control form-control-custom"
              placeholder="0,00"
            />
            {errors.metaFinanceira && <div className="text-danger small mt-1">{errors.metaFinanceira.message}</div>}
          </div>
        )}

        <div className={showMeta ? 'col-md-6' : 'col-12'}>
          <label className="form-label fw-semibold">Categoria</label>
          <select
            {...register('categoria')}
            className="form-select form-control-custom"
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold d-block mb-2">Imagem da Campanha</label>
          <ImageUpload
            currentUrl={currentImageUrl ?? defaultValues?.imagemUrl}
            onFileSelect={(file) => onImageFile?.(file)}
            shape="rect"
            label="JPG, PNG ou WebP — máx. 5MB"
          />
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">Objetivo</label>
          <textarea
            {...register('objetivo')}
            className="form-control form-control-custom"
            rows={2}
            placeholder="Qual é o objetivo da campanha?"
          />
        </div>

        <div className="col-12">
          <Controller
            name="localizacao"
            control={control}
            render={({ field }) => (
              <LocalizacaoSelect value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Status</label>
          <select {...register('status')} className="form-select form-control-custom">
            <option value="ATIVA">Ativa</option>
            <option value="PAUSADA">Pausada</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Data de Início *</label>
          <input
            {...register('dataInicio', { required: 'Data de início é obrigatória' })}
            type="date"
            className="form-control form-control-custom"
          />
          {errors.dataInicio && <div className="text-danger small mt-1">{errors.dataInicio.message}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Data de Fim *</label>
          <input
            {...register('dataFim', { required: 'Data de fim é obrigatória' })}
            type="date"
            className="form-control form-control-custom"
          />
          {errors.dataFim && <div className="text-danger small mt-1">{errors.dataFim.message}</div>}
        </div>

        <div className="col-12 pt-2">
          <button
            type="submit"
            className="btn btn-primary-custom px-5 py-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Salvando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2" />
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
