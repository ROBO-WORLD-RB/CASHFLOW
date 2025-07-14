'use client';

import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
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

interface GroupContribution {
  id: string;
  groupId: string;
  amount: number;
  currency: SupportedCurrency;
  participantName: string;
  date: Date;
  time: string;
  description?: string;
}

interface VisualReportComponentProps {
  income: number;
  expenses: number;
  savingsGoal?: SavingsGoal | null;
  savingsEntries: SavingsEntry[];
  groupSavings: GroupContribution[];
}

export default function VisualReportComponent({
  income,
  expenses,
  savingsGoal,
  savingsEntries,
  groupSavings
}: VisualReportComponentProps) {
  // Calculate personal savings total
  const personalSavingsTotal = savingsEntries.reduce((sum, entry) => {
    return sum + convertCurrency(entry.amount, entry.currency, 'GHS');
  }, 0);

  // Calculate group savings total
  const groupSavingsTotal = groupSavings.reduce((sum, contribution) => {
    return sum + convertCurrency(contribution.amount, contribution.currency, 'GHS');
  }, 0);

  // Allocation pie chart data
  const allocationData = [
    { name: 'Expenses', value: expenses, color: '#ef4444' },
    { name: 'Personal', value: personalSavingsTotal, color: '#3b82f6' },
    { name: 'Group', value: groupSavingsTotal, color: '#8b5cf6' },
    { name: 'Unallocated', value: Math.max(0, income - expenses - personalSavingsTotal - groupSavingsTotal), color: '#6b7280' }
  ].filter(item => item.value > 0);

  // Personal savings trend data
  const getSavingsTrendData = () => {
    if (!savingsGoal) return [];

    const filteredEntries = savingsEntries.filter(entry => 
      entry.date >= savingsGoal.startDate && entry.date <= savingsGoal.endDate
    );

    const sortedEntries = [...filteredEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    let runningTotal = 0;
    return sortedEntries.map(entry => {
      runningTotal += convertCurrency(entry.amount, entry.currency, 'GHS');
      return {
        date: format(entry.date, 'MMM dd'),
        cumulative: runningTotal,
        target: savingsGoal.targetAmount ? convertCurrency(savingsGoal.targetAmount, savingsGoal.currency, 'GHS') : undefined
      };
    });
  };

  // Monthly trends data (simplified - using current month data)
  const getMonthlyTrendsData = () => {
    const currentMonth = new Date().getMonth();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return [
      {
        month: monthNames[currentMonth],
        income: income,
        expenses: expenses,
        personalSavings: personalSavingsTotal,
        groupSavings: groupSavingsTotal
      }
    ];
  };

  const savingsTrendData = getSavingsTrendData();
  const monthlyTrendsData = getMonthlyTrendsData();

  // Calculate goal progress
  const goalProgress = savingsGoal?.targetAmount 
    ? (personalSavingsTotal / convertCurrency(savingsGoal.targetAmount, savingsGoal.currency, 'GHS')) * 100
    : 0;

  const daysLeft = savingsGoal?.endDate 
    ? Math.max(0, Math.ceil((savingsGoal.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-6">
      {/* Allocation Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Income Allocation (GHS)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  percent !== undefined && percent > 0.03 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                }
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value, 'GHS'), 'Amount']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Personal Savings Goal Progress */}
      {savingsGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Savings Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Target Amount</p>
                <p className="text-lg font-semibold">
                  {savingsGoal.targetAmount 
                    ? formatCurrency(convertCurrency(savingsGoal.targetAmount, savingsGoal.currency, 'GHS'), 'GHS')
                    : 'No target set'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="text-lg font-semibold">
                  {format(savingsGoal.endDate, 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(goalProgress)}%</span>
              </div>
              <Progress value={Math.min(goalProgress, 100)} className="w-full" />
              <p className="text-sm text-gray-600">
                {formatCurrency(personalSavingsTotal, 'GHS')} saved • {daysLeft} days left
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Savings Trend */}
      {savingsGoal && savingsTrendData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Personal Savings Trend (GHS)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={savingsTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value, 'GHS'), 'Amount']}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Cumulative Savings"
                />
                {savingsGoal.targetAmount && (
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    name="Target"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Personal Savings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>Set a personal savings goal to see your progress trend</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends Overview (GHS)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value, 'GHS'), 'Amount']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Expenses"
              />
              <Line 
                type="monotone" 
                dataKey="personalSavings" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Personal Savings"
              />
              <Line 
                type="monotone" 
                dataKey="groupSavings" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Group Savings"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
} 