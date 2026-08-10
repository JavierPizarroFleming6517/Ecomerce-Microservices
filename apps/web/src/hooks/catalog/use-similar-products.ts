import type { ProductSummaryDto } from '@retail/contracts'
import { useCallback, useEffect, useState } from 'react'
import { getSimilarProducts } from '../../api/catalog'

async function fetchSimilar(
  sku: string,
  setProducts: (products: ProductSummaryDto[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  signal?: AbortSignal,
) {
  try {
    const items = await getSimilarProducts(sku, 8, signal)
    if (!signal?.aborted) {
      setProducts(items)
      setIsLoading(false)
    }
  } catch {
    if (!signal?.aborted) {
      setProducts([])
      setIsLoading(false)
    }
  }
}

export function useSimilarProducts(sku: string | undefined) {
  const [products, setProducts] = useState<ProductSummaryDto[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(sku))

  const load = useCallback(
    (signal?: AbortSignal) => {
      if (!sku) {
        return Promise.resolve()
      }
      return fetchSimilar(sku, setProducts, setIsLoading, signal)
    },
    [sku],
  )

  useEffect(() => {
    if (!sku) {
      return
    }

    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load, sku])

  return { products, isLoading }
}
