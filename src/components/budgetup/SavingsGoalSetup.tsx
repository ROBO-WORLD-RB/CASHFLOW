'use client';

import { useState } from 'react';
import { Target, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { SUPPORTED_CURRENCIES, SupportedCurrency } from '@/lib/currencyUtils';
import { toast } from 'sonner';

interface SavingsGoal {
  id: string;
  targetAmount?: number;
  currency: SupportedCurrency;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

interface SavingsGoalSetupProps {
  onGoalSet: (goal: SavingsGoal) => void;
  currentGoal?: SavingsGoal | null;
}

export function SavingsGoalSetup({ onGoalSet, currentGoal }: SavingsGoalSetupProps) {
  const [targetAmount, setTargetAmount] = useState(currentGoal?.targetAmount?.toString() || '');
  const [currency, setCurrency] = useState<SupportedCurrency>(currentGoal?.currency || 'GHS');
  const [startDate, setStartDate] = useState<Date | undefined>(currentGoal?.startDate || new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(currentGoal?.endDate);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    setIsLoading(true);

    try {
      const goal: SavingsGoal = {
        id: currentGoal?.id || `goal_${Date.now()}`,
        targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
        currency,
        startDate,
        endDate,
        createdAt: currentGoal?.createdAt || new Date()
      };

      onGoalSet(goal);
      toast.success('Savings goal set successfully!');
    } catch {
      toast.error('Failed to set savings goal');
    } finally {
      setIsLoading(false);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Amount (Optional)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="pl-10"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select value={currency} onValueChange={(value: SupportedCurrency) => setCurrency(value)}>
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
                    onSelect={setStartDate}
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
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => date <= (startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !startDate || !endDate}
          >
            {isLoading ? 'Setting Goal...' : (isEditing ? 'Update Goal' : 'Set Goal')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 