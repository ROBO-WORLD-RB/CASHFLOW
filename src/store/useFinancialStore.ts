import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, SavingsGoal, SavingsEntry, GroupGoal, GroupContribution, BudgetCategory, SupportedCurrency } from '@/types';

interface UserPreferences {
  name: string;
  currency: SupportedCurrency;
  isSetupComplete: boolean;
}

interface FinancialState {
  // User preferences
  userPreferences: UserPreferences | null;
  
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

  // Migration tracking
  migrationVersion: number;

  // Actions
  setUserPreferences: (preferences: UserPreferences) => void;
  updateUserPreferences: (updates: Partial<UserPreferences>) => void;

  // Migration actions
  migrateCurrencyData: () => void;

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

const generateId = () => `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

// Migration utility to ensure all transactions have currency data
const migrateTransactionCurrency = (transactions: Transaction[], defaultCurrency: SupportedCurrency = 'USD'): Transaction[] => {
  return transactions.map(transaction => {
    // If transaction doesn't have currency field or it's undefined/null, add default currency
    if (!transaction.currency) {
      return {
        ...transaction,
        currency: defaultCurrency,
        // Set originalAmount to current amount if not already set
        originalAmount: transaction.originalAmount ?? transaction.amount
      };
    }
    
    // Ensure originalAmount is set for existing transactions
    if (transaction.originalAmount === undefined) {
      return {
        ...transaction,
        originalAmount: transaction.amount
      };
    }
    
    return transaction;
  });
};

// Migration utility for other financial entities
const migrateSavingsGoalCurrency = (goals: SavingsGoal[], defaultCurrency: SupportedCurrency = 'USD'): SavingsGoal[] => {
  return goals.map(goal => {
    if (!goal.currency) {
      return {
        ...goal,
        currency: defaultCurrency
      };
    }
    return goal;
  });
};

const migrateSavingsEntryCurrency = (entries: SavingsEntry[], defaultCurrency: SupportedCurrency = 'USD'): SavingsEntry[] => {
  return entries.map(entry => {
    if (!entry.currency) {
      return {
        ...entry,
        currency: defaultCurrency
      };
    }
    return entry;
  });
};

const migrateGroupGoalCurrency = (goals: GroupGoal[], defaultCurrency: SupportedCurrency = 'USD'): GroupGoal[] => {
  return goals.map(goal => {
    if (!goal.currency) {
      return {
        ...goal,
        currency: defaultCurrency
      };
    }
    return goal;
  });
};

const migrateGroupContributionCurrency = (contributions: GroupContribution[], defaultCurrency: SupportedCurrency = 'USD'): GroupContribution[] => {
  return contributions.map(contribution => {
    if (!contribution.currency) {
      return {
        ...contribution,
        currency: defaultCurrency
      };
    }
    return contribution;
  });
};

const migrateBudgetCategoryCurrency = (categories: BudgetCategory[], defaultCurrency: SupportedCurrency = 'USD'): BudgetCategory[] => {
  return categories.map(category => {
    if (!category.currency) {
      return {
        ...category,
        currency: defaultCurrency
      };
    }
    return category;
  });
};

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      // Initial state
      userPreferences: null,
      transactions: [],
      savingsGoals: [],
      savingsEntries: [],
      groupGoals: [],
      groupContributions: [],
      budgetCategories: [],
      migrationVersion: 0,

      // User preference actions
      setUserPreferences: (preferences) => set({ userPreferences: preferences }),
      updateUserPreferences: (updates) => {
        const state = get();
        if (state.userPreferences) {
          const oldCurrency = state.userPreferences.currency;
          const newPreferences = { ...state.userPreferences, ...updates };
          
          set({ userPreferences: newPreferences });
          
          // Emit currency change event if currency was updated
          if (updates.currency && updates.currency !== oldCurrency && typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('currencyChanged', { 
              detail: { 
                oldCurrency, 
                newCurrency: updates.currency 
              } 
            }));
          }
        }
      },

      // Migration actions
      migrateCurrencyData: () => {
        const state = get();
        const defaultCurrency = state.userPreferences?.currency || 'USD';
        
        // Migrate all financial data to ensure currency fields exist
        const migratedTransactions = migrateTransactionCurrency(state.transactions, defaultCurrency);
        const migratedSavingsGoals = migrateSavingsGoalCurrency(state.savingsGoals, defaultCurrency);
        const migratedSavingsEntries = migrateSavingsEntryCurrency(state.savingsEntries, defaultCurrency);
        const migratedGroupGoals = migrateGroupGoalCurrency(state.groupGoals, defaultCurrency);
        const migratedGroupContributions = migrateGroupContributionCurrency(state.groupContributions, defaultCurrency);
        const migratedBudgetCategories = migrateBudgetCategoryCurrency(state.budgetCategories, defaultCurrency);

        // Update state with migrated data
        set({
          transactions: migratedTransactions,
          savingsGoals: migratedSavingsGoals,
          savingsEntries: migratedSavingsEntries,
          groupGoals: migratedGroupGoals,
          groupContributions: migratedGroupContributions,
          budgetCategories: migratedBudgetCategories,
          migrationVersion: 1 // Update migration version to indicate migration completed
        });

        console.log('Currency data migration completed successfully');
      },

      // Transaction actions
      addTransaction: (transactionData) => {
        const transaction: Transaction = {
          ...transactionData,
          id: generateId(),
          userId: 'demo-user',
          createdAt: new Date(),
          // Ensure originalAmount is set for new transactions
          originalAmount: transactionData.originalAmount ?? transactionData.amount
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
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // Handle migration from version 1 to version 2 (currency data migration)
        if (version < 2) {
          const state = persistedState as FinancialState;
          const defaultCurrency = state.userPreferences?.currency || 'USD';
          
          // Migrate all financial data to ensure currency fields exist
          const migratedTransactions = migrateTransactionCurrency(state.transactions || [], defaultCurrency);
          const migratedSavingsGoals = migrateSavingsGoalCurrency(state.savingsGoals || [], defaultCurrency);
          const migratedSavingsEntries = migrateSavingsEntryCurrency(state.savingsEntries || [], defaultCurrency);
          const migratedGroupGoals = migrateGroupGoalCurrency(state.groupGoals || [], defaultCurrency);
          const migratedGroupContributions = migrateGroupContributionCurrency(state.groupContributions || [], defaultCurrency);
          const migratedBudgetCategories = migrateBudgetCategoryCurrency(state.budgetCategories || [], defaultCurrency);

          console.log('Migrating currency data from version', version, 'to version 2');
          
          return {
            ...state,
            transactions: migratedTransactions,
            savingsGoals: migratedSavingsGoals,
            savingsEntries: migratedSavingsEntries,
            groupGoals: migratedGroupGoals,
            groupContributions: migratedGroupContributions,
            budgetCategories: migratedBudgetCategories,
            migrationVersion: 2
          };
        }
        
        return persistedState;
      }
    }
  )
);