import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CurrencyProvider, useCurrency } from '../CurrencyContext';
import { useFinancialStore } from '@/store/useFinancialStore';

// Mock the financial store
jest.mock('@/store/useFinancialStore');
const mockUseFinancialStore = useFinancialStore as jest.MockedFunction<typeof useFinancialStore>;

// Mock window.dispatchEvent
const mockDispatchEvent = jest.fn();
Object.defineProperty(window, 'dispatchEvent', { value: mockDispatchEvent });

describe('CurrencyContext', () => {
  const mockUpdateUserPreferences = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFinancialStore.mockReturnValue({
      userPreferences: { currency: 'USD', name: 'Test User', isSetupComplete: true },
      updateUserPreferences: mockUpdateUserPreferences,
    } as any);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CurrencyProvider>{children}</CurrencyProvider>
  );

  describe('useCurrency hook', () => {
    it('should provide current currency from user preferences', () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      expect(result.current.currentCurrency).toBe('USD');
    });

    it('should default to USD when no user preferences exist', () => {
      mockUseFinancialStore.mockReturnValue({
        userPreferences: null,
        updateUserPreferences: mockUpdateUserPreferences,
      } as any);

      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      expect(result.current.currentCurrency).toBe('USD');
    });

    it('should format currency correctly', () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      const formatted = result.current.formatAmount(100);
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('100');
    });

    it('should convert currency correctly', () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      // Same currency should return same amount
      const converted = result.current.convertAmount(100, 'USD');
      expect(converted).toBe(100);
    });

    it('should provide currency symbol', () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      const symbol = result.current.getCurrencySymbol();
      expect(symbol).toBe('$');
    });

    it('should handle currency changes', async () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      await act(async () => {
        await result.current.setCurrency('EUR');
      });

      expect(mockUpdateUserPreferences).toHaveBeenCalledWith({ currency: 'EUR' });
    });

    it('should dispatch currency change events', async () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      await act(async () => {
        await result.current.setCurrency('EUR');
      });

      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'currencyChanged',
          detail: {
            oldCurrency: 'USD',
            newCurrency: 'EUR'
          }
        })
      );
    });

    it('should handle errors during currency change', async () => {
      mockUpdateUserPreferences.mockImplementation(() => {
        throw new Error('Update failed');
      });

      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      await act(async () => {
        await result.current.setCurrency('EUR');
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toContain('Update failed');
    });

    it('should clear errors', async () => {
      mockUpdateUserPreferences.mockImplementation(() => {
        throw new Error('Update failed');
      });

      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      // Trigger error
      await act(async () => {
        await result.current.setCurrency('EUR');
      });

      expect(result.current.error).toBeTruthy();

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should handle loading states', async () => {
      let resolvePromise: () => void;
      const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      mockUpdateUserPreferences.mockImplementation(() => promise);

      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      // Start currency change
      act(() => {
        result.current.setCurrency('EUR');
      });

      // Should be loading
      expect(result.current.isLoading).toBe(true);

      // Resolve the promise
      await act(async () => {
        resolvePromise!();
        await promise;
      });

      // Should no longer be loading
      expect(result.current.isLoading).toBe(false);
    });

    it('should validate currency input', async () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      await act(async () => {
        await result.current.setCurrency('' as any);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toContain('Invalid currency');
    });

    it('should maintain referential stability with memoization', () => {
      const { result, rerender } = renderHook(() => useCurrency(), { wrapper });
      
      const firstRender = result.current;
      
      rerender();
      
      const secondRender = result.current;
      
      // Functions should be memoized and maintain referential equality
      expect(firstRender.formatAmount).toBe(secondRender.formatAmount);
      expect(firstRender.convertAmount).toBe(secondRender.convertAmount);
      expect(firstRender.setCurrency).toBe(secondRender.setCurrency);
      expect(firstRender.getCurrencySymbol).toBe(secondRender.getCurrencySymbol);
    });

    it('should handle conversion errors gracefully', () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      // Test with potentially problematic conversion
      const converted = result.current.convertAmount(100, 'INVALID' as any);
      expect(typeof converted).toBe('number');
      expect(converted).toBe(100); // Should fallback to original amount
    });

    it('should handle formatting errors gracefully', () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      // Test with potentially problematic formatting
      const formatted = result.current.formatAmount(100, 'INVALID' as any);
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('100');
    });
  });

  describe('CurrencyProvider', () => {
    it('should throw error when useCurrency is used outside provider', () => {
      expect(() => {
        renderHook(() => useCurrency());
      }).toThrow('useCurrency must be used within a CurrencyProvider');
    });

    it('should provide context to children', () => {
      const { result } = renderHook(() => useCurrency(), { wrapper });
      
      expect(result.current).toBeDefined();
      expect(typeof result.current.currentCurrency).toBe('string');
      expect(typeof result.current.setCurrency).toBe('function');
      expect(typeof result.current.convertAmount).toBe('function');
      expect(typeof result.current.formatAmount).toBe('function');
      expect(typeof result.current.getCurrencySymbol).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.clearError).toBe('function');
    });
  });
});