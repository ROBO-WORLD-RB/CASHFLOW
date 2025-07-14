export interface LocalCost {
  category: string;
  averageCostGHS: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  description?: string;
}

export async function getAverageLocalCosts(): Promise<LocalCost[]> {
  // Simulated data based on average costs in Ghana
  const costs: LocalCost[] = [
    {
      category: 'Rent (1-bedroom apartment)',
      averageCostGHS: 1500,
      frequency: 'monthly',
      description: 'Average rent for a 1-bedroom apartment in Accra'
    },
    {
      category: 'Food (per person)',
      averageCostGHS: 800,
      frequency: 'monthly',
      description: 'Average monthly food expenses for one person'
    },
    {
      category: 'Transportation',
      averageCostGHS: 300,
      frequency: 'monthly',
      description: 'Average monthly transportation costs (trotro, taxi)'
    },
    {
      category: 'Mobile Data',
      averageCostGHS: 100,
      frequency: 'monthly',
      description: 'Average monthly mobile data and airtime'
    },
    {
      category: 'Utilities',
      averageCostGHS: 200,
      frequency: 'monthly',
      description: 'Electricity, water, and other utilities'
    },
    {
      category: 'Healthcare',
      averageCostGHS: 150,
      frequency: 'monthly',
      description: 'Average monthly healthcare expenses'
    },
    {
      category: 'Entertainment',
      averageCostGHS: 200,
      frequency: 'monthly',
      description: 'Movies, restaurants, and leisure activities'
    },
    {
      category: 'Education',
      averageCostGHS: 500,
      frequency: 'monthly',
      description: 'School fees, books, and educational materials'
    },
    {
      category: 'Clothing',
      averageCostGHS: 150,
      frequency: 'monthly',
      description: 'Average monthly clothing expenses'
    },
    {
      category: 'Savings',
      averageCostGHS: 500,
      frequency: 'monthly',
      description: 'Recommended monthly savings amount'
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return costs;
} 