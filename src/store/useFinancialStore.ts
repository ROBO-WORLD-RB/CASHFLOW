import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, SavingsGoal, SavingsEntry, GroupGoal, GroupContribution, BudgetCategory, SupportedCurrency } from '@/types';

interface FinancialState {
  // Transactions
  transactions: Transaction[];

  // Savings
  savingsGoals: SavingsGoal[];
  savingsEntries: SavingsEntry[];

  // Group savings
  groupGoals: GroupGoal[];
  groupContributions: GroupContribution[];

  // Budget
  budgetCategories: BudgetCategory[];

  // Actions

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Savings actions
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;

  addSavingsEntry: (entry: Omit<SavingsEntry, 'id' | 'userId' | 'createdAt'>) => void;
  updateSavingsEntry: (id: string, updates: Partial<SavingsEntry>) => void;
  deleteSavingsEntry: (id: string) => void;

  // Group savings actions
  addGroupGoal: (goal: Omit<GroupGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGroupGoal: (id: string, updates: Partial<GroupGoal>) => void;
  deleteGroupGoal: (id: string) => void;

  addGroupContribution: (contribution: Omit<GroupContribution, 'id' | 'createdAt'>) => void;
  updateGroupContribution: (id: string, updates: Partial<GroupContribution>) => void;
  deleteGroupContribution: (id: string) => void;

  // Budget actions
  addBudgetCategory: (category: Omit<BudgetCategory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteBudgetCategory: (id: string) => void;

  // Computed values
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getAvailableBalance: () => number;
  getTotalSavings: () => number;
  getTransactionsByCategory: () => Record<string, Transaction[]>;
  getSavingsProgress: (goalId: string) => number;
  getGroupSavingsProgress: (groupId: string) => number;
}

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      // Initial state
      transactions: [],
      savingsGoals: [],
      savingsEntries: [],
      groupGoals: [],
      groupContributions: [],
      budgetCategories: [],

      // Transaction actions
      addTransaction: (transactionData) => {
        const transaction: Transaction = {
          ...transactionData,
          id: generateId(),
          userId: 'demo-user',
          createdAt: new Date()
        };

        const state = get();
        set({ transactions: [...state.transactions, transaction] });
      },

      updateTransaction: (id, updates) => {
        const state = get();
        set({
          transactions: state.transactions.map(t =>
            t.id === id ? { ...t, ...updates } : t
          )
        });
      },

      deleteTransaction: (id) => {
        const state = get();
        set({
          transactions: state.transactions.filter(t => t.id !== id)
        });
      },

      // Savings goal actions
      addSavingsGoal: (goalData) => {
        const goal: SavingsGoal = {
          ...goalData,
          id: generateId(),
          userId: 'demo-user',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const state = get();
        set({ savingsGoals: [...state.savingsGoals, goal] });
      },

      updateSavingsGoal: (id, updates) => {
        const state = get();
        set({
          savingsGoals: state.savingsGoals.map(g =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
          )
        });
      },

      deleteSavingsGoal: (id) => {
        const state = get();
        set({
          savingsGoals: state.savingsGoals.filter(g => g.id !== id),
          savingsEntries: state.savingsEntries.filter(e => e.goalId !== id)
        });
      },

      // Savings entry actions
      addSavingsEntry: (entryData) => {
        const entry: SavingsEntry = {
          ...entryData,
          id: generateId(),
          userId: 'demo-user',
          createdAt: new Date()
        };

        const state = get();
        set({ savingsEntries: [...state.savingsEntries, entry] });
      },

      updateSavingsEntry: (id, updates) => {
        const state = get();
        set({
          savingsEntries: state.savingsEntries.map(e =>
            e.id === id ? { ...e, ...updates } : e
          )
        });
      },

      deleteSavingsEntry: (id) => {
        const state = get();
        set({
          savingsEntries: state.savingsEntries.filter(e => e.id !== id)
        });
      },

      // Group goal actions
      addGroupGoal: (goalData) => {
        const goal: GroupGoal = {
          ...goalData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const state = get();
        set({ groupGoals: [...state.groupGoals, goal] });
      },

      updateGroupGoal: (id, updates) => {
        const state = get();
        set({
          groupGoals: state.groupGoals.map(g =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
          )
        });
      },

      deleteGroupGoal: (id) => {
        const state = get();
        set({
          groupGoals: state.groupGoals.filter(g => g.id !== id),
          groupContributions: state.groupContributions.filter(c => c.groupId !== id)
        });
      },

      // Group contribution actions
      addGroupContribution: (contributionData) => {
        const contribution: GroupContribution = {
          ...contributionData,
          id: generateId(),
          createdAt: new Date()
        };

        const state = get();
        set({ groupContributions: [...state.groupContributions, contribution] });
      },

      updateGroupContribution: (id, updates) => {
        const state = get();
        set({
          groupContributions: state.groupContributions.map(c =>
            c.id === id ? { ...c, ...updates } : c
          )
        });
      },

      deleteGroupContribution: (id) => {
        const state = get();
        set({
          groupContributions: state.groupContributions.filter(c => c.id !== id)
        });
      },

      // Budget actions
      addBudgetCategory: (categoryData) => {
        const category: BudgetCategory = {
          ...categoryData,
          id: generateId(),
          userId: 'demo-user',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const state = get();
        set({ budgetCategories: [...state.budgetCategories, category] });
      },

      updateBudgetCategory: (id, updates) => {
        const state = get();
        set({
          budgetCategories: state.budgetCategories.map(c =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          )
        });
      },

      deleteBudgetCategory: (id) => {
        const state = get();
        set({
          budgetCategories: state.budgetCategories.filter(c => c.id !== id)
        });
      },

      // Computed values
      getTotalIncome: () => {
        const state = get();
        return state.transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalExpenses: () => {
        const state = get();
        return state.transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getAvailableBalance: () => {
        const state = get();
        return state.getTotalIncome() - state.getTotalExpenses();
      },

      getTotalSavings: () => {
        const state = get();
        return state.savingsEntries.reduce((sum, e) => sum + e.amount, 0);
      },

      getTransactionsByCategory: () => {
        const state = get();
        return state.transactions.reduce((acc, transaction) => {
          const category = transaction.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(transaction);
          return acc;
        }, {} as Record<string, Transaction[]>);
      },

      getSavingsProgress: (goalId: string) => {
        const state = get();
        const goal = state.savingsGoals.find(g => g.id === goalId);
        if (!goal || !goal.targetAmount) return 0;

        const totalSaved = state.savingsEntries
          .filter(e => e.goalId === goalId)
          .reduce((sum, e) => sum + e.amount, 0);

        return Math.min((totalSaved / goal.targetAmount) * 100, 100);
      },

      getGroupSavingsProgress: (groupId: string) => {
        const state = get();
        const goal = state.groupGoals.find(g => g.id === groupId);
        if (!goal) return 0;

        const totalContributed = state.groupContributions
          .filter(c => c.groupId === groupId)
          .reduce((sum, c) => sum + c.amount, 0);

        return Math.min((totalContributed / goal.targetAmount) * 100, 100);
      }
    }),
    {
      name: 'budgetup-financial-store',
      version: 1,
    }
  )
);