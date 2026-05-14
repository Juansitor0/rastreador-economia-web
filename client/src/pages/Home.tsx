import { useState, useMemo } from "react";
import { TrendingUp, Target, Calendar, DollarSign, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoCard from "@/components/InfoCard";
import ProgressBar from "@/components/ProgressBar";
import DepositTimeline from "@/components/DepositTimeline";
import MilestoneAlerts from "@/components/MilestoneAlerts";
import InstallmentCalculator from "@/components/InstallmentCalculator";
import SettingsModal from "@/components/SettingsModal";
import TransactionHistory, { Transaction } from "@/components/TransactionHistory";
import SalaryManager from "@/components/SalaryManager";
import { useSavingsCalculator } from "@/hooks/useSavingsCalculator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { nanoid } from "nanoid";

interface SalaryInfo {
  baseSalary: number;
  thirteenthMonth: number;
  ppr: number;
  bonuses: number;
}

export default function Home() {
  // Estado com localStorage
  const [targetAmount, setTargetAmount] = useLocalStorage<number>("targetAmount", 30000);
  const [initialBalance, setInitialBalance] = useLocalStorage<number>("initialBalance", 1119);
  const [monthlyDepositMay, setMonthlyDepositMay] = useLocalStorage<number>("monthlyDepositMay", 400);
  const [monthlyDepositSep, setMonthlyDepositSep] = useLocalStorage<number>("monthlyDepositSep", 1000);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", []);
  const [salaryInfo, setSalaryInfo] = useLocalStorage<SalaryInfo>(
    "salaryInfo",
    {
      baseSalary: 0,
      thirteenthMonth: 0,
      ppr: 0,
      bonuses: 0,
    }
  );

  // Estado local
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [inputValue, setInputValue] = useState("30000");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Calcular saldo total considerando transações
  const totalBalance = useMemo(() => {
    const transactionSum = transactions.reduce((sum, t) => {
      return t.type === "deposit" ? sum + t.amount : sum - t.amount;
    }, 0);
    return initialBalance + transactionSum;
  }, [initialBalance, transactions]);

  const projection = useSavingsCalculator({
    initialBalance: totalBalance,
    targetAmount,
    currentDate: new Date(2026, 4, 12), // Maio 12, 2026
    monthlyDepositMay,
    monthlyDepositSep,
  });

  // Gerar cronograma combinando transações reais com projeção
  const combinedTimeline = useMemo(() => {
    const timeline: Array<any> = [];

    // Adicionar transações reais primeiro
    const sortedTransactions = [...transactions]
      .filter((t) => t.type === "deposit")
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    sortedTransactions.forEach((transaction) => {
      timeline.push({
        month: transaction.date.toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
        amount: transaction.amount,
        date: transaction.date,
        isCompleted: true,
        type: "actual" as const,
        description: transaction.description || "Depósito Realizado",
      });
    });

    // Adicionar depósitos projetados
    projection.deposits.forEach((deposit) => {
      const isAlreadyRecorded = sortedTransactions.some(
        (t) =>
          t.date.getMonth() === deposit.date.getMonth() &&
          t.date.getFullYear() === deposit.date.getFullYear()
      );

      if (!isAlreadyRecorded) {
        timeline.push({
          month: deposit.date.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          }),
          amount: deposit.amount,
          date: deposit.date,
          isCompleted: false,
          type: "projected" as const,
          description: `Depósito Programado - R$ ${deposit.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        });
      }
    });

    // Ordenar por data
    return timeline.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [transactions, projection.deposits]) as Array<any>;

  const handleSetTarget = () => {
    const value = parseFloat(inputValue.replace(/\D/g, "") || "0") / 100;
    if (value > 0) {
      setTargetAmount(value);
      setShowTargetForm(false);
    }
  };

  const handleSaveSettings = (
    balance: number,
    depositMay: number,
    depositSep: number
  ) => {
    setInitialBalance(balance);
    setMonthlyDepositMay(depositMay);
    setMonthlyDepositSep(depositSep);
  };

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    setTransactions([...transactions, { ...transaction, id: nanoid() }]);
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleUpdateSalary = (salary: SalaryInfo) => {
    setSalaryInfo(salary);
  };

  const upcomingDeposits = useMemo(
    () => combinedTimeline.slice(0, 6),
    [combinedTimeline]
  );

  const daysRemaining = projection.estimatedDate
    ? Math.ceil(
        (projection.estimatedDate.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-display text-gray-900">Rastreador de Economia</h1>
                <p className="text-xs text-gray-600">
                  Acompanhe seu progresso em direção à compra da sua moto
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
            <TabsTrigger value="salario">Salário</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="parcelamento">Parcelamento</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Meta Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-heading text-gray-900">Sua Meta</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTargetForm(!showTargetForm)}
                  className="text-xs"
                >
                  {showTargetForm ? "Cancelar" : "Editar Meta"}
                </Button>
              </div>

              {showTargetForm && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor da Moto (R$)
                    </label>
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="0,00"
                      className="text-lg"
                    />
                  </div>
                  <Button
                    onClick={handleSetTarget}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Atualizar Meta
                  </Button>
                </div>
              )}

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard
                  label="Saldo Atual"
                  value={`R$ ${totalBalance.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`}
                  icon={<DollarSign className="w-6 h-6" />}
                  highlight={true}
                />
                <InfoCard
                  label="Meta"
                  value={`R$ ${targetAmount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`}
                  icon={<Target className="w-6 h-6" />}
                />
                <InfoCard
                  label="Falta para Meta"
                  value={`R$ ${projection.remainingAmount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`}
                  description={
                    projection.remainingAmount === 0
                      ? "Meta atingida! 🎉"
                      : `${projection.monthsRemaining} meses`
                  }
                />
                <InfoCard
                  label="Data Estimada"
                  value={
                    projection.estimatedDate
                      ? projection.estimatedDate.toLocaleDateString("pt-BR")
                      : "Calculando..."
                  }
                  icon={<Calendar className="w-6 h-6" />}
                  description={
                    daysRemaining > 0 ? `${daysRemaining} dias` : "Hoje!"
                  }
                />
              </div>

              {/* Progress Bar */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <ProgressBar
                  current={projection.totalSaved}
                  target={targetAmount}
                  label="Progresso da Meta"
                  showPercentage={true}
                />
              </div>
            </div>

            {/* Deposits Timeline */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <DepositTimeline deposits={upcomingDeposits} />
            </div>

            {/* Summary Section */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8">
              <h3 className="text-heading text-gray-900 mb-4">Resumo da Jornada</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-gray-600 mb-2">Depósitos até Agosto</p>
                  <p className="text-lg font-semibold text-gray-900">
                    4 × R$ {monthlyDepositMay.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total: R${" "}
                    {(monthlyDepositMay * 4).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Depósitos a partir de Setembro</p>
                  <p className="text-lg font-semibold text-gray-900">
                    R$ {monthlyDepositSep.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Por mês</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Tempo até a Meta</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {projection.monthsRemaining} meses
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {projection.estimatedDate
                      ? projection.estimatedDate.toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })
                      : "Calculando..."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Transações Tab */}
          <TabsContent value="transacoes" className="space-y-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <TransactionHistory
                transactions={transactions}
                onAddTransaction={handleAddTransaction}
                onRemoveTransaction={handleRemoveTransaction}
              />
            </div>
          </TabsContent>

          {/* Salário Tab */}
          <TabsContent value="salario" className="space-y-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <SalaryManager
                salaryInfo={salaryInfo}
                onUpdateSalary={handleUpdateSalary}
              />
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <MilestoneAlerts
                currentPercentage={projection.percentageComplete}
                targetAmount={targetAmount}
                currentAmount={projection.totalSaved}
              />
            </div>
          </TabsContent>

          {/* Parcelamento Tab */}
          <TabsContent value="parcelamento" className="space-y-8">
            <InstallmentCalculator currentSavings={totalBalance} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        initialBalance={initialBalance}
        monthlyDepositMay={monthlyDepositMay}
        monthlyDepositSep={monthlyDepositSep}
        onSave={handleSaveSettings}
      />

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-xs text-gray-500">
          <p>
            Rastreador de Economia para Moto • Atualizado em{" "}
            {new Date().toLocaleDateString("pt-BR")}
          </p>
          <p className="mt-2 text-emerald-600 font-semibold">
            ✓ Seus dados são salvos automaticamente
          </p>
        </div>
      </footer>
    </div>
  );
}
