/**
 * Client-compatible product utilities
 * These functions can be used in both client and server components
 */

/**
 * Format price in Nigerian Naira
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(price)
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(originalPrice: number, discountPercent: number): number {
  return originalPrice * (discountPercent / 100)
}

/**
 * Calculate final price after discount
 */
export function calculateFinalPrice(originalPrice: number, discountPercent: number): number {
  return originalPrice - calculateDiscount(originalPrice, discountPercent)
}

/**
 * Generate product slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
