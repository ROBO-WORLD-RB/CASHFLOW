'use client';

import { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatGHS } from '@/lib/currencyUtils';

interface ManualEntryProps {
  type: 'income' | 'expense';
  onUpdate: (amount: number, description: string) => void;
  total: number;
}

export function ManualEntry({ type, onUpdate, total }: ManualEntryProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) {
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      onUpdate(numAmount, description);
      setAmount('');
      setDescription('');
    } finally {
      setIsLoading(false);
    }
  };

  const isIncome = type === 'income';
  const title = isIncome ? 'Income (GHS)' : 'Expenses (GHS)';
  const buttonText = isIncome ? 'Add Income' : 'Add Expense';
  const buttonColor = isIncome ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';
  const totalColor = isIncome ? 'text-green-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader>
        <CardTitle className={totalColor}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              placeholder="Amount (GHS)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10"
              step="0.01"
              min="0"
              required
            />
          </div>
          <Input
            type="text"
            placeholder={`${isIncome ? 'Income' : 'Expense'} description`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className={`w-full ${buttonColor}`}
            disabled={isLoading || !amount || !description}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Adding...' : buttonText}
          </Button>
        </form>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-lg font-semibold">
            Total {isIncome ? 'Income' : 'Expenses'}: {formatGHS(total)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 