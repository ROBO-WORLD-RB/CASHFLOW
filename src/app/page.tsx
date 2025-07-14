'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualEntry } from '@/components/budgetup/ManualEntry';
import { AISavingsSuggestion } from '@/components/budgetup/AISavingsSuggestion';
import { SavingsGoalSetup } from '@/components/budgetup/SavingsGoalSetup';
import { SavingsTrackerTable } from '@/components/budgetup/SavingsTrackerTable';
import { CreateGroupGoalForm } from '@/components/budgetup/CreateGroupGoalForm';
import { GroupSavingsTrackerTable } from '@/components/budgetup/GroupSavingsTrackerTable';
import { BudgetTable } from '@/components/budgetup/BudgetTable';
import { VisualReport } from '@/components/budgetup/VisualReport';
import { SavingsEntryForm } from '@/components/budgetup/SavingsEntryForm';
import { formatGHS, SupportedCurrency } from '@/lib/currencyUtils';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  
  // State for income and expenses
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [incomeEntries, setIncomeEntries] = useState<Array<{ id: string; amount: number; description: string; date: Date }>>([]);
  const [expenseEntries, setExpenseEntries] = useState<Array<{ id: string; amount: number; description: string; date: Date }>>([]);
  
  // State for personal savings
  const [savingsGoal, setSavingsGoal] = useState<{
    id: string;
    targetAmount?: number;
    currency: SupportedCurrency;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
  } | null>(null);
  const [savingsEntries, setSavingsEntries] = useState<Array<{ id: string; amount: number; currency: SupportedCurrency; description: string; date: Date }>>([]);
  
  // State for group savings
  const [groupGoals, setGroupGoals] = useState<Array<{
    id: string;
    name: string;
    description?: string;
    targetAmount: number;
    currency: SupportedCurrency;
    participants: string[];
    createdAt: Date;
  }>>([]);
  const [groupContributions, setGroupContributions] = useState<Array<{
    id: string;
    groupId: string;
    amount: number;
    currency: SupportedCurrency;
    participantName: string;
    date: Date;
    time: string;
    description?: string;
  }>>([]);
  
  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated');
    const name = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User';
    
    if (authStatus !== 'true') {
      router.push('/auth');
    } else {
      setIsAuthenticated(true);
      setUserName(name);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    router.push('/auth');
  };

  // Handler functions
  const handleIncomeUpdate = (amount: number, description: string) => {
    const newEntry = {
      id: `income_${Date.now()}`,
      amount,
      description,
      date: new Date()
    };
    setIncomeEntries([...incomeEntries, newEntry]);
    setIncome(income + amount);
  };

  const handleExpenseUpdate = (amount: number, description: string) => {
    const newEntry = {
      id: `expense_${Date.now()}`,
      amount,
      description,
      date: new Date()
    };
    setExpenseEntries([...expenseEntries, newEntry]);
    setExpenses(expenses + amount);
  };

  const handleSavingsGoalSet = (goal: {
    id: string;
    targetAmount?: number;
    currency: SupportedCurrency;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
  }) => {
    setSavingsGoal(goal);
  };

  const handleSavingsUpdate = (amount: number, description: string, currency: SupportedCurrency) => {
    const newEntry = {
      id: `savings_${Date.now()}`,
      amount,
      currency,
      description,
      date: new Date()
    };
    setSavingsEntries([...savingsEntries, newEntry]);
  };

  const handleGroupGoalCreate = (goal: {
    id: string;
    name: string;
    description?: string;
    targetAmount: number;
    currency: SupportedCurrency;
    participants: string[];
    createdAt: Date;
  }) => {
    setGroupGoals([...groupGoals, goal]);
  };

  const handleGroupContributionAdd = (groupId: string, contribution: {
    amount: number;
    currency: SupportedCurrency;
    participantName: string;
    date: Date;
    time: string;
    description?: string;
  }) => {
    const newContribution = {
      ...contribution,
      id: `contribution_${Date.now()}`,
      groupId, // Add the missing groupId property
    };
    setGroupContributions([...groupContributions, newContribution]);
  };

  const handleBudgetUpdate = () => {};

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-green-800">BudgetUp</h1>
                <p className="text-sm text-gray-600">Take control of your finances in Ghana</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {userName}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Income (GHS)</CardTitle>
              <CardDescription>Track your monthly income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{formatGHS(income)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {incomeEntries.length} entries logged
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Expenses (GHS)</CardTitle>
              <CardDescription>Track your monthly expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{formatGHS(expenses)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {expenseEntries.length} entries logged
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Remaining Balance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Remaining Balance (GHS)</CardTitle>
              <CardDescription>Your current balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{formatGHS(income - expenses)}</p>
                <p className="text-sm text-gray-500 mt-2">Income - Expenses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Features Tabs */}
        <Tabs defaultValue="tracking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="tracking">Income & Expenses</TabsTrigger>
            <TabsTrigger value="ai">AI Advisor</TabsTrigger>
            <TabsTrigger value="savings">Personal Savings</TabsTrigger>
            <TabsTrigger value="group">Group Savings</TabsTrigger>
            <TabsTrigger value="budget">Budget Planner</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Income & Expenses Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ManualEntry 
                type="income" 
                onUpdate={handleIncomeUpdate} 
                total={income} 
              />
              <ManualEntry 
                type="expense" 
                onUpdate={handleExpenseUpdate} 
                total={expenses} 
              />
            </div>
          </TabsContent>

          {/* AI Advisor Tab */}
          <TabsContent value="ai" className="space-y-6">
            <AISavingsSuggestion userId="user123" />
          </TabsContent>

          {/* Personal Savings Tab */}
          <TabsContent value="savings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <SavingsGoalSetup 
                  onGoalSet={handleSavingsGoalSet} 
                  currentGoal={savingsGoal}
                />
                
                <div className="mt-6">
                  <SavingsEntryForm onUpdate={handleSavingsUpdate} />
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <SavingsTrackerTable 
                  savingsEntries={savingsEntries}
                  savingsGoal={savingsGoal}
                />
              </div>
            </div>
          </TabsContent>

          {/* Group Savings Tab */}
          <TabsContent value="group" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CreateGroupGoalForm onSubmit={handleGroupGoalCreate} />
              <GroupSavingsTrackerTable 
                groupGoals={groupGoals}
                groupContributions={groupContributions}
                onAddContribution={handleGroupContributionAdd}
              />
            </div>
          </TabsContent>

          {/* Budget Planner Tab */}
          <TabsContent value="budget" className="space-y-6">
            <BudgetTable onBudgetUpdate={handleBudgetUpdate} />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <VisualReport 
              income={income}
              expenses={expenses}
              savingsGoal={savingsGoal}
              savingsEntries={savingsEntries}
              groupSavings={groupContributions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
