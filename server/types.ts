export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: string;
  financial_profile_id: string;
  description: string;
  amount: number;
  type: "deposit" | "withdrawal";
  date: Date;
  category?: string;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
