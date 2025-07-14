'use client';

import { useState } from 'react';
import { DollarSign, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
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

interface AddContributionFormProps {
  groupGoal: GroupGoal;
  onSubmit: (contribution: Omit<GroupContribution, 'id'>) => void;
}

export function AddContributionForm({ groupGoal, onSubmit }: AddContributionFormProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<SupportedCurrency>('GHS');
  const [participantName, setParticipantName] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !participantName || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!groupGoal.participants.includes(participantName)) {
      toast.error('Please select a valid participant from the group');
      return;
    }

    setIsLoading(true);

    try {
      const contribution: Omit<GroupContribution, 'id'> = {
        groupId: groupGoal.id,
        amount: numAmount,
        currency,
        participantName,
        date,
        time,
        description: description.trim() || undefined
      };

      onSubmit(contribution);
      
      // Reset form
      setAmount('');
      setCurrency('GHS');
      setParticipantName('');
      setDate(new Date());
      setTime('');
      setDescription('');
      
      toast.success('Contribution added successfully!');
    } catch {
      toast.error('Failed to add contribution');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Add Contribution</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount *</label>
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

          <div className="grid grid-cols-2 gap-3">
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Participant *</label>
              <Select value={participantName} onValueChange={setParticipantName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select participant" />
                </SelectTrigger>
                <SelectContent>
                  {groupGoal.participants.map((participant) => (
                    <SelectItem key={participant} value={participant}>
                      {participant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, 'MMM dd') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Input
              placeholder="Brief description of the contribution"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !amount || !participantName || !date || !time}
          >
            {isLoading ? 'Adding...' : 'Add Contribution'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 