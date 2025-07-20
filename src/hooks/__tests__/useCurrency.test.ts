import { renderHook, act } from '@testing-library/react';
import { useCurrency } from '../useCurrency';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { useFinancialStore } from '@/store/useFinancialStore';

// Mock the financial store
jest.mock('@/store/useFinancialStore');

const mockUseFinancialStore = useFinancialStore as jest.MockedFunction<typeof useFinancialStore>;

// Wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CurrencyProvider>{children}</CurrencyProvider>
);

describe('useCurrency', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock the financial store
    mockUseFinancialStore.mockReturnValue({
      userPreferences: { currency: 'USD', name: 'Test User', isSetupComplete: true },
      updateUserPreferences: jest.fn(),
      // Add other required properties as needed
    } as any);
  });

  it('should provide current currency from user preferences', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });
    
    expect(result.current.currentCurrency).toBe('USD');
  });

  it('should format currency correctly', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });
    
    const formatted = result.current.formatCurrency(100);
    expect(formatted).toContain('100');
    expect(formatted).toContain('$'); // USD symbol
  });

  it('should convert currency correctly', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });
    
    // Same currency should return same amount
    const converted = result.current.convertCurrency(100, 'USD');
    expect(converted).toBe(100);
  });

  it('should provide currency symbol', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });
    
    const symbol = result.current.getCurrencySymbol();
    expect(symbol).toBe('$'); // USD symbol
  });

  it('should handle currency changes', () => {
    const mockUpdatePreferences = jest.fn();
    mockUseFinancialStore.mockReturnValue({
      userPreferences: { currency: 'USD', name: 'Test User', isSetupComplete: true },
      updateUserPreferences: mockUpdatePreferences,
    } as any);

    const { result } = renderHook(() => useCurrency(), { wrapper });
    
    act(() => {
      result.current.setCurrency('EUR');
    });

    expect(mockUpdatePreferences).toHaveBeenCalledWith({ currency: 'EUR' });
  });

  it('should maintain referential stability with memoization', () => {
    const { result, rerender } = renderHook(() => useCurrency(), { wrapper });
    
    const firstRender = result.current;
    
    rerender();
    
    const secondRender = result.current;
    
    // Functions should be memoized and maintain referential equality
    expect(firstRender.formatCurrency).toBe(secondRender.formatCurrency);
    expect(firstRender.convertCurrency).toBe(secondRender.convertCurrency);
    expect(firstRender.setCurrency).toBe(secondRender.setCurrency);
    expect(firstRender.getCurrencySymbol).toBe(secondRender.getCurrencySymbol);
  });
});