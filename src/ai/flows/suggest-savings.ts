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


    // Check if API key is available
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    // Get real user data from services
    const [spendingSummary, localCosts] = await Promise.all([
      getMobileMoneyTransactions(),
      getAverageLocalCosts()
    ]);

    // Format spending summary
    const totalIncome = spendingSummary
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amountGHS, 0);

    const totalExpenses = spendingSummary
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amountGHS, 0);

    // Group expenses by category
    const expensesByCategory = spendingSummary
      .filter(t => t.type === 'debit')
      .reduce((acc, t) => {
        const category = t.category || 'Other';
        acc[category] = (acc[category] || 0) + t.amountGHS;
        return acc;
      }, {} as Record<string, number>);

    const spendingSummaryText = `Total income: GHS ${totalIncome.toFixed(2)}. Total expenses: GHS ${totalExpenses.toFixed(2)}. Spending by category: ${Object.entries(expensesByCategory).map(([cat, amount]) => `${cat}: GHS ${amount.toFixed(2)}`).join(', ')}`;

    const localCostsText = `Average monthly costs in Ghana: ${localCosts.map(cost => `${cost.category}: GHS ${cost.averageCostGHS}`).join(', ')}`;

    // Generate AI response
    const result = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: `You are a friendly personal finance advisor for Ghana. 

User Query: ${input.userQuery}
User's Spending Summary: ${spendingSummaryText}
Local Costs Context: ${localCostsText}

Provide savings advice in this exact format:
SUGGESTED_SAVINGS: [number in GHS]
RATIONALE: 
• Income Analysis: [brief analysis of their income situation]
• Spending Review: [key observations about their spending patterns]
• Savings Strategy: [specific actionable steps to achieve the savings goal]
• Budget Recommendations: [practical tips for reducing expenses]
• Emergency Fund: [advice on building emergency savings]
• Next Steps: [what they should do immediately]

Be practical, encouraging, and consider Ghanaian economic context. Use bullet points for clarity and avoid markdown formatting like ** or ##.`
    });

    const response = result.text;

    // Parse the response
    const suggestedMatch = response.match(/SUGGESTED_SAVINGS:\s*(\d+(?:\.\d+)?)/);
    const rationaleMatch = response.match(/RATIONALE:\s*([\s\S]+)/);

    const suggestedSavingsGHS = suggestedMatch ? parseFloat(suggestedMatch[1]) : 500;
    const savingsRationale = rationaleMatch ? rationaleMatch[1].trim() : response;

    return {
      suggestedSavingsGHS,
      savingsRationale
    };
  } catch (error) {
    console.error('Error in suggestSavings flow:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      apiKey: process.env.GOOGLE_AI_API_KEY ? 'API key is set' : 'API key is missing',
      apiKeyLength: process.env.GOOGLE_AI_API_KEY?.length || 0
    });

    return {
      suggestedSavingsGHS: 0,
      savingsRationale: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please check your API key configuration.`
    };
  }
} 