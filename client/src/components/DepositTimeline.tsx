import { Calendar, TrendingUp } from "lucide-react";

interface Deposit {
  month: string;
  amount: number;
  date: Date;
  isCompleted?: boolean;
  type?: "projected" | "actual";
  description?: string;
}

interface DepositTimelineProps {
  deposits: Deposit[];
}

export default function DepositTimeline({ deposits }: DepositTimelineProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    });
  };

  const totalProjected = deposits
    .filter((d) => d.type !== "actual" && !d.isCompleted)
    .reduce((sum, d) => sum + d.amount, 0);
  const totalActual = deposits
    .filter((d) => d.type === "actual" || d.isCompleted)
    .reduce((sum, d) => sum + d.amount, 0);

  if (deposits.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-heading text-gray-900">Cronograma de Depósitos</h3>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhum depósito programado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-heading text-gray-900">Cronograma de Depósitos</h3>
        <div className="flex gap-4 text-sm">
          {totalActual > 0 && (
            <div className="text-right">
              <p className="text-gray-600">Realizado</p>
              <p className="font-semibold text-emerald-600">
                {formatCurrency(totalActual)}
              </p>
            </div>
          )}
          {totalProjected > 0 && (
            <div className="text-right">
              <p className="text-gray-600">Projetado</p>
              <p className="font-semibold text-blue-600">
                {formatCurrency(totalProjected)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {deposits.map((deposit, index) => {
          const isActual = deposit.type === "actual" || deposit.isCompleted;
          return (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index !== deposits.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-200" />
              )}

              {/* Timeline item */}
              <div className="flex gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      isActual
                        ? "bg-emerald-500 border-emerald-600"
                        : "bg-blue-400 border-blue-500"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {deposit.description || deposit.month}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(deposit.date)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          isActual
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {formatCurrency(deposit.amount)}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-gray-600">
                        {isActual ? "✓ Realizado" : "○ Previsto"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 mb-2">Total Programado</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(totalActual + totalProjected)}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {deposits.length} depósito{deposits.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
