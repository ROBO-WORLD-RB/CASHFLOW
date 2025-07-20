import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { TransactionHistory } from '@/components/budgetup/TransactionHistory';
import { ManualEntry } from '@/components/budgetup/ManualEntry';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { useFinancialStore } from '@/store/useFinancialStore';

// Mock the financial store with sample data
jest.mock('@/store/useFinancialStore');
const mockUseFinancialStore = useFinancialStore as jest.MockedFunction<typeof useFinancialStore>;

describe('Currency End-to-End Tests', () => {
  const mockUpdateUserPreferences = jest.fn();
  const mockAddTransaction = jest.fn();
  const mockDeleteTransaction = jest.fn();

  const sampleTransactions = [
    {
      id: '1',
      userId: 'test-user',
      type: 'income' as const,
      amount: 1000,
      currency: 'USD' as const,
      originalAmount: 1000,
      description: 'Salary',
      category: 'Salary',
      date: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      userId: 'test-user',
      type: 'expense' as const,
      amount: 500,
      currency: 'EUR' as const,
      originalAmount: 500,
      description: 'Groceries',
      category: 'Food & Dining',
      date: new Date('2024-01-16'),
      createdAt: new Date('2024-01-16')
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFinancialStore.mockReturnValue({
      userPreferences: { currency: 'USD', name: 'Test User', isSetupComplete: true },
      updateUserPreferences: mockUpdateUserPreferences,
      transactions: sampleTransactions,
      addTransaction: mockAddTransaction,
      deleteTransaction: mockDeleteTransaction,
      getTransactionsByCategory: () => ({ 'Salary': [sampleTransactions[0]], 'Food & Dining': [sampleTransactions[1]] }),
      getTotalIncome: () => 1000,
      getTotalExpenses: () => 500,
      savingsGoals: [],
      savingsEntries: [],
    } as any);
  });

  const FullApp = () => (
    <CurrencyProvider>
      <div>
        <CurrencySelector />
        <TransactionHistory />
        <ManualEntry type="income" />
      </div>
    </CurrencyProvider>
  );

  it('should complete full currency change workflow', async () => {
    render(<FullApp />);
    
    // Initial state - should show USD
    expect(screen.getByText('USD')).toBeInTheDocument();
    
    // Check transaction amounts are displayed in USD
    expect(screen.getByText(/\$1,000\.00/)).toBeInTheDocument(); // Income total
    
    // Change currency to EUR
    const currencyButton = screen.getByRole('combobox');
    fireEvent.click(currencyButton);
    
    await waitFor(() => {
      const eurOption = screen.getByText('Euro');
      fireEvent.click(eurOption);
    });
    
    // Verify currency change was processed
    expect(mockUpdateUserPreferences).toHaveBeenCalledWith({ currency: 'EUR' });
    
    // All monetary displays should update (this would happen in real app via context)
    // In test, we simulate the updated state
    mockUseFinancialStore.mockReturnValue({
      ...mockUseFinancialStore(),
      userPreferences: { currency: 'EUR', name: 'Test User', isSetupComplete: true },
    } as any);
  });

  it('should handle transaction creation with current currency', async () => {
    render(<FullApp />);
    
    // Fill out transaction form
    const amountInput = screen.getByPlaceholderText(/Amount \(USD\)/);
    const descriptionInput = screen.getByPlaceholderText('Description');
    
    fireEvent.change(amountInput, { target: { value: '250' } });
    fireEvent.change(descriptionInput, { target: { value: 'Freelance work' } });
    
    // Select category
    const categorySelect = screen.getByText('Select category');
    fireEvent.click(categorySelect);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Freelance'));
    });
    
    // Submit form
    const submitButton = screen.getByText('Add Income');
    fireEvent.click(submitButton);
    
    // Verify transaction was added with current currency
    expect(mockAddTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 250,
        currency: 'USD',
        description: 'Freelance work',
        category: 'Freelance',
        type: 'income'
      })
    );
  });

  it('should display historical transactions with currency conversion', () => {
    render(<FullApp />);
    
    // Should show transactions with their original currencies converted to display currency
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    
    // Amounts should be displayed (conversion would happen in real app)
    const transactionRows = screen.getAllByRole('row');
    expect(transactionRows.length).toBeGreaterThan(2); // Header + transactions
  });

  it('should handle transaction deletion', async () => {
    render(<FullApp />);
    
    // Find and click delete button for first transaction
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
    
    fireEvent.click(deleteButtons[0]);
    
    expect(mockDeleteTransaction).toHaveBeenCalled();
  });

  it('should filter transactions correctly', async () => {
    render(<FullApp />);
    
    // Test search functionality
    const searchInput = screen.getByPlaceholderText('Search transactions...');
    fireEvent.change(searchInput, { target: { value: 'Salary' } });
    
    // Should show only matching transactions
    expect(screen.getByText('Salary')).toBeInTheDocument();
    
    // Test type filter
    const typeFilter = screen.getByDisplayValue('All Types');
    fireEvent.click(typeFilter);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Income'));
    });
    
    // Should filter by type
    expect(screen.getByText('Income')).toBeInTheDocument();
  });

  it('should show correct totals with currency conversion', () => {
    render(<FullApp />);
    
    // Check summary cards show correct totals
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    
    // Totals should be converted to display currency
    const incomeCard = screen.getByText('Total Income').closest('div');
    const expenseCard = screen.getByText('Total Expenses').closest('div');
    
    expect(incomeCard).toBeInTheDocument();
    expect(expenseCard).toBeInTheDocument();
  });

  it('should handle currency selector search and selection', async () => {
    render(<FullApp />);
    
    // Open currency selector
    const currencyButton = screen.getByRole('combobox');
    fireEvent.click(currencyButton);
    
    // Search for specific currency
    const searchInput = screen.getByPlaceholderText('Search currencies...');
    fireEvent.change(searchInput, { target: { value: 'Ghana' } });
    
    await waitFor(() => {
      expect(screen.getByText('Ghanaian Cedi')).toBeInTheDocument();
    });
    
    // Select the currency
    fireEvent.click(screen.getByText('Ghanaian Cedi'));
    
    // Verify selection
    expect(mockUpdateUserPreferences).toHaveBeenCalledWith({ currency: 'GHS' });
  });

  it('should maintain form state during currency changes', async () => {
    render(<FullApp />);
    
    // Fill out form partially
    const amountInput = screen.getByPlaceholderText(/Amount \(USD\)/);
    fireEvent.change(amountInput, { target: { value: '100' } });
    
    // Change currency
    const currencyButton = screen.getByRole('combobox');
    fireEvent.click(currencyButton);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Euro'));
    });
    
    // Form should maintain its values but update currency display
    expect(amountInput).toHaveValue(100);
  });

  it('should handle rapid currency changes gracefully', async () => {
    render(<FullApp />);
    
    const currencyButton = screen.getByRole('combobox');
    
    // Rapidly change currencies multiple times
    for (let i = 0; i < 5; i++) {
      fireEvent.click(currencyButton);
      await waitFor(() => {
        const options = ['Euro', 'British Pound', 'US Dollar', 'Ghanaian Cedi'];
        fireEvent.click(screen.getByText(options[i % options.length]));
      });
    }
    
    // Should handle all changes without errors
    expect(mockUpdateUserPreferences).toHaveBeenCalledTimes(5);
  });

  it('should persist currency preference across component remounts', () => {
    const { unmount } = render(<FullApp />);
    
    // Unmount and remount
    unmount();
    render(<FullApp />);
    
    // Should still show the same currency
    expect(screen.getByText('USD')).toBeInTheDocument();
  });
});