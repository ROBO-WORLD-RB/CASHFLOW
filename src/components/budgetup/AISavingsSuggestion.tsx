'use client';

import { useState } from 'react';
import { Brain, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestSavings } from '@/ai/flows/suggest-savings';
import { formatGHS } from '@/lib/currencyUtils';
import { toast } from 'sonner';

interface AISavingsSuggestionProps {
  userId: string;
}

export function AISavingsSuggestion({ userId }: AISavingsSuggestionProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    suggestedSavingsGHS: number;
    savingsRationale: string;
  } | null>(null);

  const handleGetAdvice = async () => {
    if (!query.trim()) {
      toast.error('Please enter your financial question');
      return;
    }

    setIsLoading(true);
    setSuggestion(null);

    try {
      const result = await suggestSavings({
        userId,
        userQuery: query.trim()
      });

      setSuggestion(result);
      toast.success('AI advice generated successfully!');
    } catch (error) {
      console.error('Error getting AI advice:', error);
      toast.error('Failed to get AI advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Financial Advisor
        </CardTitle>
        <CardDescription>
          Get personalized savings advice based on your spending patterns and local Ghanaian costs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ask your financial question:</label>
          <Textarea
            placeholder="e.g., I earn 5000 GHS a month and spend a lot on data, how can I save more?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px]"
            disabled={isLoading}
          />
        </div>
        
        <Button 
          onClick={handleGetAdvice}
          disabled={isLoading || !query.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Getting Advice...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Get Savings Advice
            </>
          )}
        </Button>

        {suggestion && (
          <div className="mt-6 space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
            <div className="text-center space-y-2 pb-4 border-b border-blue-200">
              <h4 className="font-semibold text-blue-800 text-lg">💰 Suggested Monthly Savings</h4>
              <p className="text-3xl font-bold text-blue-600">
                {formatGHS(suggestion.suggestedSavingsGHS)}
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800 text-lg flex items-center gap-2">
                <span>📋</span> Personalized Financial Advice
              </h4>
              <div className="max-h-80 overflow-y-auto pr-2">
                <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                  {suggestion.savingsRationale.split('•').filter(item => item.trim()).map((item, index) => {
                    const trimmedItem = item.trim();
                    if (!trimmedItem) return null;
                    
                    // Extract the category and content
                    const colonIndex = trimmedItem.indexOf(':');
                    if (colonIndex > 0) {
                      const category = trimmedItem.substring(0, colonIndex).trim();
                      const content = trimmedItem.substring(colonIndex + 1).trim();
                      
                      // Get emoji for category
                      const getEmoji = (cat: string) => {
                        if (cat.toLowerCase().includes('income')) return '💵';
                        if (cat.toLowerCase().includes('spending')) return '📊';
                        if (cat.toLowerCase().includes('strategy')) return '🎯';
                        if (cat.toLowerCase().includes('budget')) return '📝';
                        if (cat.toLowerCase().includes('emergency')) return '🛡️';
                        if (cat.toLowerCase().includes('next')) return '🚀';
                        return '💡';
                      };
                      
                      return (
                        <div key={index} className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                          <div className="flex items-start gap-3">
                            <span className="text-lg flex-shrink-0 mt-0.5">{getEmoji(category)}</span>
                            <div className="flex-1">
                              <h5 className="font-medium text-blue-700 mb-2">{category}</h5>
                              <p className="text-gray-600 leading-relaxed">{content}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={index} className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-gray-600">{trimmedItem}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 