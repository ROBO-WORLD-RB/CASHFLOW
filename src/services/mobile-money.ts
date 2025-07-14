export interface MobileMoneyTransaction {
  id: string;
  type: 'credit' | 'debit';
  amountGHS: number;
  description: string;
  timestamp: Date;
  category?: string;
}

export async function getMobileMoneyTransactions(): Promise<MobileMoneyTransaction[]> {
  // Simulated data - in a real app, this would fetch from an API
  const transactions: MobileMoneyTransaction[] = [
    {
      id: '1',
      type: 'credit',
      amountGHS: 5000,
      description: 'Salary payment',
      timestamp: new Date('2024-01-15'),
      category: 'Income'
    },
    {
      id: '2',
      type: 'debit',
      amountGHS: 120,
      description: 'Mobile data bundle',
      timestamp: new Date('2024-01-16'),
      category: 'Communication'
    },
    {
      id: '3',
      type: 'debit',
      amountGHS: 800,
      description: 'Rent payment',
      timestamp: new Date('2024-01-17'),
      category: 'Housing'
    },
    {
      id: '4',
      type: 'debit',
      amountGHS: 300,
      description: 'Food and groceries',
      timestamp: new Date('2024-01-18'),
      category: 'Food'
    },
    {
      id: '5',
      type: 'debit',
      amountGHS: 150,
      description: 'Transportation',
      timestamp: new Date('2024-01-19'),
      category: 'Transport'
    },
    {
      id: '6',
      type: 'credit',
      amountGHS: 2000,
      description: 'Freelance payment',
      timestamp: new Date('2024-01-20'),
      category: 'Income'
    },
    {
      id: '7',
      type: 'debit',
      amountGHS: 250,
      description: 'Utilities',
      timestamp: new Date('2024-01-21'),
      category: 'Utilities'
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return transactions;
} 