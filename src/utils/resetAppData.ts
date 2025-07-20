/**
 * Utility functions to reset app data for testing purposes
 */

import { useFinancialStore } from '@/store/useFinancialStore';
import { clearCurrencyCache } from '@/lib/currencyCache';

/**
 * Reset all app data to initial state
 * This will clear all transactions, savings goals, user preferences, etc.
 */
export function resetAllAppData(): void {
  try {
    // Clear Zustand persisted store data
    localStorage.removeItem('budgetup-financial-store');
    
    // Clear any other localStorage keys that might be used
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('budgetup') || key.includes('cashflow'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear currency cache
    clearCurrencyCache();
    
    // Clear sessionStorage as well
    sessionStorage.clear();
    
    console.log('✅ All app data has been reset successfully');
    
    // Reload the page to reinitialize the app
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (error) {
    console.error('❌ Error resetting app data:', error);
  }
}

/**
 * Reset only financial data (keep user preferences)
 */
export function resetFinancialDataOnly(): void {
  try {
    const store = useFinancialStore.getState();
    
    // Reset only financial data, keep user preferences
    useFinancialStore.setState({
      transactions: [],
      savingsGoals: [],
      savingsEntries: [],
      groupGoals: [],
      groupContributions: [],
      budgetCategories: [],
      // Keep user preferences
      userPreferences: store.userPreferences,
      migrationVersion: store.migrationVersion
    });
    
    // Clear currency cache
    clearCurrencyCache();
    
    console.log('✅ Financial data has been reset (user preferences preserved)');
  } catch (error) {
    console.error('❌ Error resetting financial data:', error);
  }
}

/**
 * Reset only user preferences (keep financial data)
 */
export function resetUserPreferencesOnly(): void {
  try {
    useFinancialStore.setState({
      userPreferences: null
    });
    
    console.log('✅ User preferences have been reset');
  } catch (error) {
    console.error('❌ Error resetting user preferences:', error);
  }
}

/**
 * Add sample data for testing
 */
export function addSampleData(): void {
  try {
    const store = useFinancialStore.getState();
    
    // Add sample user preferences
    store.setUserPreferences({
      name: 'Test User',
      currency: 'USD',
      isSetupComplete: true
    });
    
    // Add sample transactions
    const sampleTransactions = [
      {
        type: 'income' as const,
        amount: 5000,
        currency: 'USD' as const,
        description: 'Monthly Salary',
        category: 'Salary',
        date: new Date('2024-01-15')
      },
      {
        type: 'expense' as const,
        amount: 1200,
        currency: 'USD' as const,
        description: 'Rent Payment',
        category: 'Housing & Rent',
        date: new Date('2024-01-01')
      },
      {
        type: 'expense' as const,
        amount: 300,
        currency: 'USD' as const,
        description: 'Groceries',
        category: 'Food & Dining',
        date: new Date('2024-01-10')
      },
      {
        type: 'income' as const,
        amount: 800,
        currency: 'EUR' as const,
        description: 'Freelance Work',
        category: 'Freelance',
        date: new Date('2024-01-20')
      }
    ];
    
    sampleTransactions.forEach(transaction => {
      store.addTransaction(transaction);
    });
    
    // Add sample savings goal
    store.addSavingsGoal({
      title: 'Emergency Fund',
      targetAmount: 10000,
      currency: 'USD',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true
    });
    
    // Add sample savings entries
    store.addSavingsEntry({
      amount: 500,
      currency: 'USD',
      description: 'Monthly savings',
      date: new Date('2024-01-15')
    });
    
    console.log('✅ Sample data has been added successfully');
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

/**
 * Get current data summary for debugging
 */
export function getDataSummary(): object {
  try {
    const store = useFinancialStore.getState();
    
    return {
      userPreferences: store.userPreferences,
      transactionCount: store.transactions.length,
      savingsGoalCount: store.savingsGoals.length,
      savingsEntryCount: store.savingsEntries.length,
      groupGoalCount: store.groupGoals.length,
      groupContributionCount: store.groupContributions.length,
      budgetCategoryCount: store.budgetCategories.length,
      migrationVersion: store.migrationVersion,
      totalIncome: store.getTotalIncome(),
      totalExpenses: store.getTotalExpenses(),
      availableBalance: store.getAvailableBalance(),
      totalSavings: store.getTotalSavings()
    };
  } catch (error) {
    console.error('❌ Error getting data summary:', error);
    return {};
  }
}