import { CheckCircle2, Circle } from "lucide-react";

interface MilestoneAlertsProps {
  currentPercentage: number;
  targetAmount: number;
  currentAmount: number;
}

export default function MilestoneAlerts({
  currentPercentage,
  targetAmount,
  currentAmount,
}: MilestoneAlertsProps) {
  const milestones = [
    { percentage: 25, label: "25% da Meta" },
    { percentage: 50, label: "50% da Meta" },
    { percentage: 75, label: "75% da Meta" },
    { percentage: 100, label: "Meta Completa! 🎉" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-heading text-gray-900">Milestones de Progresso</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {milestones.map((milestone) => {
          const isCompleted = currentPercentage >= milestone.percentage;
          const amount = (targetAmount * milestone.percentage) / 100;

          return (
            <div
              key={milestone.percentage}
              className={`p-4 rounded-lg border transition-all ${
                isCompleted
                  ? "bg-emerald-50 border-emerald-200 shadow-md"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start gap-2 mb-2">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold ${
                      isCompleted ? "text-emerald-900" : "text-gray-600"
                    }`}
                  >
                    {milestone.label}
                  </p>
                </div>
              </div>
              <p
                className={`text-sm font-semibold ${
                  isCompleted ? "text-emerald-600" : "text-gray-500"
                }`}
              >
                R$ {amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              {!isCompleted && (
                <p className="text-xs text-gray-500 mt-1">
                  Faltam R${" "}
                  {(amount - currentAmount).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
