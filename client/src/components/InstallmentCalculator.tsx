import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, DollarSign } from "lucide-react";

interface InstallmentCalculatorProps {
  currentSavings: number;
}

export default function InstallmentCalculator({
  currentSavings,
}: InstallmentCalculatorProps) {
  const [motoPrice, setMotoPrice] = useState("");
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [interestRate, setInterestRate] = useState("0");
  const [interestPeriod, setInterestPeriod] = useState<"monthly" | "annual">("annual");
  const [calculationType, setCalculationType] = useState<"no-interest" | "with-interest">("no-interest");
  const [entryPercentage, setEntryPercentage] = useState(30);
  const [customEntry, setCustomEntry] = useState("");

  const handlePriceChange = (e: string) => {
    setMotoPrice(e.replace(/\D/g, ""));
  };

  const handleInterestChange = (e: string) => {
    setInterestRate(e.replace(/[^\d.]/g, "").slice(0, 5));
  };

  const handleEntryPercentageChange = (e: string) => {
    const value = parseInt(e.replace(/\D/g, "") || "0");
    if (value >= 0 && value <= 100) {
      setEntryPercentage(value);
      setCustomEntry("");
    }
  };

  const handleCustomEntryChange = (e: string) => {
    setCustomEntry(e.replace(/\D/g, ""));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const price = parseFloat(motoPrice || "0") / 100;
  
  // Determinar entrada: usar valor customizado ou porcentagem
  let entry = 0;
  if (customEntry) {
    entry = parseFloat(customEntry) / 100;
  } else {
    entry = (price * entryPercentage) / 100;
  }
  
  const remaining = price - entry;

  // Cálculo sem juros
  const monthlyPaymentNoInterest = remaining > 0 ? remaining / selectedMonths : 0;

  // Cálculo com juros - CORRIGIDO
  let monthlyPaymentWithInterest = 0;
  let totalWithInterest = 0;
  let totalInterest = 0;

  if (remaining > 0 && calculationType === "with-interest") {
    const rate = parseFloat(interestRate) / 100;
    const monthlyRate = interestPeriod === "annual" ? rate / 12 : rate;

    if (monthlyRate > 0) {
      // Fórmula correta: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
      const numerator = monthlyRate * Math.pow(1 + monthlyRate, selectedMonths);
      const denominator = Math.pow(1 + monthlyRate, selectedMonths) - 1;
      monthlyPaymentWithInterest = (remaining * numerator) / denominator;
      totalWithInterest = monthlyPaymentWithInterest * selectedMonths;
      totalInterest = totalWithInterest - remaining;
    } else {
      monthlyPaymentWithInterest = remaining / selectedMonths;
      totalWithInterest = remaining;
      totalInterest = 0;
    }
  }

  const monthlyPayment = calculationType === "no-interest" 
    ? monthlyPaymentNoInterest 
    : monthlyPaymentWithInterest;
  
  const totalPayment = calculationType === "no-interest" 
    ? remaining 
    : totalWithInterest;

  const canAffordEntry = currentSavings >= entry;
  const actualEntryPercentage = price > 0 ? (entry / price) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-heading text-gray-900 mb-4">Calculadora de Parcelamento</h3>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="motoPrice" className="text-sm font-medium text-gray-700">
              Valor da Moto (R$)
            </Label>
            <Input
              id="motoPrice"
              type="text"
              value={motoPrice ? `${(parseFloat(motoPrice) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="Ex: 17000"
              className="mt-2"
            />
          </div>

          {/* Entrada */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Entrada
            </Label>
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    checked={!customEntry}
                    onChange={() => setCustomEntry("")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Porcentagem do valor</span>
                </label>
                {!customEntry && (
                  <div className="ml-6">
                    <Input
                      type="text"
                      value={entryPercentage}
                      onChange={(e) => handleEntryPercentageChange(e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {price > 0 ? formatCurrency(entry) : "R$ 0,00"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    checked={!!customEntry}
                    onChange={() => setEntryPercentage(30)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Valor fixo</span>
                </label>
                {customEntry && (
                  <div className="ml-6">
                    <Input
                      type="text"
                      value={customEntry ? `${(parseFloat(customEntry) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}
                      onChange={(e) => handleCustomEntryChange(e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {customEntry ? `${actualEntryPercentage.toFixed(1)}% do valor` : ""}
                    </p>
                  </div>
                )}
              </div>

              {price > 0 && (
                <div className="text-xs text-blue-700 mt-2 p-2 bg-blue-100 rounded">
                  Saldo disponível: {formatCurrency(currentSavings)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="months" className="text-sm font-medium text-gray-700">
                Parcelar em (meses)
              </Label>
              <select
                id="months"
                value={selectedMonths}
                onChange={(e) => setSelectedMonths(parseInt(e.target.value))}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value={6}>6 meses</option>
                <option value={12}>12 meses</option>
                <option value={24}>24 meses</option>
                <option value={36}>36 meses</option>
              </select>
            </div>

            <div>
              <Label htmlFor="calc-type" className="text-sm font-medium text-gray-700">
                Tipo de Cálculo
              </Label>
              <select
                id="calc-type"
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value as "no-interest" | "with-interest")}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="no-interest">Sem Juros</option>
                <option value="with-interest">Com Juros</option>
              </select>
            </div>
          </div>

          {calculationType === "with-interest" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interest" className="text-sm font-medium text-gray-700">
                  Taxa de Juros (%)
                </Label>
                <Input
                  id="interest"
                  type="text"
                  value={interestRate}
                  onChange={(e) => handleInterestChange(e.target.value)}
                  placeholder="0.00"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="period" className="text-sm font-medium text-gray-700">
                  Período da Taxa
                </Label>
                <select
                  id="period"
                  value={interestPeriod}
                  onChange={(e) => setInterestPeriod(e.target.value as "monthly" | "annual")}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="annual">Ao Ano (a.a.)</option>
                  <option value="monthly">Ao Mês (a.m.)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {price > 0 && (
          <div className="space-y-4">
            {/* Alerta de Entrada */}
            <div
              className={`p-4 rounded-lg border flex gap-3 ${
                canAffordEntry
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <AlertCircle
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  canAffordEntry ? "text-emerald-600" : "text-orange-600"
                }`}
              />
              <div className="text-sm">
                <p className={`font-semibold ${canAffordEntry ? "text-emerald-900" : "text-orange-900"}`}>
                  {canAffordEntry ? "✓ Entrada Acessível" : "⚠ Entrada Não Disponível"}
                </p>
                <p className={`text-xs mt-1 ${canAffordEntry ? "text-emerald-700" : "text-orange-700"}`}>
                  Entrada ({actualEntryPercentage.toFixed(1)}%): {formatCurrency(entry)} •{" "}
                  {canAffordEntry
                    ? `Você tem ${formatCurrency(currentSavings - entry)} de sobra`
                    : `Faltam ${formatCurrency(entry - currentSavings)}`}
                </p>
              </div>
            </div>

            {/* Resumo de Parcelamento */}
            <div className="space-y-3">
              {/* Card Principal */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-25 p-4 rounded-lg border border-emerald-200">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Entrada</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(entry)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Parcela Mensal</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {formatCurrency(monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total de Parcelas</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedMonths}x
                    </p>
                  </div>
                </div>
              </div>

              {/* Detalhes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Valor a Financiar</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(remaining)}
                  </p>
                </div>
                {calculationType === "with-interest" && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Total em Juros</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(totalInterest)}
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Total a Pagar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(entry + totalPayment)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedMonths} parcelas de {formatCurrency(monthlyPayment)}
                </p>
                {calculationType === "with-interest" && totalInterest > 0 && (
                  <p className="text-xs text-orange-600 mt-2 font-semibold">
                    + {formatCurrency(totalInterest)} em juros
                  </p>
                )}
              </div>

              {/* Comparação */}
              {calculationType === "with-interest" && totalInterest > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-600 mb-2">Economia sem Juros</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(totalInterest)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Se pagar sem juros: {formatCurrency(entry + remaining)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!price && (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Insira o valor da moto para calcular o parcelamento</p>
          </div>
        )}
      </div>
    </div>
  );
}
