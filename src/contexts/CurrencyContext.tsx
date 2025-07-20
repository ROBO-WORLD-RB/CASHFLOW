'use client';

import React, { createContext, useContext, useCallback, useMemo, ReactNode } from 'react';
import { SupportedCurrency } from '@/types';
import { convertCurrency, formatCurrency, getCurrencySymbol } from '@/lib/currencyUtils';
import { useFinancialStore } from '@/store/useFinancialStore';

interface CurrencyContextType {
  currentCurrency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  convertAmount: (amount: number, fromCurrency?: SupportedCurrency) => number;
  formatAmount: (amount: number, fromCurrency?: SupportedCurrency) => string;
  getCurrencySymbol: () => string;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const { userPreferences, updateUserPreferences } = useFinancialStore();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Default to USD if no user preferences exist yet
  const currentCurrency = userPreferences?.currency || 'USD';
  
  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Currency change handler with notification system and error handling
  const setCurrency = useCallback(async (currency: SupportedCurrency) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate currency is supported
      if (!currency || typeof currency !== 'string') {
        throw new Error('Invalid currency provided');
      }
      
      updateUserPreferences({ currency });
      
      // Trigger custom event for currency change notifications
      window.dispatchEvent(new CustomEvent('currencyChanged', { 
        detail: { 
          oldCurrency: currentCurrency, 
          newCurrency: currency 
        } 
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change currency';
      setError(errorMessage);
      console.error('Currency change error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCurrency, updateUserPreferences]);

  // Convert amount from source currency to current user currency
  const convertAmount = useCallback((amount: number, fromCurrency?: SupportedCurrency): number => {
    try {
      const sourceCurrency = fromCurrency || currentCurrency;
      if (sourceCurrency === currentCurrency) {
        return amount;
      }
      return convertCurrency(amount, sourceCurrency, currentCurrency);
    } catch (err) {
      console.warn('Currency conversion failed, returning original amount:', err);
      return amount; // Fallback to original amount
    }
  }, [currentCurrency]);

  // Format amount in current user currency with proper conversion
  const formatAmount = useCallback((amount: number, fromCurrency?: SupportedCurrency): string => {
    try {
      const convertedAmount = convertAmount(amount, fromCurrency);
      return formatCurrency(convertedAmount, currentCurrency);
    } catch (err) {
      console.warn('Currency formatting failed, using fallback:', err);
      // Fallback: show original amount with source currency if available
      const fallbackCurrency = fromCurrency || currentCurrency;
      const symbol = getCurrencySymbol(fallbackCurrency);
      return `${symbol}${amount.toFixed(2)}`;
    }
  }, [convertAmount, currentCurrency]);

  // Get current currency symbol
  const getCurrentCurrencySymbol = useCallback((): string => {
    return getCurrencySymbol(currentCurrency);
  }, [currentCurrency]);

  // Context value with memoization for performance
  const contextValue = useMemo<CurrencyContextType>(() => ({
    currentCurrency,
    setCurrency,
    convertAmount,
    formatAmount,
    getCurrencySymbol: getCurrentCurrencySymbol,
    isLoading,
    error,
    clearError
  }), [currentCurrency, setCurrency, convertAmount, formatAmount, getCurrentCurrencySymbol, isLoading, error, clearError]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Custom hook to use currency context
export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Hook for components to listen to currency changes
export function useCurrencyChangeListener(callback: (oldCurrency: SupportedCurrency, newCurrency: SupportedCurrency) => void) {
  React.useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      const { oldCurrency, newCurrency } = event.detail;
      callback(oldCurrency, newCurrency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, [callback]);
}