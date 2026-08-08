import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ProductSummaryDto } from '@retail/contracts'
import { CartContext, type CartContextValue } from './cart-context-instance'
import type { CartItem } from './cart-types'

const STORAGE_KEY = 'retail.cart.v1'

function readStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredItems())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: ProductSummaryDto, quantity = 1) => {
    const safeQuantity = Math.max(1, Math.floor(quantity))
    setItems((current) => {
      const existing = current.find((item) => item.sku === product.sku)
      if (existing) {
        return current.map((item) =>
          item.sku === product.sku
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item,
        )
      }

      return [
        ...current,
        {
          sku: product.sku,
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          imageUrl: product.imageUrl,
          category: product.category,
          quantity: safeQuantity,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((sku: string) => {
    setItems((current) => current.filter((item) => item.sku !== sku))
  }, [])

  const setQuantity = useCallback((sku: string, quantity: number) => {
    const next = Math.floor(quantity)
    if (next <= 0) {
      setItems((current) => current.filter((item) => item.sku !== sku))
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.sku === sku ? { ...item, quantity: next } : item,
      ),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    const currency = items[0]?.currency ?? 'CLP'

    return {
      items,
      itemCount,
      subtotal,
      currency,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }
  }, [addItem, clearCart, items, removeItem, setQuantity])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
