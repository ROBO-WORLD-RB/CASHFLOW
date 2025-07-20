import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyError } from '../currency-error';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { useFinancialStore } from '@/store/useFinancialStore';

// Mock the financial store
jest.mock('@/store/useFinancialStore');
const mockUseFinancialStore = useFinancialStore as jest.MockedFunction<typeof useFinancialStore>;

// Mock the currency context to simulate error states
jest.mock('@/hooks/useCurrency', () => ({
  useCurrency: jest.fn()
}));

const mockUseCurrency = require('@/hooks/useCurrency').useCurrency as jest.MockedFunction<any>;

describe('CurrencyError Component', () => {
  const mockClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFinancialStore.mockReturnValue({
      userPreferences: { currency: 'USD', name: 'Test User', isSetupComplete: true },
      updateUserPreferences: jest.fn(),
    } as any);
  });

  it('should not render when there is no error', () => {
    mockUseCurrency.mockReturnValue({
      error: null,
      clearError: mockClearError
    });

    render(<CurrencyError />);
    
    expect(screen.queryByText('Currency Error')).not.toBeInTheDocument();
  });

  it('should render error message when error exists', () => {
    mockUseCurrency.mockReturnValue({
      error: 'Failed to convert currency',
      clearError: mockClearError
    });

    render(<CurrencyError />);
    
    expect(screen.getByText('Currency Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to convert currency')).toBeInTheDocument();
  });

  it('should display error icon', () => {
    mockUseCurrency.mockReturnValue({
      error: 'Test error message',
      clearError: mockClearError
    });

    render(<CurrencyError />);
    
    // Check for alert circle icon (by role or test id)
    const errorIcon = screen.getByRole('img', { hidden: true }) || 
                     document.querySelector('[data-lucide="alert-circle"]');
    expect(errorIcon).toBeInTheDocument();
  });

  it('should call clearError when close button is clicked', () => {
    mockUseCurrency.mockReturnValue({
      error: 'Test error message',
      clearError: mockClearError
    });

    render(<CurrencyError />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockClearError).toHaveBeenCalledTimes(1);
  });

  it('should have proper styling for error state', () => {
    mockUseCurrency.mockReturnValue({
      error: 'Test error message',
      clearError: mockClearError
    });

    render(<CurrencyError />);
    
    const errorContainer = screen.getByText('Currency Error').closest('div');
    expect(errorContainer).toHaveClass('bg-red-50', 'border-red-200');
  });

  it('should display different error messages', () => {
    const errorMessages = [
      'Network connection failed',
      'Invalid currency code',
      'Conversion rate not available',
      'Server timeout error'
    ];

    errorMessages.forEach(errorMessage => {
      mockUseCurrency.mockReturnValue({
        error: errorMessage,
        clearError: mockClearError
      });

      const { rerender } = render(<CurrencyError />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should be accessible', () => {
    mockUseCurrency.mockReturnValue({
      error: 'Accessibility test error',
      clearError: mockClearError
    });

    render(<CurrencyError />);
    
    // Check for proper heading structure
    expect(screen.getByText('Currency Error')).toBeInTheDocument();
    
    // Check for close button accessibility
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('should handle long error messages', () => {
    const longError = 'This is a very long error message that should still be displayed properly without breaking the layout or causing any visual issues in the error component';
    
    mockUseCurrency.mockReturnValue({
      error: longError,
      clearError: mockClearError
    });

    render(<CurrencyError />);
    
    expect(screen.getByText(longError)).toBeInTheDocument();
  });

  it('should handle HTML entities in error messages', () => {
    mockUseCurrency.mockReturnValue({
      error: 'Error with special characters: <>&"\'',
      clearError: mockClearError
    });

    render(<CurrencyError />);
    
    expect(screen.getByText('Error with special characters: <>&"\'')).toBeInTheDocument();
  });

  it('should maintain focus management', () => {
    mockUseCurrency.mockReturnValue({
      error: 'Focus test error',
      clearError: mockClearError
    });

    render(<CurrencyError />);
    
    const closeButton = screen.getByRole('button');
    closeButton.focus();
    
    expect(document.activeElement).toBe(closeButton);
    
    fireEvent.click(closeButton);
    
    expect(mockClearError).toHaveBeenCalled();
  });
});