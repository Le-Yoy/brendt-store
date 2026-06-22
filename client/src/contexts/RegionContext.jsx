'use client';

// Region/currency context. The edge middleware sets a `region` cookie from the
// visitor's country; here we read it, expose the active region + currency, allow
// a manual switch (MA/EU/USA), and provide price helpers used across the store.
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getRegionConfig, resolvePrice, formatMoney, REGIONS } from '@/utils/currency';

const RegionContext = createContext(null);

const readCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
};

export function RegionProvider({ children }) {
  // Initialise from the cookie synchronously on the client to avoid a flash.
  const [region, setRegionState] = useState(() => {
    const c = readCookie('region');
    return REGIONS.includes(c) ? c : 'MA';
  });

  // After mount, re-sync from cookie (covers the SSR default case).
  useEffect(() => {
    const c = readCookie('region');
    if (REGIONS.includes(c) && c !== region) setRegionState(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setRegion = useCallback((next) => {
    if (!REGIONS.includes(next)) return;
    document.cookie = `region=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setRegionState(next);
  }, []);

  const config = getRegionConfig(region);

  const value = {
    region,
    setRegion,
    currency: config.currency,
    config,
    // Price helpers
    priceOf: (product) => resolvePrice(product, region),
    format: (amount) => formatMoney(amount, region),
    formatProduct: (product) => {
      const p = resolvePrice(product, region);
      return formatMoney(p.amount, p.currency === 'MAD' ? 'MA' : region);
    },
    isMorocco: region === 'MA',
  };

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    // Safe fallback so components never crash if used outside the provider.
    return {
      region: 'MA',
      setRegion: () => {},
      currency: 'MAD',
      config: getRegionConfig('MA'),
      priceOf: (product) => resolvePrice(product, 'MA'),
      format: (amount) => formatMoney(amount, 'MA'),
      formatProduct: (product) => formatMoney(resolvePrice(product, 'MA').amount, 'MA'),
      isMorocco: true,
    };
  }
  return ctx;
}

export default RegionContext;
