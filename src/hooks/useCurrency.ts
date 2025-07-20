'use client';

import { useCallback, useMemo } from 'react';
import { useCurrency as useCurrencyContext, useCurrencyChangeListener } from '@/contexts/CurrencyContext';
import { SupportedCurrency } from '@/types';

interface UseCurrencyReturn {
  currentCurrency: SupportedCurrency;
  formatCurrency: (amount: number, sourceCurrency?: SupportedCurrency) => string;
  convertCurrency: (amount: number, sourceCurrency?: SupportedCurrency) => number;
  setCurrency: (currency: SupportedCurrency) => void;
  getCurrencySymbol: () => string;
  isLoading: boolean;
}

/**
 * Enhanced currency hook that provides currency operations and automatic conversions
 * This hook automatically handles currency conversion and formatting based on user preferences
 */
export function useCurrency(): UseCurrencyReturn {
  const {
    currentCurrency,
    setCurrency,
    convertAmount,
    formatAmount,
    getCurrencySymbol,
    isLoading
  } = useCurrencyContext();

  // Memoized currency formatting function for performance optimization
  const formatCurrency = useCallback((amount: number, sourceCurrency?: SupportedCurrency): string => {
    return formatAmount(amount, sourceCurrency);
  }, [formatAmount]);

  // Memoized currency conversion function for performance optimization
  const convertCurrency = useCallback((amount: number, sourceCurrency?: SupportedCurrency): number => {
    return convertAmount(amount, sourceCurrency);
  }, [convertAmount]);

  // Return memoized object to prevent unnecessary re-renders
  return useMemo<UseCurrencyReturn>(() => ({
    currentCurrency,
    formatCurrency,
    convertCurrency,
    setCurrency,
    getCurrencySymbol,
    isLoading
  }), [currentCurrency, formatCurrency, convertCurrency, setCurrency, getCurrencySymbol, isLoading]);
}

/**
 * Hook for components that need to react to currency changes
 * Useful for components that need to perform actions when currency changes
 */
export function useCurrencyChangeEffect(
  callback: (oldCurrency: SupportedCurrency, newCurrency: SupportedCurrency) => void
) {
  useCurrencyChangeListener(callback);
}