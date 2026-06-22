// Currency + region config for international pricing.
// Region → which currency to show and which product price field to read.
// Base price (MAD) lives in product.price; EUR/USD are manual per-product (priceEUR/priceUSD).

export const REGIONS = ['MA', 'EU', 'US', 'OTHER'];

export const REGION_CONFIG = {
  MA: { currency: 'MAD', symbol: 'DH', priceField: 'price', locale: 'fr-MA', label: 'Maroc', flag: '🇲🇦' },
  EU: { currency: 'EUR', symbol: '€', priceField: 'priceEUR', locale: 'fr-FR', label: 'Europe', flag: '🇪🇺' },
  US: { currency: 'USD', symbol: '$', priceField: 'priceUSD', locale: 'en-US', label: 'USA', flag: '🇺🇸' },
  // International default → USD pricing.
  OTHER: { currency: 'USD', symbol: '$', priceField: 'priceUSD', locale: 'en-US', label: 'International', flag: '🌍' },
};

// Country → region. EUR covers EU/EEA + UK + CH; USD covers US (+ default for the rest).
const EUR_COUNTRIES = new Set([
  'FR', 'BE', 'CH', 'LU', 'MC', // francophone-friendly first
  'DE', 'NL', 'ES', 'IT', 'PT', 'IE', 'AT', 'FI', 'GR', 'SE', 'DK', 'PL', 'CZ', 'RO', 'HU',
  'SK', 'SI', 'HR', 'BG', 'EE', 'LV', 'LT', 'CY', 'MT', 'NO', 'IS', 'LI', 'GB',
]);

export function regionFromCountry(country) {
  if (!country) return 'OTHER';
  const c = country.toUpperCase();
  if (c === 'MA') return 'MA';
  if (c === 'US') return 'US';
  if (EUR_COUNTRIES.has(c)) return 'EU';
  return 'OTHER';
}

export function getRegionConfig(region) {
  return REGION_CONFIG[region] || REGION_CONFIG.MA;
}

// Resolve the displayable price of a product for a region.
// Falls back to the MAD base price if the regional price isn't set yet (mock-price phase).
export function resolvePrice(product, region) {
  const cfg = getRegionConfig(region);
  const value = product?.[cfg.priceField];
  if (value === null || value === undefined) {
    // Regional price not set — fall back to MAD so nothing breaks during rollout.
    return { amount: product?.price, currency: 'MAD', symbol: 'DH', isFallback: true };
  }
  return { amount: value, currency: cfg.currency, symbol: cfg.symbol, isFallback: false };
}

// Format an amount in a given currency, French/English locale per region.
export function formatMoney(amount, region) {
  const cfg = getRegionConfig(region);
  if (typeof amount !== 'number') return '';
  if (cfg.currency === 'MAD') {
    // Preserve the storefront's existing MAD display exactly.
    return `${amount.toLocaleString()} MAD`;
  }
  try {
    return new Intl.NumberFormat(cfg.locale, { style: 'currency', currency: cfg.currency }).format(amount);
  } catch {
    return `${cfg.symbol}${amount}`;
  }
}
