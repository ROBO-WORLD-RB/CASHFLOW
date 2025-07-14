'use client';

import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, convertCurrency, SupportedCurrency } from '@/lib/currencyUtils';

interface SavingsEntry {
  id: string;
  amount: number;
  currency: SupportedCurrency;
  description: string;
  date: Date;
}

interface SavingsGoal {
  id: string;
  targetAmount?: number;
  currency: SupportedCurrency;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

interface SavingsTrackerTableProps {
  savingsEntries: SavingsEntry[];
  savingsGoal?: SavingsGoal | null;
}

export function SavingsTrackerTable({ savingsEntries, savingsGoal }: SavingsTrackerTableProps) {
  // Filter entries to only show those within the current savings goal date range
  const filteredEntries = savingsGoal 
    ? savingsEntries.filter(entry => 
        entry.date >= savingsGoal.startDate && entry.date <= savingsGoal.endDate
      )
    : savingsEntries;

  // Sort entries by most recent first
  const sortedEntries = [...filteredEntries].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Calculate running totals
  type EntryWithRunningTotal = SavingsEntry & { ghsEquivalent: number; runningTotal: number };
  const entriesWithRunningTotal: EntryWithRunningTotal[] = sortedEntries.map((entry, index) => {
    const ghsEquivalent = convertCurrency(entry.amount, entry.currency, 'GHS');
    const previousTotal = index > 0 
      ? entriesWithRunningTotal[index - 1].runningTotal 
      : 0;
    const runningTotal = previousTotal + ghsEquivalent;

    return {
      ...entry,
      ghsEquivalent,
      runningTotal
    };
  });

  const totalSavedGHS = entriesWithRunningTotal.length > 0 
    ? entriesWithRunningTotal[entriesWithRunningTotal.length - 1].runningTotal 
    : 0;

  const goalTargetGHS = savingsGoal?.targetAmount 
    ? convertCurrency(savingsGoal.targetAmount, savingsGoal.currency, 'GHS')
    : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Savings History</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No savings logged yet...</p>
            {savingsGoal && (
              <p className="text-sm mt-2">
                Goal period: {format(savingsGoal.startDate, 'MMM dd, yyyy')} - {format(savingsGoal.endDate, 'MMM dd, yyyy')}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>~ GHS Equiv.</TableHead>
                    <TableHead>Running Total (GHS)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entriesWithRunningTotal.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {format(entry.date, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>
                        {formatCurrency(entry.amount, entry.currency)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(entry.ghsEquivalent, 'GHS')}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(entry.runningTotal, 'GHS')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer with totals */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-lg font-semibold">
                  Total Saved (Est. GHS): {formatCurrency(totalSavedGHS, 'GHS')}
                </p>
                {goalTargetGHS && (
                  <p className="text-sm text-gray-600">
                    Goal Target: {formatCurrency(goalTargetGHS, 'GHS')}
                  </p>
                )}
              </div>
              
              {goalTargetGHS && goalTargetGHS > 0 && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-lg font-semibold">
                    {Math.round((totalSavedGHS / goalTargetGHS) * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 