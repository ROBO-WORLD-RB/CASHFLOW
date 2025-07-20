'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Send, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestSavings } from '@/ai/flows/suggest-savings';
import { toast } from 'sonner';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useCurrency } from '@/hooks/useCurrency';
import { aiQuerySchema, AIQueryFormData } from '@/lib/validations';
import { withErrorHandling } from '@/lib/error-handler';

export function AISavingsSuggestion() {
  const { getTotalIncome, getTotalExpenses } = useFinancialStore();
  const { formatCurrency } = useCurrency();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AIQueryFormData>({
    resolver: zodResolver(aiQuerySchema),
    defaultValues: {
      userId: 'demo-user'
    }
  });

  const [suggestion, setSuggestion] = useState<{
    suggestedSavingsGHS: number;
    savingsRationale: string;
  } | null>(null);

  const onSubmit = async (data: AIQueryFormData) => {
    const result = await withErrorHandling(async () => {
      const response = await suggestSavings({
        userId: 'demo-user',
        userQuery: data.query
      });
      
      setSuggestion(response);
      toast.success('AI advice generated successfully!');
      return response;
    }, 'AI Savings Suggestion');

    if (!result) {
      setSuggestion(null);
    }
  };

  // Show user's current financial summary
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const availableBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Financial Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <TrendingUp className="h-5 w-5" />
            Your Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Income</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expenses</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className={`text-lg font-bold ${availableBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(availableBalance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Advisor Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Financial Advisor
          </CardTitle>
          <CardDescription>
            Get personalized savings advice based on your spending patterns and global financial insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ask your financial question:</label>
              <Textarea
                placeholder="e.g., I earn 5000 GHS a month and spend a lot on data, how can I save more?"
                className="min-h-[100px]"
                {...register('query')}
              />
              {errors.query && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.query.message}
                </p>
              )}
            </div>
            
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
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
          </form>

          {suggestion && (
          <div className="mt-6 space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
            <div className="text-center space-y-2 pb-4 border-b border-blue-200">
              <h4 className="font-semibold text-blue-800 text-lg">💰 Suggested Monthly Savings</h4>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(suggestion.suggestedSavingsGHS)}
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
    </div>
  );
} 