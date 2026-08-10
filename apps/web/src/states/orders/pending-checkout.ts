import type { CartItem } from '../cart/cart-types'

const STORAGE_KEY = 'retail.pendingCheckout.v1'

export interface PendingCheckout {
  items: CartItem[]
  amount: number
  currency: string
  createdAt: string
}

export function savePendingCheckout(checkout: PendingCheckout): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checkout))
}

export function readPendingCheckout(): PendingCheckout | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as PendingCheckout
    if (!Array.isArray(parsed.items) || !parsed.amount) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearPendingCheckout(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}
