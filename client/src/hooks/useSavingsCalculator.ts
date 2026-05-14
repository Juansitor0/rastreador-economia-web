import { useMemo } from "react";

interface SavingsConfig {
  initialBalance: number;
  targetAmount: number;
  currentDate: Date;
  monthlyDepositMay: number;
  monthlyDepositSep: number;
}

interface MonthlyDeposit {
  month: string;
  amount: number;
  date: Date;
  isCompleted: boolean;
}

interface SavingsProjection {
  deposits: MonthlyDeposit[];
  totalSaved: number;
  remainingAmount: number;
  percentageComplete: number;
  estimatedDate: Date | null;
  monthsRemaining: number;
}

export function useSavingsCalculator(config: SavingsConfig): SavingsProjection {
  return useMemo(() => {
    const {
      initialBalance,
      targetAmount,
      currentDate,
      monthlyDepositMay,
      monthlyDepositSep,
    } = config;
    const deposits: MonthlyDeposit[] = [];
    let totalSaved = initialBalance;
    let currentMonth = new Date(currentDate);
    currentMonth.setDate(1);

    // Gerar depósitos para os próximos 24 meses
    for (let i = 0; i < 24; i++) {
      const monthName = currentMonth.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });

      // Determinar valor do depósito baseado no período
      let depositAmount = 0;
      const monthIndex = i;

      if (monthIndex < 4) {
        // Maio a Agosto: valor customizável
        depositAmount = monthlyDepositMay;
      } else {
        // Setembro em diante: valor customizável
        depositAmount = monthlyDepositSep;
      }

      const isCompleted = currentMonth <= currentDate;
      if (isCompleted) {
        totalSaved += depositAmount;
      }

      deposits.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        amount: depositAmount,
        date: new Date(currentMonth),
        isCompleted,
      });

      // Próximo mês
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    // Calcular quando atingirá a meta
    let estimatedDate: Date | null = null;
    let monthsRemaining = 0;

    if (totalSaved >= targetAmount) {
      estimatedDate = currentDate;
    } else {
      const remaining = targetAmount - totalSaved;
      const monthlyDeposit = monthlyDepositSep; // Usar o depósito de setembro em diante
      monthsRemaining = Math.ceil(remaining / monthlyDeposit);

      estimatedDate = new Date(currentDate);
      estimatedDate.setMonth(estimatedDate.getMonth() + monthsRemaining);
    }

    const remainingAmount = Math.max(0, targetAmount - totalSaved);
    const percentageComplete = Math.min((totalSaved / targetAmount) * 100, 100);

    return {
      deposits,
      totalSaved,
      remainingAmount,
      percentageComplete,
      estimatedDate,
      monthsRemaining,
    };
  }, [config]);
}
