'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Loader2 } from 'lucide-react';
import { resetAllAppData } from '@/utils/resetAppData';

export function ResetDataButton() {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    const confirmed = window.confirm(
      '🔄 Reset All Data\n\n' +
      'This will:\n' +
      '• Delete all transactions and savings\n' +
      '• Clear your user preferences\n' +
      '• Take you back to the setup page\n\n' +
      'Are you sure you want to continue?'
    );

    if (confirmed) {
      setIsResetting(true);
      
      // Small delay to show loading state
      setTimeout(() => {
        resetAllAppData();
      }, 500);
    }
  };

  return (
    <Button
      onClick={handleReset}
      disabled={isResetting}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-300 transition-colors"
    >
      {isResetting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Resetting...
        </>
      ) : (
        <>
          <RotateCcw className="h-4 w-4" />
          Reset Data
        </>
      )}
    </Button>
  );
}