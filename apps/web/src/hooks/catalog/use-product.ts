import type { ProductDetailDto } from '@retail/contracts'
import { useCallback, useEffect, useState } from 'react'
import { getProduct } from '../../api/catalog'

async function fetchProduct(
  sku: string,
  setProduct: (product: ProductDetailDto | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  signal?: AbortSignal,
) {
  try {
    const nextProduct = await getProduct(sku, signal)
    if (!signal?.aborted) {
      setProduct(nextProduct)
      setError(null)
      setIsLoading(false)
    }
  } catch (error) {
    if (!signal?.aborted) {
      setProduct(null)
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar el producto',
      )
      setIsLoading(false)
    }
  }
}

export function useProduct(sku: string | undefined) {
  const [product, setProduct] = useState<ProductDetailDto | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(sku))
  const [error, setError] = useState<string | null>(
    sku ? null : 'Producto no encontrado',
  )

  const load = useCallback(
    (signal?: AbortSignal) => {
      if (!sku) {
        return Promise.resolve()
      }

      return fetchProduct(sku, setProduct, setIsLoading, setError, signal)
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

  return { product, isLoading, error }
}
