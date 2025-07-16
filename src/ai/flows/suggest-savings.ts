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
    console.log('Starting suggestSavings with input:', input);

    // Check if API key is available
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    // For now, let's use mock data to test the AI functionality
    const mockSpendingSummary = "Total income: GHS 5000.00. Total expenses: GHS 3500.00. Spending by category: Food: GHS 800.00, Transport: GHS 600.00, Data: GHS 300.00, Other: GHS 1800.00";
    const mockLocalCosts = "Average monthly costs in Ghana: Food: GHS 800, Transport: GHS 500, Utilities: GHS 200, Data: GHS 250";

    console.log('Calling AI with model: gemini-1.5-flash');

    // Generate AI response
    const result = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: `You are a friendly personal finance advisor for Ghana. 

User Query: ${input.userQuery}
User's Spending Summary: ${mockSpendingSummary}
Local Costs Context: ${mockLocalCosts}

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

    console.log('AI response received:', result.text);

    const response = result.text;

    // Parse the response
    const suggestedMatch = response.match(/SUGGESTED_SAVINGS:\s*(\d+(?:\.\d+)?)/);
    const rationaleMatch = response.match(/RATIONALE:\s*([\s\S]+)/);

    const suggestedSavingsGHS = suggestedMatch ? parseFloat(suggestedMatch[1]) : 500;
    const savingsRationale = rationaleMatch ? rationaleMatch[1].trim() : response;

    console.log('Parsed result:', { suggestedSavingsGHS, savingsRationale });

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