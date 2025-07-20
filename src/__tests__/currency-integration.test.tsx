import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { useFinancialStore } from '@/store/useFinancialStore';

// Mock the financial store
jest.mock('@/store/useFinancialStore');
const mockUseFinancialStore = useFinancialStore as jest.MockedFunction<typeof useFinancialStore>;

// Mock components that use currency
const MockTransactionHistory = () => {
  const { formatCurrency } = require('@/hooks/useCurrency').useCurrency();
  return <div data-testid="transaction-total">{formatCurrency(1000)}</div>;
};

const MockManualEntry = () => {
  const { currentCurrency } = require('@/hooks/useCurrency').useCurrency();
  return <div data-testid="current-currency">{currentCurrency}</div>;
};

describe('Currency Integration Tests', () => {
  const mockUpdateUserPreferences = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFinancialStore.mockReturnValue({
      userPreferences: { currency: 'USD', name: 'Test User', isSetupComplete: true },
      updateUserPreferences: mockUpdateUserPreferences,
      transactions: [],
      savingsGoals: [],
      savingsEntries: [],
    } as any);
  });

  const TestApp = () => (
    <CurrencyProvider>
      <div>
        <CurrencySelector />
        <MockTransactionHistory />
        <MockManualEntry />
      </div>
    </CurrencyProvider>
  );

  it('should display consistent currency across components', () => {
    render(<TestApp />);
    
    // Check that currency selector shows USD
    expect(screen.getByText('USD')).toBeInTheDocument();
    
    // Check that other components use USD
    expect(screen.getByTestId('current-currency')).toHaveTextContent('USD');
  });

  it('should update all components when currency changes', async () => {
    render(<TestApp />);
    
    // Initial state should be USD
    expect(screen.getByTestId('current-currency')).toHaveTextContent('USD');
    
    // Click currency selector
    const currencyButton = screen.getByRole('combobox');
    fireEvent.click(currencyButton);
    
    // Wait for dropdown to appear and select EUR
    await waitFor(() => {
      const eurOption = screen.getByText('Euro');
      fireEvent.click(eurOption);
    });
    
    // Verify that the store was updated
    expect(mockUpdateUserPreferences).toHaveBeenCalledWith({ currency: 'EUR' });
  });

  it('should handle currency conversion in transaction display', () => {
    render(<TestApp />);
    
    // Check that transaction total is formatted correctly
    const transactionTotal = screen.getByTestId('transaction-total');
    expect(transactionTotal).toHaveTextContent('1,000');
    expect(transactionTotal.textContent).toContain('$');
  });

  it('should propagate currency changes via events', async () => {
    const eventListener = jest.fn();
    window.addEventListener('currencyChanged', eventListener);
    
    render(<TestApp />);
    
    // Trigger currency change
    const currencyButton = screen.getByRole('combobox');
    fireEvent.click(currencyButton);
    
    await waitFor(() => {
      const eurOption = screen.getByText('Euro');
      fireEvent.click(eurOption);
    });
    
    // Verify event was dispatched
    expect(eventListener).toHaveBeenCalled();
    
    window.removeEventListener('currencyChanged', eventListener);
  });

  it('should handle loading states during currency changes', async () => {
    // Mock a slow update
    mockUpdateUserPreferences.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<TestApp />);
    
    const currencyButton = screen.getByRole('combobox');
    fireEvent.click(currencyButton);
    
    await waitFor(() => {
      const eurOption = screen.getByText('Euro');
      fireEvent.click(eurOption);
    });
    
    // Should show loading state (spinner)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  it('should display error messages when currency operations fail', async () => {
    mockUpdateUserPreferences.mockImplementation(() => {
      throw new Error('Network error');
    });
    
    render(<TestApp />);
    
    const currencyButton = screen.getByRole('combobox');
    fireEvent.click(currencyButton);
    
    await waitFor(() => {
      const eurOption = screen.getByText('Euro');
      fireEvent.click(eurOption);
    });
    
    // Should display error message
    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });

  it('should maintain currency consistency after page refresh', () => {
    // Simulate different user preferences from store
    mockUseFinancialStore.mockReturnValue({
      userPreferences: { currency: 'EUR', name: 'Test User', isSetupComplete: true },
      updateUserPreferences: mockUpdateUserPreferences,
      transactions: [],
      savingsGoals: [],
      savingsEntries: [],
    } as any);
    
    render(<TestApp />);
    
    // Should show EUR consistently
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByTestId('current-currency')).toHaveTextContent('EUR');
  });

  it('should handle multiple rapid currency changes', async () => {
    render(<TestApp />);
    
    const currencyButton = screen.getByRole('combobox');
    
    // Rapidly change currencies
    fireEvent.click(currencyButton);
    await waitFor(() => fireEvent.click(screen.getByText('Euro')));
    
    fireEvent.click(currencyButton);
    await waitFor(() => fireEvent.click(screen.getByText('British Pound')));
    
    fireEvent.click(currencyButton);
    await waitFor(() => fireEvent.click(screen.getByText('US Dollar')));
    
    // Should handle all changes gracefully
    expect(mockUpdateUserPreferences).toHaveBeenCalledTimes(3);
  });

  it('should search currencies correctly', async () => {
    render(<TestApp />);
    
    const currencyButton = screen.getByRole('combobox');
    fireEvent.click(currencyButton);
    
    // Search for Ghana
    const searchInput = screen.getByPlaceholderText('Search currencies...');
    fireEvent.change(searchInput, { target: { value: 'Ghana' } });
    
    await waitFor(() => {
      expect(screen.getByText('Ghanaian Cedi')).toBeInTheDocument();
      expect(screen.queryByText('US Dollar')).not.toBeInTheDocument();
    });
  });

  it('should show no results message for invalid search', async () => {
    render(<TestApp />);
    
    const currencyButton = screen.getByRole('combobox');
    fireEvent.click(currencyButton);
    
    // Search for non-existent currency
    const searchInput = screen.getByPlaceholderText('Search currencies...');
    fireEvent.change(searchInput, { target: { value: 'InvalidCurrency' } });
    
    await waitFor(() => {
      expect(screen.getByText(/No currencies found matching/)).toBeInTheDocument();
    });
  });
});