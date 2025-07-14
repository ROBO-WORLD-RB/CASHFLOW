'use client';

import { useState } from 'react';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatGHS } from '@/lib/currencyUtils';
import { toast } from 'sonner';

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
}

interface BudgetTableProps {
  onBudgetUpdate: (budget: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    income: number;
    categories: BudgetCategory[];
  }) => void;
}

export function BudgetTable({ onBudgetUpdate }: BudgetTableProps) {
  const [budgetType, setBudgetType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [income, setIncome] = useState('');
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Food', amount: 0 },
    { id: '2', name: 'Transportation', amount: 0 },
    { id: '3', name: 'Utilities', amount: 0 }
  ]);

  const handleAddCategory = () => {
    const newCategory: BudgetCategory = {
      id: `cat_${Date.now()}`,
      name: '',
      amount: 0
    };
    setCategories([...categories, newCategory]);
  };

  const handleRemoveCategory = (id: string) => {
    if (categories.length <= 1) {
      toast.error('You must have at least one expense category');
      return;
    }
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleCategoryChange = (id: string, field: 'name' | 'amount', value: string | number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remainingAmount = (parseFloat(income) || 0) - totalExpenses;

  const handleSaveBudget = () => {
    if (!income || parseFloat(income) <= 0) {
      toast.error('Please enter a valid income amount');
      return;
    }

    if (categories.some(cat => !cat.name.trim())) {
      toast.error('Please fill in all category names');
      return;
    }

    const budget = {
      type: budgetType,
      income: parseFloat(income),
      categories: categories.filter(cat => cat.name.trim())
    };

    onBudgetUpdate(budget);
    toast.success('Budget saved successfully!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Budget Planner
        </CardTitle>
        <CardDescription>
          Create and manage your budget plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget Type</label>
            <Select value={budgetType} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => setBudgetType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Income ({budgetType.charAt(0).toUpperCase() + budgetType.slice(1)})</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                placeholder="0.00"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="pl-10"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Expense Categories</h3>
            <Button onClick={handleAddCategory} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Budgeted Amount (GHS)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Input
                        placeholder="Category name"
                        value={category.name}
                        onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                        className="max-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={category.amount === 0 ? '' : String(category.amount)}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleCategoryChange(category.id, 'amount', val === '' ? 0 : parseFloat(val));
                        }}
                        className="max-w-[150px]"
                        step="0.01"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Budget Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-lg font-semibold text-green-600">
                {formatGHS(parseFloat(income) || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-lg font-semibold text-red-600">
                {formatGHS(totalExpenses)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className={`text-lg font-semibold ${remainingAmount >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatGHS(remainingAmount)}
              </p>
            </div>
          </div>

          <Button 
            onClick={handleSaveBudget}
            className="w-full"
            disabled={!income || parseFloat(income) <= 0}
          >
            Save Budget
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 