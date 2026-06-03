import { User, FinancialProfile, Transaction } from "../types.js";
import { v4 as uuidv4 } from "uuid";

// In-memory database for development
// In production, this would be replaced with a real database (PostgreSQL, MySQL, etc.)
class Database {
  private users: Map<string, User> = new Map();
  private financialProfiles: Map<string, FinancialProfile> = new Map();
  private transactions: Map<string, Transaction> = new Map();

  // User operations
  async createUser(name: string, email: string, password_hash: string): Promise<User> {
    const id = uuidv4();
    const now = new Date();
    const user: User = {
      id,
      name,
      email,
      password_hash,
      created_at: now,
      updated_at: now,
    };
    this.users.set(id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates, updated_at: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  // Financial Profile operations
  async createFinancialProfile(user_id: string, data: Partial<FinancialProfile>): Promise<FinancialProfile> {
    const id = uuidv4();
    const now = new Date();
    const profile: FinancialProfile = {
      id,
      user_id,
      target_amount: data.target_amount || 30000,
      initial_balance: data.initial_balance || 0,
      monthly_deposit_may: data.monthly_deposit_may || 0,
      monthly_deposit_sep: data.monthly_deposit_sep || 0,
      base_salary: data.base_salary || 0,
      thirteenth_month: data.thirteenth_month || 0,
      ppr: data.ppr || 0,
      bonuses: data.bonuses || 0,
      created_at: now,
      updated_at: now,
    };
    this.financialProfiles.set(id, profile);
    return profile;
  }

  async getFinancialProfileByUserId(user_id: string): Promise<FinancialProfile | null> {
    for (const profile of this.financialProfiles.values()) {
      if (profile.user_id === user_id) {
        return profile;
      }
    }
    return null;
  }

  async updateFinancialProfile(id: string, updates: Partial<FinancialProfile>): Promise<FinancialProfile | null> {
    const profile = this.financialProfiles.get(id);
    if (!profile) return null;
    const updated = { ...profile, ...updates, updated_at: new Date() };
    this.financialProfiles.set(id, updated);
    return updated;
  }

  // Transaction operations
  async createTransaction(financial_profile_id: string, data: Omit<Transaction, "id" | "created_at" | "updated_at">): Promise<Transaction> {
    const id = uuidv4();
    const now = new Date();
    const transaction: Transaction = {
      id,
      financial_profile_id,
      description: data.description,
      amount: data.amount,
      type: data.type,
      date: data.date,
      category: data.category,
      created_at: now,
      updated_at: now,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByProfileId(financial_profile_id: string): Promise<Transaction[]> {
    const result: Transaction[] = [];
    for (const transaction of this.transactions.values()) {
      if (transaction.financial_profile_id === financial_profile_id) {
        result.push(transaction);
      }
    }
    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    const transaction = this.transactions.get(id);
    if (!transaction) return null;
    const updated = { ...transaction, ...updates, updated_at: new Date() };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }
}

export const db = new Database();
