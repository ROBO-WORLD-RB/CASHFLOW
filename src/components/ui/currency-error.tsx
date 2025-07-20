'use client';

import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useCurrency';

export function CurrencyError() {
  const { error, clearError } = useCurrency();

  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800">Currency Error</h4>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearError}
          className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 h-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}