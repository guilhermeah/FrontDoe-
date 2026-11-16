import { useForm, Controller } from 'react-hook-form'
import { CampanhaRequest, CampaignCategory } from '../../types/campaign.types'
import { Alert } from '../common/Alert'
import { LocalizacaoSelect } from '../common/LocalizacaoSelect'

interface Props {
  onSubmit: (data: CampanhaRequest) => Promise<void>
  defaultValues?: Partial<CampanhaRequest>
  isLoading?: boolean
  error?: string | null
  submitLabel?: string
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

export function CampaignForm({ onSubmit, defaultValues, isLoading, error, submitLabel = 'Salvar' }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CampanhaRequest>({ defaultValues: defaultValues as CampanhaRequest })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert type="danger" message={error} />}

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

        <div className="col-md-6">
          <label className="form-label fw-semibold">Meta Financeira (R$) *</label>
          <input
            {...register('metaFinanceira', {
              required: 'Meta é obrigatória',
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

        <div className="col-md-6">
          <label className="form-label fw-semibold">Categoria *</label>
          <select
            {...register('categoria', { required: 'Categoria é obrigatória' })}
            className="form-select form-control-custom"
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.categoria && <div className="text-danger small mt-1">{errors.categoria.message}</div>}
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">URL da Imagem</label>
          <input
            {...register('imagemUrl')}
            className="form-control form-control-custom"
            placeholder="https://..."
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

        <div className="col-md-6">
          <label className="form-label fw-semibold">Status</label>
          <select {...register('status')} className="form-select form-control-custom">
            <option value="ATIVA">Ativa</option>
            <option value="PAUSADA">Pausada</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Data de Início *</label>
          <input
            {...register('dataInicio', { required: 'Data de início é obrigatória' })}
            type="date"
            className="form-control form-control-custom"
          />
          {errors.dataInicio && <div className="text-danger small mt-1">{errors.dataInicio.message}</div>}
        </div>

        <div className="col-md-6">
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
