'use server';

import { ai } from '../ai-instance';
import { getMobileMoneyTransactions } from '@/services/mobile-money';
import { getAverageLocalCosts } from '@/services/local-cost';

export interface SuggestSavingsInput {
  userId: string;
  userQuery: string;
  userCurrency?: string;
}

export interface SuggestSavingsOutput {
  suggestedSavings: number;
  currency: string;
  savingsRationale: string;
}

export async function suggestSavings(input: SuggestSavingsInput): Promise<SuggestSavingsOutput> {
  try {
    // Check if API key is available
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }

    // Detect currency from user query or use provided currency
    const detectCurrencyFromQuery = (query: string): string => {
      const currencyPatterns = [
        { pattern: /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g, currency: 'USD' },
        { pattern: /€(\d+(?:,\d{3})*(?:\.\d{2})?)/g, currency: 'EUR' },
        { pattern: /£(\d+(?:,\d{3})*(?:\.\d{2})?)/g, currency: 'GBP' },
        { pattern: /₵(\d+(?:,\d{3})*(?:\.\d{2})?)/g, currency: 'GHS' },
        { pattern: /₦(\d+(?:,\d{3})*(?:\.\d{2})?)/g, currency: 'NGN' },
        { pattern: /₹(\d+(?:,\d{3})*(?:\.\d{2})?)/g, currency: 'INR' },
        { pattern: /¥(\d+(?:,\d{3})*(?:\.\d{2})?)/g, currency: 'JPY' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*USD)/gi, currency: 'USD' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*EUR)/gi, currency: 'EUR' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*GBP)/gi, currency: 'GBP' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*GHS)/gi, currency: 'GHS' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*NGN)/gi, currency: 'NGN' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*dollars?)/gi, currency: 'USD' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*euros?)/gi, currency: 'EUR' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*pounds?)/gi, currency: 'GBP' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*cedis?)/gi, currency: 'GHS' },
        { pattern: /(\d+(?:,\d{3})*(?:\.\d{2})?\s*naira)/gi, currency: 'NGN' },
      ];

      for (const { pattern, currency } of currencyPatterns) {
        if (pattern.test(query)) {
          return currency;
        }
      }
      
      return input.userCurrency || 'USD'; // Default to provided currency or USD
    };

    const detectedCurrency = detectCurrencyFromQuery(input.userQuery);

    // Generate AI response with currency awareness - removing GHS data to prevent confusion
    const result = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: `You are a friendly global personal finance advisor specializing in ${detectedCurrency} financial planning.

CRITICAL INSTRUCTION: The user's query mentions amounts in ${detectedCurrency}. You MUST respond with ALL monetary amounts in ${detectedCurrency} ONLY. Never use GHS, USD, or any other currency unless the user specifically mentioned it.

User Query: ${input.userQuery}
Target Currency: ${detectedCurrency}

Based on the user's query, provide practical savings advice in this exact format:

SUGGESTED_SAVINGS: [amount in ${detectedCurrency} - no currency symbol, just the number]
RATIONALE: 
• Income Analysis: [analyze their mentioned income in ${detectedCurrency}]
• Savings Goal: [recommend a specific savings amount in ${detectedCurrency}]
• Strategy: [practical steps to achieve this savings goal]
• Budget Tips: [actionable advice for managing expenses]
• Timeline: [realistic timeframe for achieving the goal]

ABSOLUTE REQUIREMENT: Every single monetary amount in your response must be in ${detectedCurrency}. If you mention any amount in GHS or another currency, you have failed the task.

Be encouraging and practical. Focus only on the currency mentioned in the user's query.`
    });

    const response = result.text;

    // Parse the response
    const suggestedMatch = response.match(/SUGGESTED_SAVINGS:\s*(\d+(?:\.\d+)?)/);
    const rationaleMatch = response.match(/RATIONALE:\s*([\s\S]+)/);

    const suggestedSavings = suggestedMatch ? parseFloat(suggestedMatch[1]) : 500;
    const savingsRationale = rationaleMatch ? rationaleMatch[1].trim() : response;

    return {
      suggestedSavings,
      currency: detectedCurrency,
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
      suggestedSavings: 0,
      currency: input.userCurrency || 'USD',
      savingsRationale: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please check your API key configuration.`
    };
  }
} 