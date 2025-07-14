'use server';

import { ai } from '../ai-instance';
import { getMobileMoneyTransactions } from '@/services/mobile-money';
import { getAverageLocalCosts } from '@/services/local-cost';

export interface SuggestSavingsInput {
  userId: string;
  userQuery: string;
}

export interface SuggestSavingsOutput {
  suggestedSavingsGHS: number;
  savingsRationale: string;
}

export async function suggestSavings(input: SuggestSavingsInput): Promise<SuggestSavingsOutput> {
  try {
    // Fetch user's mobile money transactions
    const transactions = await getMobileMoneyTransactions();
    
    // Calculate spending summary
    const totalIncome = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amountGHS, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amountGHS, 0);
    
    const spendingByCategory = transactions
      .filter(t => t.type === 'debit')
      .reduce((acc, t) => {
        const category = t.category || 'Other';
        acc[category] = (acc[category] || 0) + t.amountGHS;
        return acc;
      }, {} as Record<string, number>);
    
    const spendingSummary = `Total income: GHS ${totalIncome.toFixed(2)}. Total expenses: GHS ${totalExpenses.toFixed(2)}. Spending by category: ${Object.entries(spendingByCategory).map(([cat, amt]) => `${cat}: GHS ${amt.toFixed(2)}`).join(', ')}`;
    
    // Fetch local costs
    const localCosts = await getAverageLocalCosts();
    const localCostsSummary = `Average monthly costs in Ghana: ${localCosts.map(cost => `${cost.category}: GHS ${cost.averageCostGHS}`).join(', ')}`;
    
    // Generate AI response
    const result = await ai.generate({
      model: 'gemini-1.5-flash',
      system: `You are an AI financial advisor. Always respond strictly in the following format, with no extra text or explanation:
SUGGESTED_SAVINGS: [number in GHS]
RATIONALE: [detailed explanation]`,
      prompt: `You are a friendly personal finance advisor for Ghana. Your role is to help users understand their spending patterns and suggest realistic savings strategies.

User Query: ${input.userQuery}
User's Spending Summary: ${spendingSummary}
Local Costs Context: ${localCostsSummary}

Instructions:
1. Understand the user's financial goal from their query
2. Estimate their income if mentioned, otherwise state your assumptions
3. Suggest a realistic monthly savings amount in GHS (0 if not feasible)
4. Provide clear rationale referencing their query, income, spending patterns, and local costs
5. If the query is vague, ask for more specific details
6. Be encouraging and practical, considering Ghanaian context

Respond in this exact format:
SUGGESTED_SAVINGS: [number in GHS]
RATIONALE: [detailed explanation]`,
    });
    
    const response = result.text;
    
    // Parse the response
    const suggestedMatch = response.match(/SUGGESTED_SAVINGS:\s*(\d+(?:\.\d+)?)/);
    const rationaleMatch = response.match(/RATIONALE:\s*([\s\S]+)/);
    
    const suggestedSavingsGHS = suggestedMatch ? parseFloat(suggestedMatch[1]) : 0;
    const savingsRationale = rationaleMatch ? rationaleMatch[1].trim() : 'Unable to provide specific advice at this time.';
    
    return {
      suggestedSavingsGHS,
      savingsRationale
    };
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('Error in suggestSavings flow:', error.response);
    } else {
      console.error('Error in suggestSavings flow:', error);
    }
    return {
      suggestedSavingsGHS: 0,
      savingsRationale: 'Sorry, I encountered an error while analyzing your financial situation. Please try again.'
    };
  }
} 