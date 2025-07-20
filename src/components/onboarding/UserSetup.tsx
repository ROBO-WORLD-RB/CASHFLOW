'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, User, DollarSign, ArrowRight, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WORLD_CURRENCIES, SupportedCurrency } from '@/lib/currencyUtils';
import { toast } from 'sonner';

const userSetupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  currency: z.string().min(3, 'Please select a currency'),
});

type UserSetupFormData = z.infer<typeof userSetupSchema>;

interface UserSetupProps {
  onComplete: (userData: { name: string; currency: SupportedCurrency }) => void;
}

export function UserSetup({ onComplete }: UserSetupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [showCurrencyList, setShowCurrencyList] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm<UserSetupFormData>({
    resolver: zodResolver(userSetupSchema),
    mode: 'onChange'
  });

  // Filter currencies based on search term
  const filteredCurrencies = WORLD_CURRENCIES.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    setValue('currency', currencyCode, { shouldValidate: true });
    setShowCurrencyList(false);
    setSearchTerm('');
  };

  const onSubmit = (data: UserSetupFormData) => {
    try {
      onComplete({
        name: data.name,
        currency: data.currency as SupportedCurrency
      });
      toast.success('Welcome to BudgetUp! Let\'s start managing your finances.');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const selectedCurrencyInfo = WORLD_CURRENCIES.find(c => c.code === selectedCurrency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <Wallet className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome to BudgetUp
          </h1>
          <p className="text-xl text-gray-600 mb-2">Global Financial Management Made Simple</p>
          <p className="text-gray-500">Let's get you started with personalized financial tracking</p>
        </div>

        {/* Setup Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-800">Tell us about yourself</CardTitle>
            <CardDescription className="text-gray-600">
              We'll customize BudgetUp to work perfectly with your local currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  What's your name?
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  className="h-12 text-lg"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Currency Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  What's your primary currency?
                </label>
                
                {/* Selected Currency Display */}
                <div 
                  className="h-12 px-4 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => setShowCurrencyList(!showCurrencyList)}
                >
                  {selectedCurrencyInfo ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedCurrencyInfo.symbol}</span>
                      <div>
                        <span className="font-medium">{selectedCurrencyInfo.code}</span>
                        <span className="text-gray-500 ml-2">{selectedCurrencyInfo.name}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select your currency</span>
                  )}
                  <ArrowRight className={`h-4 w-4 text-gray-400 transition-transform ${showCurrencyList ? 'rotate-90' : ''}`} />
                </div>

                {errors.currency && (
                  <p className="text-sm text-red-600">{errors.currency.message}</p>
                )}

                {/* Currency List */}
                {showCurrencyList && (
                  <Card className="max-h-80 overflow-hidden border border-gray-200">
                    <CardContent className="p-0">
                      {/* Search */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search currencies..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {/* Currency Options */}
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCurrencies.map((currency) => (
                          <div
                            key={currency.code}
                            className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                            onClick={() => handleCurrencySelect(currency.code)}
                          >
                            <span className="text-2xl w-8 text-center">{currency.symbol}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{currency.code}</span>
                                {selectedCurrency === currency.code && (
                                  <Check className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div className="text-sm text-gray-600">{currency.name}</div>
                              <div className="text-xs text-gray-500">{currency.country}</div>
                            </div>
                          </div>
                        ))}
                        
                        {filteredCurrencies.length === 0 && (
                          <div className="p-4 text-center text-gray-500">
                            No currencies found matching "{searchTerm}"
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                disabled={!isValid}
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Start Managing My Finances
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            🌍 Supporting {WORLD_CURRENCIES.length}+ currencies worldwide
          </p>
        </div>
      </div>
    </div>
  );
}