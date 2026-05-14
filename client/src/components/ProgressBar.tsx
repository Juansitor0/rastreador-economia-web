interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({
  current,
  target,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex justify-between items-center">
          <h3 className="text-heading text-gray-900">{label}</h3>
          {showPercentage && (
            <span className="text-sm font-semibold text-emerald-600">
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1200 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>R$ {current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
        <span>R$ {target.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}
