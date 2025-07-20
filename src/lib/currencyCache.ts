import { SupportedCurrency } from './currencyUtils';

interface CachedConversion {
  fromCurrency: SupportedCurrency;
  toCurrency: SupportedCurrency;
  rate: number;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CachedFormat {
  amount: number;
  currency: SupportedCurrency;
  locale: string;
  formatted: string;
  timestamp: number;
  ttl: number;
}

class CurrencyCache {
  private conversionCache = new Map<string, CachedConversion>();
  private formatCache = new Map<string, CachedFormat>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 1000;
  private readonly CLEANUP_INTERVAL = 60 * 1000; // 1 minute

  constructor() {
    // Start periodic cleanup
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
    }
  }

  // Conversion rate caching
  getCachedConversion(fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency): number | null {
    const key = `${fromCurrency}-${toCurrency}`;
    const cached = this.conversionCache.get(key);
    
    if (!cached) return null;
    
    // Check if cache entry is still valid
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.conversionCache.delete(key);
      return null;
    }
    
    return cached.rate;
  }

  setCachedConversion(
    fromCurrency: SupportedCurrency, 
    toCurrency: SupportedCurrency, 
    rate: number,
    ttl: number = this.DEFAULT_TTL
  ): void {
    const key = `${fromCurrency}-${toCurrency}`;
    
    // Prevent cache from growing too large
    if (this.conversionCache.size >= this.MAX_CACHE_SIZE) {
      this.cleanupOldestEntries(this.conversionCache, Math.floor(this.MAX_CACHE_SIZE * 0.1));
    }
    
    this.conversionCache.set(key, {
      fromCurrency,
      toCurrency,
      rate,
      timestamp: Date.now(),
      ttl
    });
  }

  // Currency formatting caching
  getCachedFormat(amount: number, currency: SupportedCurrency, locale: string = 'en-US'): string | null {
    const key = `${amount}-${currency}-${locale}`;
    const cached = this.formatCache.get(key);
    
    if (!cached) return null;
    
    // Check if cache entry is still valid
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.formatCache.delete(key);
      return null;
    }
    
    return cached.formatted;
  }

  setCachedFormat(
    amount: number, 
    currency: SupportedCurrency, 
    formatted: string,
    locale: string = 'en-US',
    ttl: number = this.DEFAULT_TTL
  ): void {
    const key = `${amount}-${currency}-${locale}`;
    
    // Prevent cache from growing too large
    if (this.formatCache.size >= this.MAX_CACHE_SIZE) {
      this.cleanupOldestEntries(this.formatCache, Math.floor(this.MAX_CACHE_SIZE * 0.1));
    }
    
    this.formatCache.set(key, {
      amount,
      currency,
      locale,
      formatted,
      timestamp: Date.now(),
      ttl
    });
  }

  // Cache management
  cleanup(): void {
    const now = Date.now();
    
    // Clean up expired conversion cache entries
    for (const [key, entry] of this.conversionCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.conversionCache.delete(key);
      }
    }
    
    // Clean up expired format cache entries
    for (const [key, entry] of this.formatCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.formatCache.delete(key);
      }
    }
  }

  private cleanupOldestEntries<T extends { timestamp: number }>(
    cache: Map<string, T>, 
    count: number
  ): void {
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    for (let i = 0; i < count && i < entries.length; i++) {
      cache.delete(entries[i][0]);
    }
  }

  clearCache(): void {
    this.conversionCache.clear();
    this.formatCache.clear();
  }

  getCacheStats() {
    return {
      conversionCacheSize: this.conversionCache.size,
      formatCacheSize: this.formatCache.size,
      totalCacheSize: this.conversionCache.size + this.formatCache.size,
      maxCacheSize: this.MAX_CACHE_SIZE * 2, // Both caches combined
    };
  }

  // Preload common conversions
  preloadCommonConversions(baseCurrency: SupportedCurrency, targetCurrencies: SupportedCurrency[]): void {
    // This would typically fetch rates from an API and cache them
    // For now, we'll use the existing conversion logic
    const { convertCurrency } = require('./currencyUtils');
    
    targetCurrencies.forEach(targetCurrency => {
      if (baseCurrency !== targetCurrency) {
        try {
          const rate = convertCurrency(1, baseCurrency, targetCurrency);
          this.setCachedConversion(baseCurrency, targetCurrency, rate);
          
          // Also cache the reverse conversion
          const reverseRate = convertCurrency(1, targetCurrency, baseCurrency);
          this.setCachedConversion(targetCurrency, baseCurrency, reverseRate);
        } catch (error) {
          console.warn(`Failed to preload conversion ${baseCurrency} -> ${targetCurrency}:`, error);
        }
      }
    });
  }
}

// Singleton instance
export const currencyCache = new CurrencyCache();

// Utility functions for easy access
export const getCachedConversion = (from: SupportedCurrency, to: SupportedCurrency) => 
  currencyCache.getCachedConversion(from, to);

export const setCachedConversion = (from: SupportedCurrency, to: SupportedCurrency, rate: number) => 
  currencyCache.setCachedConversion(from, to, rate);

export const getCachedFormat = (amount: number, currency: SupportedCurrency, locale?: string) => 
  currencyCache.getCachedFormat(amount, currency, locale);

export const setCachedFormat = (amount: number, currency: SupportedCurrency, formatted: string, locale?: string) => 
  currencyCache.setCachedFormat(amount, currency, formatted, locale);

export const clearCurrencyCache = () => currencyCache.clearCache();

export const getCurrencyCacheStats = () => currencyCache.getCacheStats();

export const preloadCurrencyConversions = (base: SupportedCurrency, targets: SupportedCurrency[]) => 
  currencyCache.preloadCommonConversions(base, targets);