import { 
  convertCurrency, 
  formatCurrency, 
  getCurrencySymbol, 
  getCurrencyName,
  WORLD_CURRENCIES,
  SUPPORTED_CURRENCIES 
} from '../currencyUtils';

describe('Currency Utilities', () => {
  describe('convertCurrency', () => {
    it('should return same amount for same currency', () => {
      const result = convertCurrency(100, 'USD', 'USD');
      expect(result).toBe(100);
    });

    it('should convert USD to EUR correctly', () => {
      const result = convertCurrency(100, 'USD', 'EUR');
      expect(result).toBe(85); // Based on exchange rate in currencyUtils
    });

    it('should convert EUR to USD correctly', () => {
      const result = convertCurrency(100, 'EUR', 'USD');
      expect(result).toBe(118); // Based on exchange rate in currencyUtils
    });

    it('should handle conversion via USD for unsupported pairs', () => {
      // Test conversion that might need to go through USD
      const result = convertCurrency(100, 'GHS', 'EUR');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    it('should return original amount when conversion fails', () => {
      // Mock a scenario where conversion might fail
      const result = convertCurrency(100, 'INVALID' as any, 'USD');
      expect(result).toBe(100); // Should fallback to original amount
    });

    it('should handle zero amounts', () => {
      const result = convertCurrency(0, 'USD', 'EUR');
      expect(result).toBe(0);
    });

    it('should handle negative amounts', () => {
      const result = convertCurrency(-100, 'USD', 'EUR');
      expect(result).toBe(-85);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      const result = formatCurrency(1234.56, 'USD');
      expect(result).toContain('1,234.56');
      expect(result).toContain('$');
    });

    it('should format EUR correctly', () => {
      const result = formatCurrency(1234.56, 'EUR');
      expect(result).toContain('1,234.56');
      expect(result).toContain('€');
    });

    it('should format GHS correctly', () => {
      const result = formatCurrency(1234.56, 'GHS');
      expect(result).toContain('1,234.56');
      expect(result).toContain('₵');
    });

    it('should handle zero amounts', () => {
      const result = formatCurrency(0, 'USD');
      expect(result).toContain('0.00');
    });

    it('should handle negative amounts', () => {
      const result = formatCurrency(-100, 'USD');
      expect(result).toContain('100');
      expect(result).toContain('-');
    });

    it('should fallback gracefully for unsupported currencies', () => {
      const result = formatCurrency(100, 'INVALID' as any);
      expect(typeof result).toBe('string');
      expect(result).toContain('100');
    });

    it('should respect decimal places', () => {
      const result = formatCurrency(100.1, 'USD');
      expect(result).toContain('100.10');
    });
  });

  describe('getCurrencySymbol', () => {
    it('should return correct symbol for USD', () => {
      const result = getCurrencySymbol('USD');
      expect(result).toBe('$');
    });

    it('should return correct symbol for EUR', () => {
      const result = getCurrencySymbol('EUR');
      expect(result).toBe('€');
    });

    it('should return correct symbol for GHS', () => {
      const result = getCurrencySymbol('GHS');
      expect(result).toBe('₵');
    });

    it('should return currency code for unknown currencies', () => {
      const result = getCurrencySymbol('UNKNOWN' as any);
      expect(result).toBe('UNKNOWN');
    });
  });

  describe('getCurrencyName', () => {
    it('should return correct name for USD', () => {
      const result = getCurrencyName('USD');
      expect(result).toBe('US Dollar');
    });

    it('should return correct name for EUR', () => {
      const result = getCurrencyName('EUR');
      expect(result).toBe('Euro');
    });

    it('should return correct name for GHS', () => {
      const result = getCurrencyName('GHS');
      expect(result).toBe('Ghanaian Cedi');
    });

    it('should return currency code for unknown currencies', () => {
      const result = getCurrencyName('UNKNOWN' as any);
      expect(result).toBe('UNKNOWN');
    });
  });

  describe('WORLD_CURRENCIES', () => {
    it('should contain expected currencies', () => {
      const codes = WORLD_CURRENCIES.map(c => c.code);
      expect(codes).toContain('USD');
      expect(codes).toContain('EUR');
      expect(codes).toContain('GBP');
      expect(codes).toContain('GHS');
      expect(codes).toContain('NGN');
    });

    it('should have required properties for each currency', () => {
      WORLD_CURRENCIES.forEach(currency => {
        expect(currency).toHaveProperty('code');
        expect(currency).toHaveProperty('name');
        expect(currency).toHaveProperty('symbol');
        expect(currency).toHaveProperty('country');
        expect(typeof currency.code).toBe('string');
        expect(typeof currency.name).toBe('string');
        expect(typeof currency.symbol).toBe('string');
        expect(typeof currency.country).toBe('string');
      });
    });
  });

  describe('SUPPORTED_CURRENCIES', () => {
    it('should be an array of currency codes', () => {
      expect(Array.isArray(SUPPORTED_CURRENCIES)).toBe(true);
      expect(SUPPORTED_CURRENCIES.length).toBeGreaterThan(0);
    });

    it('should contain only strings', () => {
      SUPPORTED_CURRENCIES.forEach(currency => {
        expect(typeof currency).toBe('string');
      });
    });

    it('should match WORLD_CURRENCIES length', () => {
      expect(SUPPORTED_CURRENCIES.length).toBe(WORLD_CURRENCIES.length);
    });
  });
});