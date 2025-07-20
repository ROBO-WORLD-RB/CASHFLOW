'use client';

import React from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';

/**
 * Test component to verify currency context functionality
 * This component can be temporarily added to test the currency system
 */
export function CurrencyTest() {
  const { 
    currentCurrency, 
    formatCurrency, 
    convertCurrency, 
    setCurrency, 
    getCurrencySymbol 
  } = useCurrency();

  const testAmount = 100;
  const testCurrencies = ['USD', 'EUR', 'GHS'] as const;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Currency Context Test</h3>
      
      <div className="space-y-4">
        <div>
          <p><strong>Current Currency:</strong> {currentCurrency}</p>
          <p><strong>Currency Symbol:</strong> {getCurrencySymbol()}</p>
        </div>

        <div>
          <p><strong>Test Amount:</strong> {testAmount}</p>
          <p><strong>Formatted:</strong> {formatCurrency(testAmount)}</p>
        </div>

        <div>
          <p><strong>Currency Conversions:</strong></p>
          {testCurrencies.map(currency => (
            <p key={currency}>
              {currency}: {formatCurrency(testAmount, currency)} → {formatCurrency(convertCurrency(testAmount, currency))}
            </p>
          ))}
        </div>

        <div className="flex gap-2">
          <p><strong>Change Currency:</strong></p>
          {testCurrencies.map(currency => (
            <Button
              key={currency}
              variant={currentCurrency === currency ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrency(currency)}
            >
              {currency}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}