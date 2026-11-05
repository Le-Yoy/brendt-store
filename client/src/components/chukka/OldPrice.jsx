'use client';

import { useRegion } from '@/contexts/RegionContext';
import { formatMoney } from '@/utils/currency';

// Crossed-out old price. previousPrice is in MAD, so it only shows when the
// visitor also sees the MAD price.
export default function OldPrice({ product, className }) {
  const { priceOf } = useRegion();
  if (!product?.previousPrice || product.previousPrice <= product.price) return null;
  if (priceOf(product).currency !== 'MAD') return null;
  return <s className={className}>{formatMoney(product.previousPrice, 'MA')}</s>;
}

// Products that show the crossed-out price BEFORE the current one.
const OLD_PRICE_FIRST = ['chukka grainé', 'brendtford'];
export const showsOldPriceFirst = (product) =>
  OLD_PRICE_FIRST.includes((product?.name || '').toLowerCase());
