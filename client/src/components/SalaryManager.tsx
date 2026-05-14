import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { DollarSign, Edit2, Check, X } from "lucide-react";

interface SalaryInfo {
  baseSalary: number;
  thirteenthMonth: number;
  ppr: number;
  bonuses: number;
}

interface SalaryManagerProps {
  salaryInfo: SalaryInfo;
  onUpdateSalary: (salary: SalaryInfo) => void;
}

export default function SalaryManager({
  salaryInfo,
  onUpdateSalary,
}: SalaryManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [baseSalary, setBaseSalary] = useState(salaryInfo.baseSalary.toString());
  const [thirteenthMonth, setThirteenthMonth] = useState(
    salaryInfo.thirteenthMonth.toString()
  );
  const [ppr, setPpr] = useState(salaryInfo.ppr.toString());
  const [bonuses, setBonuses] = useState(salaryInfo.bonuses.toString());

  const handleSave = () => {
    onUpdateSalary({
      baseSalary: parseFloat(baseSalary) || 0,
      thirteenthMonth: parseFloat(thirteenthMonth) || 0,
      ppr: parseFloat(ppr) || 0,
      bonuses: parseFloat(bonuses) || 0,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setBaseSalary(salaryInfo.baseSalary.toString());
    setThirteenthMonth(salaryInfo.thirteenthMonth.toString());
    setPpr(salaryInfo.ppr.toString());
    setBonuses(salaryInfo.bonuses.toString());
    setIsEditing(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatInput = (value: string) => {
    const numValue = value.replace(/\D/g, "");
    if (!numValue) return "";
    return (parseInt(numValue) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
  };

  const totalMonthly = salaryInfo.baseSalary;
  const totalAnnual =
    salaryInfo.baseSalary * 12 +
    salaryInfo.thirteenthMonth +
    salaryInfo.ppr +
    salaryInfo.bonuses;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-heading text-gray-900">Informações de Salário</h3>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-25 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Salário Base (Mensal)</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(salaryInfo.baseSalary)}
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-25 border-emerald-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">13º Salário</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(salaryInfo.thirteenthMonth)}
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-25 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">PPR</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(salaryInfo.ppr)}
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-purple-600 flex-shrink-0" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-25 border-orange-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Bônus/Outros</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(salaryInfo.bonuses)}
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-orange-600 flex-shrink-0" />
            </div>
          </Card>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div>
            <Label htmlFor="base-salary" className="text-sm font-medium text-gray-700">
              Salário Base (Mensal) (R$)
            </Label>
            <Input
              id="base-salary"
              type="text"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="mt-2"
            />
            {baseSalary && (
              <p className="text-xs text-gray-500 mt-1">
                R$ {formatInput(baseSalary)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="thirteenth" className="text-sm font-medium text-gray-700">
              13º Salário (R$)
            </Label>
            <Input
              id="thirteenth"
              type="text"
              value={thirteenthMonth}
              onChange={(e) => setThirteenthMonth(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="mt-2"
            />
            {thirteenthMonth && (
              <p className="text-xs text-gray-500 mt-1">
                R$ {formatInput(thirteenthMonth)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="ppr" className="text-sm font-medium text-gray-700">
              PPR (R$)
            </Label>
            <Input
              id="ppr"
              type="text"
              value={ppr}
              onChange={(e) => setPpr(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="mt-2"
            />
            {ppr && (
              <p className="text-xs text-gray-500 mt-1">
                R$ {formatInput(ppr)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bonuses" className="text-sm font-medium text-gray-700">
              Bônus/Outros (R$)
            </Label>
            <Input
              id="bonuses"
              type="text"
              value={bonuses}
              onChange={(e) => setBonuses(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="mt-2"
            />
            {bonuses && (
              <p className="text-xs text-gray-500 mt-1">
                R$ {formatInput(bonuses)}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              <Check className="w-4 h-4" />
              Salvar
            </Button>
          </div>
        </div>
      )}

      {/* Resumo Anual */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Renda Mensal</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(totalMonthly)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Renda Anual Total</p>
            <p className="text-lg font-semibold text-emerald-600">
              {formatCurrency(totalAnnual)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
