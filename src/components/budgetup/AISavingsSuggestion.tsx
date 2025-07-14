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
          <div className="mt-6 space-y-4 p-4 bg-blue-50 rounded-lg border">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Suggested Monthly Savings:</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatGHS(suggestion.suggestedSavingsGHS)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Rationale & Advice:</h4>
              <div className="max-h-60 overflow-y-auto">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {suggestion.savingsRationale}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 