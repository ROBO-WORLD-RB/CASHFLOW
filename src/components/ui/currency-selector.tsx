'use client';

import { useState } from 'react';
import { Check, ChevronDown, Search, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WORLD_CURRENCIES, SupportedCurrency, getCurrencySymbol } from '@/lib/currencyUtils';
import { useCurrency } from '@/hooks/useCurrency';

interface CurrencySelectorProps {
  selectedCurrency?: SupportedCurrency;
  onCurrencyChange?: (currency: SupportedCurrency) => void;
  className?: string;
}

export function CurrencySelector({ selectedCurrency, onCurrencyChange, className }: CurrencySelectorProps) {
  const { currentCurrency, setCurrency, isLoading } = useCurrency();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use centralized currency if no props provided
  const activeCurrency = selectedCurrency || currentCurrency;
  const handleCurrencyChange = onCurrencyChange || setCurrency;

  // Filter currencies based on search term
  const filteredCurrencies = WORLD_CURRENCIES.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCurrencySelect = (currencyCode: SupportedCurrency) => {
    handleCurrencyChange(currencyCode);
    setOpen(false);
    setSearchTerm('');
  };

  const selectedCurrencyInfo = WORLD_CURRENCIES.find(c => c.code === activeCurrency);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isLoading}
          className={`justify-between min-w-[200px] ${className}`}
        >
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
            ) : (
              <Globe className="h-4 w-4 text-gray-500" />
            )}
            {selectedCurrencyInfo ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedCurrencyInfo.symbol}</span>
                <span className="font-medium">{selectedCurrencyInfo.code}</span>
                <span className="text-gray-500 hidden sm:inline">- {selectedCurrencyInfo.name}</span>
              </div>
            ) : (
              <span>Select currency...</span>
            )}
          </div>
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search currencies..."
                  className="pl-10 border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Currency Options */}
            <div className="max-h-80 overflow-y-auto">
              {filteredCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                  onClick={() => handleCurrencySelect(currency.code as SupportedCurrency)}
                >
                  <span className="text-2xl w-8 text-center">{currency.symbol}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{currency.code}</span>
                      {activeCurrency === currency.code && (
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
      </PopoverContent>
    </Popover>
  );
}