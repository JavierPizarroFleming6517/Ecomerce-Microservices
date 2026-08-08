import { createContext } from 'react'
import type { ProductSummaryDto } from '@retail/contracts'
import type { CartItem } from './cart-types'

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  currency: string
  addItem: (product: ProductSummaryDto, quantity?: number) => void
  removeItem: (sku: string) => void
  setQuantity: (sku: string, quantity: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
