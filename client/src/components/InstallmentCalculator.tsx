import { useState, useEffect } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingDown, CheckCircle } from "lucide-react";
import { Loader2 } from "lucide-react";

interface InstallmentCalculatorProps {
  currentSavings: number;
  targetPrice?: number;
}

export default function InstallmentCalculator({
  currentSavings,
  targetPrice = 30000,
}: InstallmentCalculatorProps) {
  const calculator = useCalculator();
  const [vehiclePrice, setVehiclePrice] = useState(targetPrice.toString());
  const [downPayment, setDownPayment] = useState(currentSavings.toString());
  const [interestRate, setInterestRate] = useState("12");
  const [adminFee, setAdminFee] = useState("5");
  const [registrationFee, setRegistrationFee] = useState("0");
  const [transferFee, setTransferFee] = useState("0");
  const [insurancePercentage, setInsurancePercentage] = useState("10");

  const [scenarios, setScenarios] = useState<any>(null);
  const [cashResult, setCashResult] = useState<any>(null);
  const [financingResult, setFinancingResult] = useState<any>(null);
  const [consortiumResult, setConsortiumResult] = useState<any>(null);
  const [realCostResult, setRealCostResult] = useState<any>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCalculate = async () => {
    const price = parseFloat(vehiclePrice) || 0;
    const down = parseFloat(downPayment) || 0;

    if (price <= 0) {
      alert("Preço da moto deve ser maior que 0");
      return;
    }

    // Calculate all scenarios
    const cash = await calculator.calculateCashPurchase(
      currentSavings,
      price,
      []
    );
    if (cash) setCashResult(cash);

    const financing = await calculator.calculateFinancing(
      price,
      down,
      parseFloat(interestRate) || 12,
      60
    );
    if (financing) setFinancingResult(financing);

    const consortium = await calculator.calculateConsortium(
      price,
      down,
      parseFloat(adminFee) || 5,
      60
    );
    if (consortium) setConsortiumResult(consortium);

    const realCost = await calculator.calculateRealAcquisitionCost(
      price,
      parseFloat(registrationFee) || 0,
      parseFloat(transferFee) || 0,
      parseFloat(insurancePercentage) || 10,
      []
    );
    if (realCost) setRealCostResult(realCost);

    // Compare scenarios
    const comparison = await calculator.compareScenarios(price, parseFloat(interestRate) || 12);
    if (comparison) setScenarios(comparison);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Configurar Simulação</CardTitle>
          <CardDescription>
            Defina os parâmetros para simular diferentes cenários de compra
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle-price">Preço da Moto (R$)</Label>
              <Input
                id="vehicle-price"
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                placeholder="30000"
              />
            </div>
            <div>
              <Label htmlFor="down-payment">Entrada/Saldo Atual (R$)</Label>
              <Input
                id="down-payment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder={currentSavings.toString()}
              />
            </div>
            <div>
              <Label htmlFor="interest-rate">Taxa de Juros Anual (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="12"
              />
            </div>
            <div>
              <Label htmlFor="admin-fee">Taxa de Administração Consórcio (%)</Label>
              <Input
                id="admin-fee"
                type="number"
                value={adminFee}
                onChange={(e) => setAdminFee(e.target.value)}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="registration-fee">Taxa de Emplacamento (R$)</Label>
              <Input
                id="registration-fee"
                type="number"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="transfer-fee">Taxa de Transferência (R$)</Label>
              <Input
                id="transfer-fee"
                type="number"
                value={transferFee}
                onChange={(e) => setTransferFee(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="insurance">Percentual de Seguro (%)</Label>
              <Input
                id="insurance"
                type="number"
                value={insurancePercentage}
                onChange={(e) => setInsurancePercentage(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full" disabled={calculator.loading}>
            {calculator.loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculando...
              </>
            ) : (
              "Calcular Cenários"
            )}
          </Button>

          {calculator.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {calculator.error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {scenarios && (
        <div className="space-y-4">
          {/* Recommendation */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Recomendação</p>
                  <p className="text-sm text-blue-800">{scenarios.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different scenarios */}
          <Tabs defaultValue="cash" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cash">Compra à Vista</TabsTrigger>
              <TabsTrigger value="financing">Financiamento</TabsTrigger>
              <TabsTrigger value="consortium">Consórcio</TabsTrigger>
            </TabsList>

            {/* Cash Purchase Tab */}
            <TabsContent value="cash">
              {cashResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Compra à Vista</CardTitle>
                    <CardDescription>
                      Projeção baseada na sua média de depósitos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Saldo Atual</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(cashResult.totalSaved)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Falta Juntar</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(cashResult.remainingAmount)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Média Mensal</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(cashResult.monthlyAverage)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Meses Restantes</p>
                        <p className="text-lg font-semibold">
                          {cashResult.monthsToGoal} meses
                        </p>
                      </div>
                    </div>

                    {cashResult.achievable ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✓ Você conseguirá juntar o valor até{" "}
                          <strong>
                            {new Date(cashResult.estimatedDate).toLocaleDateString("pt-BR")}
                          </strong>
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">
                          Sem depósitos regulares, a projeção não é possível
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Financing Tab */}
            <TabsContent value="financing">
              {financingResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Financiamento</CardTitle>
                    <CardDescription>
                      Cálculo com juros compostos (Tabela Price)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Parcela Mensal</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(financingResult.monthlyPayment)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Entrada</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(financingResult.downPayment)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Total de Juros</p>
                        <p className="text-lg font-semibold text-red-600">
                          {formatCurrency(financingResult.totalInterest)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">% de Juros</p>
                        <p className="text-lg font-semibold text-red-600">
                          {financingResult.interestPercentage}%
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Parcelas</p>
                        <p className="text-lg font-semibold">
                          {financingResult.numberOfInstallments}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Total Pago</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(financingResult.totalPayment)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                      <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">
                          Custo Real do Financiamento
                        </p>
                        <p className="text-sm text-red-800">
                          Você pagará {formatCurrency(financingResult.totalInterest)} a mais
                          em juros ({financingResult.interestPercentage}% do valor da moto)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Consortium Tab */}
            <TabsContent value="consortium">
              {consortiumResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Consórcio</CardTitle>
                    <CardDescription>
                      Simulação com taxa de administração e lances
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Parcela Mensal</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(consortiumResult.totalMonthlyPayment)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Entrada</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(consortiumResult.downPayment)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Taxa Administração</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(consortiumResult.administrationFee)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Parcelas</p>
                        <p className="text-lg font-semibold">
                          {consortiumResult.numberOfInstallments}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">% do Lance</p>
                        <p className="text-lg font-semibold">
                          {consortiumResult.lancePercentage}%
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Status do Lance</p>
                        <p className={`text-lg font-semibold ${consortiumResult.isGoodLance ? 'text-green-600' : 'text-yellow-600'}`}>
                          {consortiumResult.isGoodLance ? "✓ Bom" : "⚠ Fraco"}
                        </p>
                      </div>
                    </div>

                    {consortiumResult.isGoodLance ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✓ Seu lance de {consortiumResult.lancePercentage}% é considerado bom
                          para participar do consórcio
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠ Seu lance de {consortiumResult.lancePercentage}% é baixo. Considere
                          juntar mais antes de participar
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Real Acquisition Cost */}
          {realCostResult && (
            <Card>
              <CardHeader>
                <CardTitle>Custo Real de Aquisição</CardTitle>
                <CardDescription>
                  Inclui custos periféricos obrigatórios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Preço da Moto</span>
                    <span className="font-semibold">
                      {formatCurrency(realCostResult.vehiclePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Emplacamento</span>
                    <span className="font-semibold">
                      {formatCurrency(realCostResult.registrationFee)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Transferência</span>
                    <span className="font-semibold">
                      {formatCurrency(realCostResult.transferFee)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Seguro Inicial</span>
                    <span className="font-semibold">
                      {formatCurrency(realCostResult.insuranceCost)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-blue-50 rounded border border-blue-200 font-semibold">
                    <span className="text-blue-900">Total</span>
                    <span className="text-blue-900">
                      {formatCurrency(realCostResult.totalCost)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
