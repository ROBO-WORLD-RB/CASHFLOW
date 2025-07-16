export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  currency: SupportedCurrency;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount?: number;
  currency: SupportedCurrency;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingsEntry {
  id: string;
  userId: string;
  goalId?: string;
  amount: number;
  currency: SupportedCurrency;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface GroupGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currency: SupportedCurrency;
  participants: string[];
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupContribution {
  id: string;
  groupId: string;
  amount: number;
  currency: SupportedCurrency;
  participantName: string;
  participantId?: string;
  date: Date;
  time: string;
  description?: string;
  createdAt: Date;
}

export interface BudgetCategory {
  id: string;
  userId: string;
  name: string;
  budgetedAmount: number;
  spentAmount: number;
  currency: SupportedCurrency;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  availableBalance: number;
  currency: SupportedCurrency;
  period: 'monthly' | 'yearly';
}

export type SupportedCurrency = 'GHS' | 'USD' | 'EUR';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}