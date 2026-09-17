/**
 * Format number as Vietnamese currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a price number with dots separator (no currency symbol)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}
