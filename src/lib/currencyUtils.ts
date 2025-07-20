// Comprehensive list of world currencies
export const WORLD_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', country: 'New Zealand' },
  
  // African Currencies
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', country: 'Ghana' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', country: 'Nigeria' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: 'Kenya' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', country: 'Uganda' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', country: 'Tanzania' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', country: 'Egypt' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', country: 'Morocco' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', country: 'Ethiopia' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', country: 'West Africa' },
  
  // Asian Currencies
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', country: 'South Korea' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', country: 'Hong Kong' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', country: 'Malaysia' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', country: 'Thailand' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', country: 'Philippines' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', country: 'Indonesia' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', country: 'Vietnam' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', country: 'Pakistan' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', country: 'Bangladesh' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: '₨', country: 'Sri Lanka' },
  
  // Middle Eastern Currencies
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', country: 'United Arab Emirates' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', country: 'Saudi Arabia' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', country: 'Qatar' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', country: 'Kuwait' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', country: 'Bahrain' },
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼', country: 'Oman' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', country: 'Jordan' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', country: 'Israel' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', country: 'Turkey' },
  
  // Latin American Currencies
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'Brazil' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', country: 'Mexico' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', country: 'Argentina' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', country: 'Chile' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', country: 'Colombia' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', country: 'Peru' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', country: 'Uruguay' },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.S', country: 'Venezuela' },
  
  // European Currencies (Non-Euro)
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'Denmark' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', country: 'Poland' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', country: 'Czech Republic' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', country: 'Hungary' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', country: 'Romania' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', country: 'Bulgaria' },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', country: 'Croatia' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин', country: 'Serbia' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', country: 'Russia' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', country: 'Ukraine' },
  
  // Other Major Currencies
  { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', country: 'Iceland' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$', country: 'Nicaragua' },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', country: 'Costa Rica' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', country: 'Guatemala' },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L', country: 'Honduras' },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', country: 'Panama' },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', country: 'Dominican Republic' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', country: 'Jamaica' },
  { code: 'TTD', name: 'Trinidad Dollar', symbol: 'TT$', country: 'Trinidad and Tobago' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$', country: 'Barbados' }
] as const;

export const SUPPORTED_CURRENCIES = WORLD_CURRENCIES.map(c => c.code);
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

// Basic exchange rates (in a real app, these would come from an API)
const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: { EUR: 0.85, GBP: 0.73, JPY: 110, AUD: 1.35, CAD: 1.25, GHS: 12.0, NGN: 460, INR: 74, BRL: 5.2, MXN: 17.5 },
  EUR: { USD: 1.18, GBP: 0.86, JPY: 130, AUD: 1.59, CAD: 1.47, GHS: 14.1, NGN: 542, INR: 87, BRL: 6.1, MXN: 20.6 },
  GBP: { USD: 1.37, EUR: 1.16, JPY: 151, AUD: 1.85, CAD: 1.71, GHS: 16.4, NGN: 630, INR: 101, BRL: 7.1, MXN: 24.0 },
  GHS: { USD: 0.083, EUR: 0.071, GBP: 0.061, JPY: 9.2, AUD: 0.112, CAD: 0.104, NGN: 38.3, INR: 6.2, BRL: 0.43, MXN: 1.46 },
  NGN: { USD: 0.0022, EUR: 0.0018, GBP: 0.0016, JPY: 0.24, AUD: 0.0029, CAD: 0.0027, GHS: 0.026, INR: 0.16, BRL: 0.011, MXN: 0.038 },
  INR: { USD: 0.014, EUR: 0.011, GBP: 0.0099, JPY: 1.49, AUD: 0.018, CAD: 0.017, GHS: 0.16, NGN: 6.2, BRL: 0.070, MXN: 0.24 },
  BRL: { USD: 0.19, EUR: 0.16, GBP: 0.14, JPY: 21.2, AUD: 0.26, CAD: 0.24, GHS: 2.33, NGN: 88.4, INR: 14.3, MXN: 3.37 },
  MXN: { USD: 0.057, EUR: 0.049, GBP: 0.042, JPY: 6.3, AUD: 0.077, CAD: 0.071, GHS: 0.68, NGN: 26.2, INR: 4.2, BRL: 0.30 },
  JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, AUD: 0.012, CAD: 0.011, GHS: 0.11, NGN: 4.2, INR: 0.67, BRL: 0.047, MXN: 0.16 },
  AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.5, CAD: 0.93, GHS: 8.9, NGN: 340, INR: 55, BRL: 3.9, MXN: 13.0 },
  CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 88, AUD: 1.08, GHS: 9.6, NGN: 368, INR: 59, BRL: 4.2, MXN: 14.0 }
};

export function convertCurrency(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Try to get cached conversion rate first
  const { getCachedConversion, setCachedConversion } = require('./currencyCache');
  const cachedRate = getCachedConversion(fromCurrency, toCurrency);
  
  if (cachedRate !== null) {
    return amount * cachedRate;
  }

  // Calculate conversion rate
  let conversionRate: number;
  const fromRates = EXCHANGE_RATES[fromCurrency];
  
  if (!fromRates || !(toCurrency in fromRates)) {
    // Fallback: if direct conversion not available, try via USD
    if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      try {
        const usdRate = convertCurrency(1, fromCurrency, 'USD');
        const targetRate = convertCurrency(1, 'USD', toCurrency);
        conversionRate = usdRate * targetRate;
      } catch {
        // If USD conversion also fails, return original amount
        console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}, returning original amount`);
        return amount;
      }
    } else {
      // If still no rate found, return original amount
      console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}, returning original amount`);
      return amount;
    }
  } else {
    conversionRate = fromRates[toCurrency as keyof typeof fromRates];
  }

  // Cache the conversion rate for future use
  setCachedConversion(fromCurrency, toCurrency, conversionRate);

  return amount * conversionRate;
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency,
  locale: string = 'en-US'
): string {
  // Try to get cached format first
  const { getCachedFormat, setCachedFormat } = require('./currencyCache');
  const cachedFormat = getCachedFormat(amount, currency, locale);
  
  if (cachedFormat !== null) {
    return cachedFormat;
  }

  const currencyInfo = WORLD_CURRENCIES.find(c => c.code === currency);
  let formatted: string;
  
  try {
    formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback to symbol + amount if currency not supported by Intl
    const symbol = currencyInfo?.symbol || currency;
    formatted = `${symbol}${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Cache the formatted result for future use
  setCachedFormat(amount, currency, formatted, locale);
  
  return formatted;
}

export function getCurrencySymbol(currency: SupportedCurrency): string {
  const currencyInfo = WORLD_CURRENCIES.find(c => c.code === currency);
  return currencyInfo?.symbol || currency;
}

export function getCurrencyName(currency: SupportedCurrency): string {
  const currencyInfo = WORLD_CURRENCIES.find(c => c.code === currency);
  return currencyInfo?.name || currency;
}

export function formatGHS(amount: number): string {
  return formatCurrency(amount, 'GHS');
} 