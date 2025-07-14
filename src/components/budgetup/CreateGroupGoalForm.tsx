'use client';

import { useState } from 'react';
import { Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_CURRENCIES, SupportedCurrency } from '@/lib/currencyUtils';
import { toast } from 'sonner';

interface GroupGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currency: SupportedCurrency;
  participants: string[];
  createdAt: Date;
}

interface CreateGroupGoalFormProps {
  onSubmit: (goal: GroupGoal) => void;
}

export function CreateGroupGoalForm({ onSubmit }: CreateGroupGoalFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currency, setCurrency] = useState<SupportedCurrency>('GHS');
  const [participants, setParticipants] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !targetAmount || !participants.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(targetAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }

    const participantList = participants
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (participantList.length === 0) {
      toast.error('Please enter at least one participant');
      return;
    }

    setIsLoading(true);

    try {
      const goal: GroupGoal = {
        id: `group_${Date.now()}`,
        name: name.trim(),
        description: description.trim() || undefined,
        targetAmount: numAmount,
        currency,
        participants: participantList,
        createdAt: new Date()
      };

      onSubmit(goal);
      
      // Reset form
      setName('');
      setDescription('');
      setTargetAmount('');
      setCurrency('GHS');
      setParticipants('');
      
      toast.success('Group goal created successfully!');
    } catch {
      toast.error('Failed to create group goal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          Create New Group Goal
        </CardTitle>
        <CardDescription>
          Set up a shared savings goal for your group
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Group Name *</label>
            <Input
              placeholder="e.g., Vacation Fund, Wedding Savings"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              placeholder="Describe the purpose of this group savings goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Amount *</label>
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
                  required
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Participants *</label>
            <Input
              placeholder="Enter names separated by commas (e.g., John, Sarah, Mike)"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Separate multiple names with commas
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !name.trim() || !targetAmount || !participants.trim()}
          >
            {isLoading ? 'Creating Group Goal...' : 'Create Group Goal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 