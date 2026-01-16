/**
 * Format price to currency string
 */
export const formatPrice = (price: number | string | null | undefined, currency: string = '$'): string => {
  if (price === null || price === undefined) return `${currency}0.00`;
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return `${currency}0.00`;
  return `${currency}${numPrice.toFixed(2)}`;
};

