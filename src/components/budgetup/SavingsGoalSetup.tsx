'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Target, Calendar, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { SUPPORTED_CURRENCIES } from '@/lib/currencyUtils';
import { createSavingsGoalSchema, CreateSavingsGoalFormData } from '@/lib/validations';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useCurrency } from '@/hooks/useCurrency';
import { toast } from 'sonner';

export function SavingsGoalSetup() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal } = useFinancialStore();
  const { currentCurrency, formatCurrency } = useCurrency();
  
  // Get the active goal (assuming one active goal for now)
  const currentGoal = savingsGoals.find(goal => goal.isActive) || null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateSavingsGoalFormData>({
    resolver: zodResolver(createSavingsGoalSchema),
    defaultValues: {
      title: currentGoal?.title || '',
      targetAmount: currentGoal?.targetAmount || undefined,
      currency: currentGoal?.currency || currentCurrency,
      startDate: currentGoal?.startDate || new Date(),
      endDate: currentGoal?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true
    }
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const currency = watch('currency');

  const onSubmit = async (data: CreateSavingsGoalFormData) => {
    try {
      if (currentGoal) {
        updateSavingsGoal(currentGoal.id, data);
        toast.success('Savings goal updated successfully!');
      } else {
        addSavingsGoal(data);
        toast.success('Savings goal created successfully!');
        reset({
          title: '',
          targetAmount: undefined,
          currency: currentCurrency,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true
        });
      }
    } catch (error) {
      toast.error('Failed to save goal. Please try again.');
    }
  };

  const isEditing = !!currentGoal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          {isEditing ? 'Edit Savings Goal' : 'Set Personal Savings Goal'}
        </CardTitle>
        <CardDescription>
          Define your savings target and timeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Goal Title</label>
            <Input
              type="text"
              placeholder="e.g., Emergency Fund, Vacation"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Amount (Optional)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  step="0.01"
                  min="0"
                  {...register('targetAmount', { valueAsNumber: true })}
                />
              </div>
              {errors.targetAmount && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.targetAmount.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select value={currency} onValueChange={(value) => setValue('currency', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setValue('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setValue('endDate', date)}
                    initialFocus
                    disabled={(date) => date <= (startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Setting Goal...'}
              </>
            ) : (
              isEditing ? 'Update Goal' : 'Set Goal'
            )}
          </Button>
        </form>
        
        {currentGoal && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Current Goal</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium">{currentGoal.title}</p>
              {currentGoal.targetAmount && (
                <p>Target: {formatCurrency(currentGoal.targetAmount, currentGoal.currency)}</p>
              )}
              <p>Period: {format(currentGoal.startDate, 'MMM dd, yyyy')} - {format(currentGoal.endDate, 'MMM dd, yyyy')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 