'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { TransactionHistory } from '@/components/budgetup/TransactionHistory';
import { formatGHS, SupportedCurrency } from '@/lib/currencyUtils';
import { useFinancialStore } from '@/store/useFinancialStore';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  // Use financial store
  const { 
    getTotalIncome, 
    getTotalExpenses, 
    getAvailableBalance,
    transactions,
    savingsGoals,
    savingsEntries,
    groupGoals,
    groupContributions
  } = useFinancialStore();

  useEffect(() => {
    // The useAuth hook handles authentication checking
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  BudgetUp
                </h1>
                <p className="text-sm text-gray-600 font-medium">Smart Financial Management for Ghana</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
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
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Income Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-white/90 text-lg font-medium flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Income
              </CardTitle>
              <CardDescription className="text-green-100">Monthly earnings tracked</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-white">{formatGHS(getTotalIncome())}</p>
                <div className="flex items-center justify-between text-green-100 text-sm">
                  <span>{transactions.filter(t => t.type === 'income').length} entries</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full">+{getTotalIncome() > 0 ? '100%' : '0%'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-white/90 text-lg font-medium flex items-center gap-2">
                <span className="text-2xl">💸</span>
                Expenses
              </CardTitle>
              <CardDescription className="text-red-100">Monthly spending tracked</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-white">{formatGHS(getTotalExpenses())}</p>
                <div className="flex items-center justify-between text-red-100 text-sm">
                  <span>{transactions.filter(t => t.type === 'expense').length} entries</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full">{getTotalIncome() > 0 ? Math.round((getTotalExpenses()/getTotalIncome())*100) : 0}% of income</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance Card */}
          <Card className={`relative overflow-hidden border-0 shadow-lg text-white ${
            getAvailableBalance() >= 0 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
              : 'bg-gradient-to-br from-orange-500 to-red-600'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-white/90 text-lg font-medium flex items-center gap-2">
                <span className="text-2xl">{getAvailableBalance() >= 0 ? '📈' : '⚠️'}</span>
                {getAvailableBalance() >= 0 ? 'Available' : 'Deficit'}
              </CardTitle>
              <CardDescription className={getAvailableBalance() >= 0 ? 'text-blue-100' : 'text-orange-100'}>
                {getAvailableBalance() >= 0 ? 'Ready to save or invest' : 'Review your spending'}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-white">{formatGHS(Math.abs(getAvailableBalance()))}</p>
                <div className={`flex items-center justify-between text-sm ${
                  getAvailableBalance() >= 0 ? 'text-blue-100' : 'text-orange-100'
                }`}>
                  <span>After expenses</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    {getTotalIncome() > 0 ? Math.round((getAvailableBalance()/getTotalIncome())*100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Navigation Tabs */}
        <Tabs defaultValue="tracking" className="space-y-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <TabsList className="grid w-full grid-cols-6 bg-transparent gap-1 h-auto">
              <TabsTrigger 
                value="tracking" 
                className="flex flex-col items-center justify-center gap-2 py-4 px-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-700 text-gray-600 hover:text-green-600 transition-all duration-200 rounded-xl"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-lg text-green-600 text-lg font-semibold">
                  📊
                </div>
                <span className="text-xs font-medium text-center leading-tight hidden sm:block">Income & Expenses</span>
                <span className="text-xs font-medium text-center leading-tight sm:hidden">Tracking</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="flex flex-col items-center justify-center gap-2 py-4 px-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-xl"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 text-lg font-semibold">
                  🤖
                </div>
                <span className="text-xs font-medium text-center leading-tight hidden sm:block">AI Advisor</span>
                <span className="text-xs font-medium text-center leading-tight sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger 
                value="savings" 
                className="flex flex-col items-center justify-center gap-2 py-4 px-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-700 text-gray-600 hover:text-purple-600 transition-all duration-200 rounded-xl"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-lg text-purple-600 text-lg font-semibold">
                  🎯
                </div>
                <span className="text-xs font-medium text-center leading-tight hidden sm:block">Personal Savings</span>
                <span className="text-xs font-medium text-center leading-tight sm:hidden">Savings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="group" 
                className="flex flex-col items-center justify-center gap-2 py-4 px-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-700 text-gray-600 hover:text-orange-600 transition-all duration-200 rounded-xl"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-lg text-orange-600 text-lg font-semibold">
                  👥
                </div>
                <span className="text-xs font-medium text-center leading-tight hidden sm:block">Group Savings</span>
                <span className="text-xs font-medium text-center leading-tight sm:hidden">Group</span>
              </TabsTrigger>
              <TabsTrigger 
                value="budget" 
                className="flex flex-col items-center justify-center gap-2 py-4 px-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-700 text-gray-600 hover:text-indigo-600 transition-all duration-200 rounded-xl"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-lg text-indigo-600 text-lg font-semibold">
                  📝
                </div>
                <span className="text-xs font-medium text-center leading-tight hidden sm:block">Budget Planner</span>
                <span className="text-xs font-medium text-center leading-tight sm:hidden">Budget</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex flex-col items-center justify-center gap-2 py-4 px-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-teal-700 text-gray-600 hover:text-teal-600 transition-all duration-200 rounded-xl"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-teal-100 rounded-lg text-teal-600 text-lg font-semibold">
                  📈
                </div>
                <span className="text-xs font-medium text-center leading-tight hidden sm:block">Reports</span>
                <span className="text-xs font-medium text-center leading-tight sm:hidden">Reports</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Income & Expenses Tab */}
          <TabsContent value="tracking" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Track Your Finances</h2>
              <p className="text-gray-600">Monitor your income and expenses to stay on top of your financial health</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <ManualEntry type="income" />
              </div>
              <div className="space-y-6">
                <ManualEntry type="expense" />
              </div>
            </div>
            
            {/* Transaction History */}
            <TransactionHistory />
          </TabsContent>

          {/* AI Advisor Tab */}
          <TabsContent value="ai" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🤖 AI Financial Advisor</h2>
              <p className="text-gray-600">Get personalized savings advice powered by artificial intelligence</p>
            </div>
            <AISavingsSuggestion />
          </TabsContent>

          {/* Personal Savings Tab */}
          <TabsContent value="savings" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎯 Personal Savings Goals</h2>
              <p className="text-gray-600">Set and track your individual savings targets</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <SavingsGoalSetup />
                <SavingsEntryForm />
              </div>
              <div className="lg:col-span-2">
                <SavingsTrackerTable />
              </div>
            </div>
          </TabsContent>

          {/* Group Savings Tab */}
          <TabsContent value="group" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">👥 Group Savings</h2>
              <p className="text-gray-600">Collaborate with friends and family on shared financial goals</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CreateGroupGoalForm />
              <GroupSavingsTrackerTable />
            </div>
          </TabsContent>

          {/* Budget Planner Tab */}
          <TabsContent value="budget" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📝 Budget Planner</h2>
              <p className="text-gray-600">Create and manage your monthly budget effectively</p>
            </div>
            <BudgetTable />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📈 Financial Reports</h2>
              <p className="text-gray-600">Visualize your financial data with comprehensive reports and charts</p>
            </div>
            <VisualReport 
              income={getTotalIncome()}
              expenses={getTotalExpenses()}
              savingsGoal={savingsGoals[0] || null}
              savingsEntries={savingsEntries}
              groupSavings={groupContributions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
