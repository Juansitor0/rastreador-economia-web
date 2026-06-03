import { z } from "zod";

export const TransactionSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive("Valor deve ser maior que 0"),
  type: z.enum(["deposit", "withdrawal"]),
  date: z.string().datetime(),
  category: z.string().optional(),
});

export const UpdateFinancialProfileSchema = z.object({
  target_amount: z.number().positive().optional(),
  initial_balance: z.number().nonnegative().optional(),
  monthly_deposit_may: z.number().nonnegative().optional(),
  monthly_deposit_sep: z.number().nonnegative().optional(),
  base_salary: z.number().nonnegative().optional(),
  thirteenth_month: z.number().nonnegative().optional(),
  ppr: z.number().nonnegative().optional(),
  bonuses: z.number().nonnegative().optional(),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;
export type UpdateFinancialProfileInput = z.infer<typeof UpdateFinancialProfileSchema>;
