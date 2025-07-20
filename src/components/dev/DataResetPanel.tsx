'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  RefreshCw, 
  Database, 
  User, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { 
  resetAllAppData, 
  resetFinancialDataOnly, 
  resetUserPreferencesOnly, 
  addSampleData,
  getDataSummary 
} from '@/utils/resetAppData';

export function DataResetPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [dataSummary, setDataSummary] = useState<any>(null);
  const [lastAction, setLastAction] = useState<string>('');

  const updateDataSummary = () => {
    const summary = getDataSummary();
    setDataSummary(summary);
  };

  const handleResetAll = () => {
    if (confirm('⚠️ This will delete ALL app data including transactions, savings, and preferences. Are you sure?')) {
      resetAllAppData();
      setLastAction('Complete reset performed');
    }
  };

  const handleResetFinancialData = () => {
    if (confirm('This will delete all transactions, savings goals, and financial data but keep your preferences. Continue?')) {
      resetFinancialDataOnly();
      setLastAction('Financial data reset');
      updateDataSummary();
    }
  };

  const handleResetUserPreferences = () => {
    if (confirm('This will reset your user preferences (name, currency, etc.) but keep financial data. Continue?')) {
      resetUserPreferencesOnly();
      setLastAction('User preferences reset');
      updateDataSummary();
    }
  };

  const handleAddSampleData = () => {
    addSampleData();
    setLastAction('Sample data added');
    updateDataSummary();
  };

  React.useEffect(() => {
    if (isVisible) {
      updateDataSummary();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg border-red-200 text-red-600 hover:bg-red-50"
        >
          <Database className="h-4 w-4 mr-2" />
          Reset Data
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96">
      <Card className="shadow-lg border-2 border-red-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Data Reset Panel
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
          {process.env.NODE_ENV !== 'development' && (
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              ⚠️ This panel should only be used in development!
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data Summary */}
          {dataSummary && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Current Data</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">Transactions</div>
                  <div className="text-blue-600">{dataSummary.transactionCount}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">Savings Goals</div>
                  <div className="text-green-600">{dataSummary.savingsGoalCount}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">User Setup</div>
                  <div className="text-purple-600">
                    {dataSummary.userPreferences ? 'Complete' : 'None'}
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="font-medium">Currency</div>
                  <div className="text-orange-600">
                    {dataSummary.userPreferences?.currency || 'USD'}
                  </div>
                </div>
              </div>
              {dataSummary.userPreferences && (
                <div className="text-xs text-gray-600">
                  Balance: ${dataSummary.availableBalance?.toFixed(2) || '0.00'} | 
                  Savings: ${dataSummary.totalSavings?.toFixed(2) || '0.00'}
                </div>
              )}
            </div>
          )}

          {/* Reset Actions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Reset Options</span>
            </div>
            
            <Button
              onClick={handleResetAll}
              variant="destructive"
              size="sm"
              className="w-full text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Complete Reset (All Data)
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleResetFinancialData}
                variant="outline"
                size="sm"
                className="text-xs border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Reset Financial
              </Button>
              
              <Button
                onClick={handleResetUserPreferences}
                variant="outline"
                size="sm"
                className="text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <User className="h-3 w-3 mr-1" />
                Reset User
              </Button>
            </div>
          </div>

          {/* Sample Data */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Test Data</span>
            </div>
            
            <Button
              onClick={handleAddSampleData}
              variant="outline"
              size="sm"
              className="w-full text-xs border-green-200 text-green-600 hover:bg-green-50"
            >
              Add Sample Data
            </Button>
          </div>

          {/* Last Action */}
          {lastAction && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              ✅ {lastAction}
            </div>
          )}

          {/* Refresh Data */}
          <Button
            onClick={updateDataSummary}
            variant="ghost"
            size="sm"
            className="w-full text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Data Summary
          </Button>

          {/* Instructions */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="font-medium">Quick Actions:</div>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Complete Reset:</strong> Fresh start (page reloads)</li>
              <li>• <strong>Reset Financial:</strong> Keep preferences, clear data</li>
              <li>• <strong>Reset User:</strong> Clear preferences, keep data</li>
              <li>• <strong>Sample Data:</strong> Add test transactions & goals</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Development-only wrapper
export function DevDataResetPanel() {
  // Always show in development, but add warning in production
  return <DataResetPanel />;
}