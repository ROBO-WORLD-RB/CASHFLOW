'use client';

import { useCurrency } from '@/hooks/useCurrency';
import { useState } from 'react';

export function CurrencyHookTest() {
  const { 
    currentCurrency, 
    formatCurrency, 
    convertCurrency, 
    setCurrency, 
    getCurrencySymbol,
    isLoading 
  } = useCurrency();
  
  const [testAmount, setTestAmount] = useState(100);
  const [sourceCurrency, setSourceCurrency] = useState<string>('USD');

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency as any);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Currency Hook Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Current Currency:</label>
          <div className="text-lg font-semibold">{currentCurrency} ({getCurrencySymbol()})</div>
          {isLoading && <div className="text-sm text-gray-500">Loading...</div>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Change Currency:</label>
          <select 
            value={currentCurrency} 
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="GHS">GHS - Ghanaian Cedi</option>
            <option value="NGN">NGN - Nigerian Naira</option>
            <option value="INR">INR - Indian Rupee</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Test Amount:</label>
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(Number(e.target.value))}
            className="border rounded px-3 py-2 w-32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Source Currency for Conversion:</label>
          <select 
            value={sourceCurrency} 
            onChange={(e) => setSourceCurrency(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="GHS">GHS</option>
            <option value="NGN">NGN</option>
            <option value="INR">INR</option>
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Results:</h3>
          <div className="space-y-2">
            <div>
              <strong>Formatted Amount:</strong> {formatCurrency(testAmount)}
            </div>
            <div>
              <strong>Converted Amount:</strong> {convertCurrency(testAmount, sourceCurrency as any)} {currentCurrency}
            </div>
            <div>
              <strong>Formatted Converted:</strong> {formatCurrency(testAmount, sourceCurrency as any)}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Test Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Change the currency and verify all amounts update immediately</li>
            <li>Change the test amount and see formatting updates</li>
            <li>Change source currency to test conversions</li>
            <li>Verify memoization by checking console for unnecessary re-renders</li>
          </ul>
        </div>
      </div>
    </div>
  );
}