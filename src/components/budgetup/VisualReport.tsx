'use client';

import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SupportedCurrency } from '@/lib/currencyUtils';

// Dynamic import for the chart component
const VisualReportComponent = React.lazy(() => import('./VisualReportComponent'));

interface VisualReportProps {
  income: number;
  expenses: number;
  savingsGoal?: {
    id: string;
    targetAmount?: number;
    currency: SupportedCurrency;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
  } | null;
  savingsEntries: Array<{
    id: string;
    amount: number;
    currency: SupportedCurrency;
    description: string;
    date: Date;
  }>;
  groupSavings: Array<{
    id: string;
    groupId: string;
    amount: number;
    currency: SupportedCurrency;
    participantName: string;
    date: Date;
    time: string;
    description?: string;
  }>;
  userCurrency: SupportedCurrency;
}

export function VisualReport(props: VisualReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visual Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2">Loading charts...</span>
          </div>
        }>
          <VisualReportComponent {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
} 