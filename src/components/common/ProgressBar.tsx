import { formatPercent } from '../../utils/formatters'

interface Props {
  value: number
  total: number
  showLabel?: boolean
  height?: string
}

export function ProgressBar({ value, total, showLabel = true, height = '8px' }: Props) {
  const percent = formatPercent(value, total)

  return (
    <div>
      <div
        className="progress progress-custom"
        style={{ height }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar"
          style={{ width: `${percent}%`, transition: 'width 0.8s ease' }}
        />
      </div>
      {showLabel && (
        <div className="d-flex justify-content-between mt-1">
          <small className="text-muted">{percent}% atingido</small>
        </div>
      )}
    </div>
  )
}
