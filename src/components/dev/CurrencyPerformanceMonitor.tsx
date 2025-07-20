'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, BarChart3, Clock, Zap, RefreshCw } from 'lucide-react';
import { getCurrencyCacheStats, clearCurrencyCache } from '@/lib/currencyCache';
import { useCurrencyPerformance } from '@/hooks/useOptimizedCurrency';

interface PerformanceStats {
  conversionCacheSize: number;
  formatCacheSize: number;
  totalCacheSize: number;
  maxCacheSize: number;
}

export function CurrencyPerformanceMonitor() {
  const [cacheStats, setCacheStats] = useState<PerformanceStats>({
    conversionCacheSize: 0,
    formatCacheSize: 0,
    totalCacheSize: 0,
    maxCacheSize: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const { getPerformanceStats, resetPerformanceStats } = useCurrencyPerformance();
  const [perfStats, setPerfStats] = useState(getPerformanceStats());

  useEffect(() => {
    const updateStats = () => {
      setCacheStats(getCurrencyCacheStats());
      setPerfStats(getPerformanceStats());
    };

    // Update stats every second when visible
    let interval: NodeJS.Timeout;
    if (isVisible) {
      updateStats();
      interval = setInterval(updateStats, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible, getPerformanceStats]);

  const handleClearCache = () => {
    clearCurrencyCache();
    setCacheStats(getCurrencyCacheStats());
  };

  const handleResetStats = () => {
    resetPerformanceStats();
    setPerfStats(getPerformanceStats());
  };

  const cacheUtilization = cacheStats.maxCacheSize > 0 
    ? (cacheStats.totalCacheSize / cacheStats.maxCacheSize) * 100 
    : 0;

  const averageOperationTime = perfStats.formatOperations + perfStats.convertOperations > 0
    ? perfStats.totalTime / (perfStats.formatOperations + perfStats.convertOperations)
    : 0;

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          <Activity className="h-4 w-4 mr-2" />
          Currency Performance
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Currency Performance
            </CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cache Statistics */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Cache Statistics</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Conversions</div>
                <div className="text-blue-600">{cacheStats.conversionCacheSize}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Formats</div>
                <div className="text-green-600">{cacheStats.formatCacheSize}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Cache Utilization</span>
              <Badge variant={cacheUtilization > 80 ? "destructive" : "secondary"}>
                {cacheUtilization.toFixed(1)}%
              </Badge>
            </div>
          </div>

          {/* Performance Statistics */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Format Ops</div>
                <div className="text-purple-600">{perfStats.formatOperations}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium">Convert Ops</div>
                <div className="text-orange-600">{perfStats.convertOperations}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Avg Time</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{averageOperationTime.toFixed(2)}ms</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleClearCache}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear Cache
            </Button>
            <Button
              onClick={handleResetStats}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              Reset Stats
            </Button>
          </div>

          {/* Performance Tips */}
          <div className="text-xs text-gray-600 space-y-1">
            <div className="font-medium">Tips:</div>
            <ul className="space-y-1 text-xs">
              {cacheUtilization > 90 && (
                <li className="text-red-600">• Cache nearly full - consider clearing</li>
              )}
              {averageOperationTime > 5 && (
                <li className="text-yellow-600">• Operations slower than expected</li>
              )}
              {perfStats.formatOperations > 100 && (
                <li className="text-blue-600">• High format usage - caching helping</li>
              )}
              {cacheStats.totalCacheSize === 0 && (
                <li className="text-gray-500">• No cache entries yet</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Development-only wrapper that only shows in development mode
export function DevCurrencyPerformanceMonitor() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <CurrencyPerformanceMonitor />;
}