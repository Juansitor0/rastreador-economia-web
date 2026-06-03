import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  type: "deposit" | "withdrawal";
  category?: string;
}

export interface FinancialProfile {
  id: string;
  user_id: string;
  target_amount: number;
  initial_balance: number;
  monthly_deposit_may: number;
  monthly_deposit_sep: number;
  base_salary: number;
  thirteenth_month: number;
  ppr: number;
  bonuses: number;
}

export function useSavings() {
  const api = useApi();
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch financial profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const data = await api.get<FinancialProfile>("/financial/profile");
    if (data) {
      setProfile(data);
    }
    setLoading(false);
  }, [api]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const data = await api.get<Transaction[]>("/financial/transactions");
    if (data) {
      // Convert date strings to Date objects
      const transactions = data.map((t) => ({
        ...t,
        date: new Date(t.date),
      }));
      setTransactions(transactions);
    }
    setLoading(false);
  }, [api]);

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<FinancialProfile>) => {
      const updated = await api.put<FinancialProfile>(
        "/financial/profile",
        updates
      );
      if (updated) {
        setProfile(updated);
        return true;
      }
      return false;
    },
    [api]
  );

  // Add transaction
  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, "id">) => {
      const created = await api.post<Transaction>(
        "/financial/transactions",
        {
          ...transaction,
          date: transaction.date.toISOString(),
        }
      );
      if (created) {
        const newTransaction = {
          ...created,
          date: new Date(created.date),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
        return true;
      }
      return false;
    },
    [api]
  );

  // Delete transaction
  const deleteTransaction = useCallback(
    async (id: string) => {
      await api.delete(`/financial/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    },
    [api]
  );

  // Calculate total balance
  const calculateBalance = useCallback(() => {
    if (!profile) return 0;
    const transactionSum = transactions.reduce((sum, t) => {
      return t.type === "deposit" ? sum + t.amount : sum - t.amount;
    }, 0);
    return profile.initial_balance + transactionSum;
  }, [profile, transactions]);

  // Load data on mount
  useEffect(() => {
    fetchProfile();
    fetchTransactions();
  }, [fetchProfile, fetchTransactions]);

  return {
    profile,
    transactions,
    loading,
    fetchProfile,
    fetchTransactions,
    updateProfile,
    addTransaction,
    deleteTransaction,
    calculateBalance,
  };
}
