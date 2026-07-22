import type { ProductSummaryDto } from '@retail/contracts'
import { useCallback, useEffect, useState } from 'react'
import { getFeaturedProducts } from './api'

const FEATURED_PRODUCTS_LIMIT = 12

async function fetchProducts(
  categorySlug: string | null,
  setProducts: (products: ProductSummaryDto[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  signal?: AbortSignal,
) {
  try {
    const nextProducts = await getFeaturedProducts(
      FEATURED_PRODUCTS_LIMIT,
      categorySlug,
      signal,
    )

    if (!signal?.aborted) {
      setProducts(nextProducts)
      setError(null)
      setIsLoading(false)
    }
  } catch (error) {
    if (!signal?.aborted) {
      setError(
        error instanceof Error
          ? error.message
          : 'No fue posible cargar los productos destacados.',
      )
      setIsLoading(false)
    }
  }
}

export function useFeaturedProducts(categorySlug: string | null) {
  const [products, setProducts] = useState<ProductSummaryDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    (signal?: AbortSignal) =>
      fetchProducts(categorySlug, setProducts, setIsLoading, setError, signal),
    [categorySlug],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)

    return () => controller.abort()
  }, [load])

  return { products, isLoading, error }
}
