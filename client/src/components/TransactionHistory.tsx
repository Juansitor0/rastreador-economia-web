import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  type: "deposit" | "withdrawal";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  onRemoveTransaction: (id: string) => void;
}

export default function TransactionHistory({
  transactions,
  onAddTransaction,
  onRemoveTransaction,
}: TransactionHistoryProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleAddTransaction = () => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount > 0) {
      onAddTransaction({
        date: new Date(date),
        amount: numAmount,
        description,
        type,
      });
      setAmount("");
      setDescription("");
      setType("deposit");
      setDate(new Date().toISOString().split("T")[0]);
      setDialogOpen(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-heading text-gray-900">Histórico de Transações</h3>
        <Button
          onClick={() => setDialogOpen(true)}
          size="sm"
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          Adicionar Transação
        </Button>
      </div>

      {/* Dialog para adicionar transação */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Transação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="trans-type" className="text-sm font-medium text-gray-700">
                Tipo
              </Label>
              <select
                id="trans-type"
                value={type}
                onChange={(e) => setType(e.target.value as "deposit" | "withdrawal")}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="deposit">Depósito</option>
                <option value="withdrawal">Saque/Retirada</option>
              </select>
            </div>

            <div>
              <Label htmlFor="trans-date" className="text-sm font-medium text-gray-700">
                Data
              </Label>
              <Input
                id="trans-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="trans-amount" className="text-sm font-medium text-gray-700">
                Valor (R$)
              </Label>
              <Input
                id="trans-amount"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                placeholder="0"
                className="mt-2"
              />
              {amount && (
                <p className="text-xs text-gray-500 mt-1">
                  R$ {(parseFloat(amount) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="trans-desc" className="text-sm font-medium text-gray-700">
                Observação (opcional)
              </Label>
              <Input
                id="trans-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: 13º salário, PPR, etc"
                className="mt-2"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddTransaction}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lista de transações */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {sortedTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">Nenhuma transação registrada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description || (transaction.type === "deposit" ? "Depósito" : "Saque")}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.type === "deposit"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.type === "deposit" ? "Entrada" : "Saída"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {transaction.date.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        transaction.type === "deposit"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "deposit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveTransaction(transaction.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
