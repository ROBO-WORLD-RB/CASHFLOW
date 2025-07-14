'use client';

import { useState } from 'react';
import { PlusCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatCurrency, convertCurrency, SupportedCurrency } from '@/lib/currencyUtils';
import { AddContributionForm } from './AddContributionForm';

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

interface GroupGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currency: SupportedCurrency;
  participants: string[];
  createdAt: Date;
}

interface GroupSavingsTrackerTableProps {
  groupGoals: GroupGoal[];
  groupContributions: GroupContribution[];
  onAddContribution: (groupId: string, contribution: Omit<GroupContribution, 'id'>) => void;
}

export function GroupSavingsTrackerTable({ 
  groupGoals, 
  groupContributions, 
  onAddContribution 
}: GroupSavingsTrackerTableProps) {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const calculateGroupProgress = (goal: GroupGoal) => {
    const contributions = groupContributions.filter(c => c.groupId === goal.id);
    const totalSavedGHS = contributions.reduce((sum, c) => {
      return sum + convertCurrency(c.amount, c.currency, 'GHS');
    }, 0);
    
    const targetGHS = convertCurrency(goal.targetAmount, goal.currency, 'GHS');
    const progress = targetGHS > 0 ? (totalSavedGHS / targetGHS) * 100 : 0;
    
    return {
      totalSavedGHS,
      targetGHS,
      progress: Math.min(progress, 100)
    };
  };

  const handleAddContribution = (groupId: string, contribution: Omit<GroupContribution, 'id'>) => {
    onAddContribution(groupId, contribution);
    setOpenPopoverId(null);
  };

  if (groupGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Group Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No group goals created yet</p>
            <p className="text-sm mt-2">Create a group goal to start tracking shared savings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Group Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Saved (Est. GHS)</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupGoals.map((goal) => {
                const { totalSavedGHS, progress } = calculateGroupProgress(goal);
                
                return (
                  <TableRow key={goal.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{goal.name}</p>
                        {goal.description && (
                          <p className="text-sm text-gray-500">{goal.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(goal.targetAmount, goal.currency)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(totalSavedGHS, 'GHS')}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-gray-600">{Math.round(progress)}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{goal.participants.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Popover 
                        open={openPopoverId === goal.id}
                        onOpenChange={(open) => setOpenPopoverId(open ? goal.id : null)}
                      >
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="outline">
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add Contribution
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <AddContributionForm
                            groupGoal={goal}
                            onSubmit={(contribution) => handleAddContribution(goal.id, contribution)}
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 