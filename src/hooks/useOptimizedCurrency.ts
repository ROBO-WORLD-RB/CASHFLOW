'use client';

import { useMemo, useCallback, useRef } from 'react';
import { useCurrency } from './useCurrency';
import { SupportedCurrency } from '@/types';
import { preloadCurrencyConversions } from '@/lib/currencyCache';

interface UseOptimizedCurrencyOptions {
  preloadCurrencies?: SupportedCurrency[];
  enablePreloading?: boolean;
  memoizationKey?: string;
}

interface OptimizedCurrencyOperations {
  formatCurrency: (amount: number, sourceCurrency?: SupportedCurrency) => string;
  convertCurrency: (amount: number, sourceCurrency?: SupportedCurrency) => number;
  formatCurrencyMemo: (amount: number, sourceCurrency?: SupportedCurrency, key?: string) => string;
  convertCurrencyMemo: (amount: number, sourceCurrency?: SupportedCurrency, key?: string) => number;
  batchFormatCurrency: (amounts: Array<{ amount: number; currency?: SupportedCurrency }>) => string[];
  batchConvertCurrency: (amounts: Array<{ amount: number; currency?: SupportedCurrency }>) => number[];
  currentCurrency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Optimized currency hook with advanced memoization and batch operations
 * Provides performance optimizations for components that handle many currency operations
 */
export function useOptimizedCurrency(options: UseOptimizedCurrencyOptions = {}): OptimizedCurrencyOperations {
  const {
    preloadCurrencies = ['USD', 'EUR', 'GBP', 'GHS', 'NGN'],
    enablePreloading = true,
    memoizationKey = 'default'
  } = options;

  const {
    currentCurrency,
    formatCurrency: baseFormatCurrency,
    convertCurrency: baseConvertCurrency,
    setCurrency,
    isLoading,
    error,
    clearError
  } = useCurrency();

  const preloadRef = useRef(false);
  const memoCache = useRef(new Map<string, any>());

  // Preload common currency conversions on first render
  useMemo(() => {
    if (enablePreloading && !preloadRef.current) {
      preloadRef.current = true;
      preloadCurrencyConversions(currentCurrency, preloadCurrencies);
    }
  }, [currentCurrency, preloadCurrencies, enablePreloading]);

  // Memoized format currency with stable reference
  const formatCurrency = useCallback((amount: number, sourceCurrency?: SupportedCurrency): string => {
    return baseFormatCurrency(amount, sourceCurrency);
  }, [baseFormatCurrency]);

  // Memoized convert currency with stable reference
  const convertCurrency = useCallback((amount: number, sourceCurrency?: SupportedCurrency): number => {
    return baseConvertCurrency(amount, sourceCurrency);
  }, [baseConvertCurrency]);

  // Advanced memoization with custom keys
  const formatCurrencyMemo = useCallback((
    amount: number, 
    sourceCurrency?: SupportedCurrency, 
    key?: string
  ): string => {
    const cacheKey = `format-${memoizationKey}-${key || 'default'}-${amount}-${sourceCurrency || currentCurrency}`;
    
    if (memoCache.current.has(cacheKey)) {
      return memoCache.current.get(cacheKey);
    }
    
    const result = baseFormatCurrency(amount, sourceCurrency);
    memoCache.current.set(cacheKey, result);
    
    // Prevent memory leaks by limiting cache size
    if (memoCache.current.size > 1000) {
      const firstKey = memoCache.current.keys().next().value;
      memoCache.current.delete(firstKey);
    }
    
    return result;
  }, [baseFormatCurrency, currentCurrency, memoizationKey]);

  // Advanced memoization for conversions
  const convertCurrencyMemo = useCallback((
    amount: number, 
    sourceCurrency?: SupportedCurrency, 
    key?: string
  ): number => {
    const cacheKey = `convert-${memoizationKey}-${key || 'default'}-${amount}-${sourceCurrency || currentCurrency}`;
    
    if (memoCache.current.has(cacheKey)) {
      return memoCache.current.get(cacheKey);
    }
    
    const result = baseConvertCurrency(amount, sourceCurrency);
    memoCache.current.set(cacheKey, result);
    
    // Prevent memory leaks by limiting cache size
    if (memoCache.current.size > 1000) {
      const firstKey = memoCache.current.keys().next().value;
      memoCache.current.delete(firstKey);
    }
    
    return result;
  }, [baseConvertCurrency, currentCurrency, memoizationKey]);

  // Batch operations for better performance with multiple values
  const batchFormatCurrency = useCallback((
    amounts: Array<{ amount: number; currency?: SupportedCurrency }>
  ): string[] => {
    return amounts.map(({ amount, currency }) => baseFormatCurrency(amount, currency));
  }, [baseFormatCurrency]);

  const batchConvertCurrency = useCallback((
    amounts: Array<{ amount: number; currency?: SupportedCurrency }>
  ): number[] => {
    return amounts.map(({ amount, currency }) => baseConvertCurrency(amount, currency));
  }, [baseConvertCurrency]);

  // Clear memoization cache when currency changes
  useMemo(() => {
    memoCache.current.clear();
  }, [currentCurrency]);

  return {
    formatCurrency,
    convertCurrency,
    formatCurrencyMemo,
    convertCurrencyMemo,
    batchFormatCurrency,
    batchConvertCurrency,
    currentCurrency,
    setCurrency,
    isLoading,
    error,
    clearError
  };
}

/**
 * Hook for components that need to display many currency values efficiently
 * Optimized for lists, tables, and charts with many monetary values
 */
export function useBulkCurrencyOperations() {
  const { batchFormatCurrency, batchConvertCurrency, currentCurrency } = useOptimizedCurrency({
    enablePreloading: true,
    preloadCurrencies: ['USD', 'EUR', 'GBP', 'GHS', 'NGN', 'INR', 'BRL', 'MXN']
  });

  const formatCurrencyList = useCallback((
    transactions: Array<{ amount: number; currency: SupportedCurrency }>
  ) => {
    return batchFormatCurrency(transactions);
  }, [batchFormatCurrency]);

  const convertCurrencyList = useCallback((
    transactions: Array<{ amount: number; currency: SupportedCurrency }>
  ) => {
    return batchConvertCurrency(transactions);
  }, [batchConvertCurrency]);

  const calculateTotals = useCallback((
    transactions: Array<{ amount: number; currency: SupportedCurrency; type: 'income' | 'expense' }>
  ) => {
    const convertedAmounts = batchConvertCurrency(transactions);
    
    return transactions.reduce((totals, transaction, index) => {
      const convertedAmount = convertedAmounts[index];
      if (transaction.type === 'income') {
        totals.totalIncome += convertedAmount;
      } else {
        totals.totalExpenses += convertedAmount;
      }
      return totals;
    }, { totalIncome: 0, totalExpenses: 0 });
  }, [batchConvertCurrency]);

  return {
    formatCurrencyList,
    convertCurrencyList,
    calculateTotals,
    currentCurrency
  };
}

/**
 * Performance monitoring hook for currency operations
 * Useful for debugging and optimization
 */
export function useCurrencyPerformance() {
  const performanceRef = useRef({
    formatOperations: 0,
    convertOperations: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalTime: 0
  });

  const trackOperation = useCallback((operation: string, fn: () => any) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    performanceRef.current.totalTime += (end - start);
    
    if (operation === 'format') {
      performanceRef.current.formatOperations++;
    } else if (operation === 'convert') {
      performanceRef.current.convertOperations++;
    }
    
    return result;
  }, []);

  const getPerformanceStats = useCallback(() => {
    return { ...performanceRef.current };
  }, []);

  const resetPerformanceStats = useCallback(() => {
    performanceRef.current = {
      formatOperations: 0,
      convertOperations: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalTime: 0
    };
  }, []);

  return {
    trackOperation,
    getPerformanceStats,
    resetPerformanceStats
  };
}