'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatGHS } from '@/lib/currencyUtils';
import { createTransactionSchema, CreateTransactionFormData } from '@/lib/validations';
import { useFinancialStore } from '@/store/useFinancialStore';
import { toast } from 'sonner';

interface ManualEntryProps {
  type: 'income' | 'expense';
}

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
  'Other Income'
];

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing & Rent',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Communication',
  'Other Expenses'
];

export function ManualEntry({ type }: ManualEntryProps) {
  const { addTransaction, getTotalIncome, getTotalExpenses } = useFinancialStore();
  
  const total = type === 'income' ? getTotalIncome() : getTotalExpenses();
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type,
      currency: 'GHS',
      date: new Date()
    }
  });

  const onSubmit = async (data: CreateTransactionFormData) => {
    try {
      addTransaction(data);
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
      reset({
        type,
        currency: 'GHS',
        date: new Date()
      });
    } catch (error) {
      toast.error('Failed to add transaction. Please try again.');
    }
  };

  const isIncome = type === 'income';
  const icon = isIncome ? TrendingUp : TrendingDown;
  const IconComponent = icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className={`h-5 w-5 ${isIncome ? 'text-green-600' : 'text-red-600'}`} />
          {isIncome ? 'Add Income' : 'Add Expense'}
        </CardTitle>
        <CardDescription>
          Current total: <span className="font-semibold">{formatGHS(total)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                placeholder="Amount (GHS)"
                step="0.01"
                min="0"
                className="pl-10"
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Description"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Select onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              type="date"
              {...register('date', { valueAsDate: true })}
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add {isIncome ? 'Income' : 'Expense'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 