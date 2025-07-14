export const SUPPORTED_CURRENCIES = ['GHS', 'USD', 'EUR'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

// Static exchange rates (approximate)
const EXCHANGE_RATES = {
  USD: { GHS: 14.5, EUR: 0.92 },
  EUR: { GHS: 15.75, USD: 1.09 },
  GHS: { USD: 0.069, EUR: 0.063 }
} as const;

export function convertCurrency(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRates = EXCHANGE_RATES[fromCurrency];
  if (!fromRates || !(toCurrency in fromRates)) {
    throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
  }

  return amount * fromRates[toCurrency as keyof typeof fromRates];
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency,
  locale: string = 'en-GH'
): string {
  const currencyMap = {
    GHS: 'GHS',
    USD: 'USD',
    EUR: 'EUR'
  };

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyMap[currency],
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatGHS(amount: number): string {
  return formatCurrency(amount, 'GHS');
} 