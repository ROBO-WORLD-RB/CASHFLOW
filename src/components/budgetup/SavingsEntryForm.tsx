'use client';

import { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_CURRENCIES, SupportedCurrency } from '@/lib/currencyUtils';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useCurrency } from '@/hooks/useCurrency';
import { toast } from 'sonner';

interface SavingsEntryFormProps {
  onUpdate: (amount: number, description: string, currency: SupportedCurrency) => void;
}

export function SavingsEntryForm({ onUpdate }: SavingsEntryFormProps) {
  const { currentCurrency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<SupportedCurrency>(currentCurrency);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    
    try {
      onUpdate(numAmount, description, currency);
      setAmount('');
      setDescription('');
      setCurrency(currentCurrency);
      toast.success('Savings entry added successfully!');
    } catch {
      toast.error('Failed to add savings entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log New Saving</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              type="text"
              placeholder="e.g., Monthly savings, Bonus savings"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
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
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !amount || !description}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Adding...' : 'Add Savings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 