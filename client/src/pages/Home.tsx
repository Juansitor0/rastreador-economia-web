import React, { useState, useMemo, useEffect } from "react";
import { TrendingUp, Target, Calendar, DollarSign, Settings, LogOut } from "lucide-react";
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
import Auth from "@/components/Auth";
import { useSavingsCalculator } from "@/hooks/useSavingsCalculator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { nanoid } from "nanoid";

interface SalaryInfo {
  baseSalary: number;
  thirteenthMonth: number;
  ppr: number;
  bonuses: number;
}

interface User {
  id: string;
  username: string;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>("currentUser", null);
  
  // Prefixar chaves com o ID do usuário para isolamento
  const userPrefix = currentUser ? `${currentUser.id}_` : "";

  // Estado com localStorage (agora isolado por usuário)
  const [targetAmount, setTargetAmount] = useLocalStorage<number>(`${userPrefix}targetAmount`, 30000);
  const [initialBalance, setInitialBalance] = useLocalStorage<number>(`${userPrefix}initialBalance`, 0);
  const [monthlyDepositMay, setMonthlyDepositMay] = useLocalStorage<number>(`${userPrefix}monthlyDepositMay`, 0);
  const [monthlyDepositSep, setMonthlyDepositSep] = useLocalStorage<number>(`${userPrefix}monthlyDepositSep`, 0);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(`${userPrefix}transactions`, []);
  const [salaryInfo, setSalaryInfo] = useLocalStorage<SalaryInfo>(
    `${userPrefix}salaryInfo`,
    {
      baseSalary: 0,
      thirteenthMonth: 0,
      ppr: 0,
      bonuses: 0,
    }
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Se não estiver logado, mostra a tela de Auth
  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} />;
  }

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

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
    currentDate: new Date(),
    monthlyDepositMay,
    monthlyDepositSep,
  });

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              Rastreador de Economia
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">
              Olá, <strong>{currentUser.username}</strong>
            </span>
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Ajustes
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard
            title="Saldo Atual"
            value={formatCurrency(totalBalance)}
            icon={<DollarSign className="text-green-600" />}
            trend={totalBalance >= targetAmount ? "Meta atingida!" : "Em progresso"}
          />
          <InfoCard
            title="Meta"
            value={formatCurrency(targetAmount)}
            icon={<Target className="text-primary" />}
          />
          <InfoCard
            title="Progresso"
            value={`${projection.percentage.toFixed(1)}%`}
            icon={<TrendingUp className="text-blue-600" />}
          />
          <InfoCard
            title="Previsão"
            value={projection.estimatedDate.toLocaleDateString("pt-BR", {
              month: "short",
              year: "numeric",
            })}
            icon={<Calendar className="text-orange-600" />}
            trend={`${projection.monthsRemaining} meses restantes`}
          />
        </div>

        <div className="mb-8">
          <ProgressBar percentage={projection.percentage} />
        </div>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="bg-white border p-1 rounded-xl shadow-sm overflow-x-auto flex whitespace-nowrap">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="historico">Transações</TabsTrigger>
            <TabsTrigger value="salario">Salário</TabsTrigger>
            <TabsTrigger value="parcelamento">Parcelamento</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <DepositTimeline timeline={projection.deposits} />
              </div>
              <div>
                <MilestoneAlerts projection={projection} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <TransactionHistory 
              transactions={transactions} 
              onAddTransaction={(t) => setTransactions([...transactions, { ...t, id: nanoid() }])}
              onDeleteTransaction={(id) => setTransactions(transactions.filter(t => t.id !== id))}
            />
          </TabsContent>

          <TabsContent value="salario">
            <SalaryManager 
              salaryInfo={salaryInfo} 
              onUpdateSalary={setSalaryInfo} 
            />
          </TabsContent>

          <TabsContent value="parcelamento">
            <InstallmentCalculator 
              currentSavings={totalBalance} 
            />
          </TabsContent>
        </Tabs>
      </main>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        targetAmount={targetAmount}
        setTargetAmount={setTargetAmount}
        initialBalance={initialBalance}
        setInitialBalance={setInitialBalance}
        monthlyDepositMay={monthlyDepositMay}
        setMonthlyDepositMay={setMonthlyDepositMay}
        monthlyDepositSep={monthlyDepositSep}
        setMonthlyDepositSep={setMonthlyDepositSep}
      />
    </div>
  );
}
