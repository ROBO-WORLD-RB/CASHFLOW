'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Zap, BarChart3 } from 'lucide-react';
import { useOptimizedCurrency, useBulkCurrencyOperations } from '@/hooks/useOptimizedCurrency';
import { useCurrency } from '@/hooks/useCurrency';
import { SupportedCurrency } from '@/types';

interface PerformanceTestResult {
  operation: string;
  itemCount: number;
  timeMs: number;
  operationsPerSecond: number;
}

export function CurrencyPerformanceTest() {
  const [testResults, setTestResults] = useState<PerformanceTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const regularCurrency = useCurrency();
  const optimizedCurrency = useOptimizedCurrency();
  const bulkOperations = useBulkCurrencyOperations();

  // Generate test data
  const testData = useMemo(() => {
    const currencies: SupportedCurrency[] = ['USD', 'EUR', 'GBP', 'GHS', 'NGN', 'INR', 'BRL', 'MXN'];
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      amount: Math.random() * 10000,
      currency: currencies[i % currencies.length] as SupportedCurrency,
      type: Math.random() > 0.5 ? 'income' as const : 'expense' as const
    }));
  }, []);

  const runPerformanceTest = async (
    testName: string,
    operation: () => void,
    itemCount: number
  ): Promise<PerformanceTestResult> => {
    const start = performance.now();
    operation();
    const end = performance.now();
    
    const timeMs = end - start;
    const operationsPerSecond = itemCount / (timeMs / 1000);
    
    return {
      operation: testName,
      itemCount,
      timeMs,
      operationsPerSecond
    };
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const results: PerformanceTestResult[] = [];

    try {
      // Test 1: Regular currency formatting (100 items)
      const smallDataset = testData.slice(0, 100);
      const regularFormatResult = await runPerformanceTest(
        'Regular Format (100)',
        () => {
          smallDataset.forEach(item => 
            regularCurrency.formatCurrency(item.amount, item.currency)
          );
        },
        100
      );
      results.push(regularFormatResult);

      // Test 2: Optimized currency formatting (100 items)
      const optimizedFormatResult = await runPerformanceTest(
        'Optimized Format (100)',
        () => {
          smallDataset.forEach(item => 
            optimizedCurrency.formatCurrency(item.amount, item.currency)
          );
        },
        100
      );
      results.push(optimizedFormatResult);

      // Test 3: Bulk currency formatting (100 items)
      const bulkFormatResult = await runPerformanceTest(
        'Bulk Format (100)',
        () => {
          bulkOperations.formatCurrencyList(smallDataset);
        },
        100
      );
      results.push(bulkFormatResult);

      // Test 4: Regular currency conversion (500 items)
      const mediumDataset = testData.slice(0, 500);
      const regularConvertResult = await runPerformanceTest(
        'Regular Convert (500)',
        () => {
          mediumDataset.forEach(item => 
            regularCurrency.convertCurrency(item.amount, item.currency)
          );
        },
        500
      );
      results.push(regularConvertResult);

      // Test 5: Optimized currency conversion (500 items)
      const optimizedConvertResult = await runPerformanceTest(
        'Optimized Convert (500)',
        () => {
          mediumDataset.forEach(item => 
            optimizedCurrency.convertCurrency(item.amount, item.currency)
          );
        },
        500
      );
      results.push(optimizedConvertResult);

      // Test 6: Bulk currency conversion (500 items)
      const bulkConvertResult = await runPerformanceTest(
        'Bulk Convert (500)',
        () => {
          bulkOperations.convertCurrencyList(mediumDataset);
        },
        500
      );
      results.push(bulkConvertResult);

      // Test 7: Memoized operations (repeated calls)
      const memoTestData = testData.slice(0, 50);
      const memoResult = await runPerformanceTest(
        'Memoized Repeat (50x10)',
        () => {
          // Call the same operations 10 times to test memoization
          for (let i = 0; i < 10; i++) {
            memoTestData.forEach(item => 
              optimizedCurrency.formatCurrencyMemo(item.amount, item.currency, `test-${item.id}`)
            );
          }
        },
        500 // 50 items × 10 repetitions
      );
      results.push(memoResult);

      // Test 8: Bulk totals calculation
      const totalsResult = await runPerformanceTest(
        'Bulk Totals (1000)',
        () => {
          bulkOperations.calculateTotals(testData);
        },
        1000
      );
      results.push(totalsResult);

      setTestResults(results);
    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getBadgeVariant = (opsPerSecond: number) => {
    if (opsPerSecond > 10000) return 'default'; // Excellent
    if (opsPerSecond > 5000) return 'secondary'; // Good
    if (opsPerSecond > 1000) return 'outline'; // Fair
    return 'destructive'; // Needs improvement
  };

  const getPerformanceRating = (opsPerSecond: number) => {
    if (opsPerSecond > 10000) return 'Excellent';
    if (opsPerSecond > 5000) return 'Good';
    if (opsPerSecond > 1000) return 'Fair';
    return 'Slow';
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Currency Performance Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Timer className="h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Run Performance Tests
              </>
            )}
          </Button>
          
          {testResults.length > 0 && (
            <div className="text-sm text-gray-600">
              Last run: {testResults.length} tests completed
            </div>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            
            <div className="grid gap-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{result.operation}</h4>
                    <Badge variant={getBadgeVariant(result.operationsPerSecond)}>
                      {getPerformanceRating(result.operationsPerSecond)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Items:</span>
                      <span className="ml-2 font-medium">{result.itemCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <span className="ml-2 font-medium">{result.timeMs.toFixed(2)}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ops/sec:</span>
                      <span className="ml-2 font-medium">{result.operationsPerSecond.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Comparison */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Performance Insights</h4>
              <div className="text-sm text-blue-700 space-y-1">
                {testResults.length >= 3 && (
                  <div>
                    Bulk operations are{' '}
                    <strong>
                      {(testResults[2].operationsPerSecond / testResults[0].operationsPerSecond).toFixed(1)}x
                    </strong>{' '}
                    faster than individual operations
                  </div>
                )}
                {testResults.length >= 6 && (
                  <div>
                    Optimized conversions are{' '}
                    <strong>
                      {(testResults[4].operationsPerSecond / testResults[3].operationsPerSecond).toFixed(1)}x
                    </strong>{' '}
                    faster with caching
                  </div>
                )}
                {testResults.length >= 7 && (
                  <div>
                    Memoized operations handle{' '}
                    <strong>{testResults[6].operationsPerSecond.toFixed(0)}</strong>{' '}
                    operations per second
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Test Description:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Regular operations use the standard currency hooks</li>
            <li>Optimized operations use caching and memoization</li>
            <li>Bulk operations process multiple items in batches</li>
            <li>Memoized operations test repeated call performance</li>
            <li>All tests use realistic financial data with mixed currencies</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}