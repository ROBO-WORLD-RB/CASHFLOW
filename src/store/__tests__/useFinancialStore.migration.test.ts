import { describe, it, expect, beforeEach } from 'vitest';
import { useFinancialStore } from '../useFinancialStore';
import { Transaction, SavingsGoal, SavingsEntry } from '@/types';

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Financial Store Currency Migration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should migrate transactions without currency field', () => {
    const store = useFinancialStore.getState();
    
    // Create a transaction without currency (simulating old data)
    const transactionWithoutCurrency = {
      id: '1',
      userId: 'test-user',
      type: 'income' as const,
      amount: 100,
      description: 'Test transaction',
      category: 'salary',
      date: new Date(),
      createdAt: new Date()
    } as Transaction;

    // Set up store with transaction missing currency
    useFinancialStore.setState({
      transactions: [transactionWithoutCurrency],
      userPreferences: { name: 'Test User', currency: 'EUR', isSetupComplete: true }
    });

    // Run migration
    store.migrateCurrencyData();

    // Check that currency was added
    const migratedTransactions = useFinancialStore.getState().transactions;
    expect(migratedTransactions[0].currency).toBe('EUR');
    expect(migratedTransactions[0].originalAmount).toBe(100);
  });

  it('should preserve existing currency data during migration', () => {
    const store = useFinancialStore.getState();
    
    // Create a transaction with currency (simulating newer data)
    const transactionWithCurrency: Transaction = {
      id: '1',
      userId: 'test-user',
      type: 'expense',
      amount: 50,
      currency: 'GBP',
      originalAmount: 50,
      description: 'Test expense',
      category: 'food',
      date: new Date(),
      createdAt: new Date()
    };

    // Set up store
    useFinancialStore.setState({
      transactions: [transactionWithCurrency],
      userPreferences: { name: 'Test User', currency: 'USD', isSetupComplete: true }
    });

    // Run migration
    store.migrateCurrencyData();

    // Check that existing currency was preserved
    const migratedTransactions = useFinancialStore.getState().transactions;
    expect(migratedTransactions[0].currency).toBe('GBP'); // Should remain GBP, not change to USD
    expect(migratedTransactions[0].originalAmount).toBe(50);
  });

  it('should set originalAmount for transactions missing it', () => {
    const store = useFinancialStore.getState();
    
    // Create a transaction with currency but without originalAmount
    const transactionWithoutOriginalAmount = {
      id: '1',
      userId: 'test-user',
      type: 'income' as const,
      amount: 200,
      currency: 'USD' as const,
      description: 'Test transaction',
      category: 'bonus',
      date: new Date(),
      createdAt: new Date()
    } as Transaction;

    // Set up store
    useFinancialStore.setState({
      transactions: [transactionWithoutOriginalAmount],
      userPreferences: { name: 'Test User', currency: 'USD', isSetupComplete: true }
    });

    // Run migration
    store.migrateCurrencyData();

    // Check that originalAmount was set
    const migratedTransactions = useFinancialStore.getState().transactions;
    expect(migratedTransactions[0].originalAmount).toBe(200);
  });

  it('should migrate savings goals without currency', () => {
    const store = useFinancialStore.getState();
    
    // Create a savings goal without currency
    const goalWithoutCurrency = {
      id: '1',
      userId: 'test-user',
      title: 'Test Goal',
      targetAmount: 1000,
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    } as SavingsGoal;

    // Set up store
    useFinancialStore.setState({
      savingsGoals: [goalWithoutCurrency],
      userPreferences: { name: 'Test User', currency: 'CAD', isSetupComplete: true }
    });

    // Run migration
    store.migrateCurrencyData();

    // Check that currency was added
    const migratedGoals = useFinancialStore.getState().savingsGoals;
    expect(migratedGoals[0].currency).toBe('CAD');
  });

  it('should use USD as default currency when no user preference exists', () => {
    const store = useFinancialStore.getState();
    
    // Create a transaction without currency and no user preferences
    const transactionWithoutCurrency = {
      id: '1',
      userId: 'test-user',
      type: 'expense' as const,
      amount: 75,
      description: 'Test transaction',
      category: 'transport',
      date: new Date(),
      createdAt: new Date()
    } as Transaction;

    // Set up store without user preferences
    useFinancialStore.setState({
      transactions: [transactionWithoutCurrency],
      userPreferences: null
    });

    // Run migration
    store.migrateCurrencyData();

    // Check that USD was used as default
    const migratedTransactions = useFinancialStore.getState().transactions;
    expect(migratedTransactions[0].currency).toBe('USD');
    expect(migratedTransactions[0].originalAmount).toBe(75);
  });

  it('should update migration version after successful migration', () => {
    const store = useFinancialStore.getState();
    
    // Set up store with initial migration version
    useFinancialStore.setState({
      migrationVersion: 0,
      userPreferences: { name: 'Test User', currency: 'EUR', isSetupComplete: true }
    });

    // Run migration
    store.migrateCurrencyData();

    // Check that migration version was updated
    const state = useFinancialStore.getState();
    expect(state.migrationVersion).toBe(1);
  });
});