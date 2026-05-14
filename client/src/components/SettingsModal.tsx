import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialBalance: number;
  monthlyDepositMay: number;
  monthlyDepositSep: number;
  onSave: (balance: number, depositMay: number, depositSep: number) => void;
}

export default function SettingsModal({
  open,
  onOpenChange,
  initialBalance,
  monthlyDepositMay,
  monthlyDepositSep,
  onSave,
}: SettingsModalProps) {
  const [balance, setBalance] = useState(initialBalance.toString());
  const [depositMay, setDepositMay] = useState(monthlyDepositMay.toString());
  const [depositSep, setDepositSep] = useState(monthlyDepositSep.toString());

  const handleSave = () => {
    const newBalance = parseFloat(balance) || 0;
    const newDepositMay = parseFloat(depositMay) || 0;
    const newDepositSep = parseFloat(depositSep) || 0;

    if (newBalance >= 0 && newDepositMay >= 0 && newDepositSep >= 0) {
      onSave(newBalance, newDepositMay, newDepositSep);
      onOpenChange(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = value.replace(/\D/g, "");
    if (!numValue) return "";
    return (parseInt(numValue) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Configurações de Economia</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="balance" className="text-sm font-medium text-gray-700">
              Saldo Inicial (R$)
            </Label>
            <Input
              id="balance"
              type="text"
              value={balance}
              onChange={(e) => setBalance(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="mt-2"
            />
            {balance && (
              <p className="text-xs text-gray-500 mt-1">
                R$ {formatCurrency(balance)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="depositMay" className="text-sm font-medium text-gray-700">
              Depósito Mensal (Maio - Agosto) (R$)
            </Label>
            <Input
              id="depositMay"
              type="text"
              value={depositMay}
              onChange={(e) => setDepositMay(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="mt-2"
            />
            {depositMay && (
              <p className="text-xs text-gray-500 mt-1">
                R$ {formatCurrency(depositMay)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="depositSep" className="text-sm font-medium text-gray-700">
              Depósito Mensal (Setembro em diante) (R$)
            </Label>
            <Input
              id="depositSep"
              type="text"
              value={depositSep}
              onChange={(e) => setDepositSep(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="mt-2"
            />
            {depositSep && (
              <p className="text-xs text-gray-500 mt-1">
                R$ {formatCurrency(depositSep)}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
