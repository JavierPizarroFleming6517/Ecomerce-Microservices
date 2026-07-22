export function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
    }).format(price)
  } catch {
    return `${price.toFixed(2)} ${currency}`
  }
}
