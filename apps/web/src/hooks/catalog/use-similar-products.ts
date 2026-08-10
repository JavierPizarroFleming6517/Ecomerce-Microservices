import type { HybridRelatedProductsDto } from '@retail/contracts'
import { useCallback, useEffect, useState } from 'react'
import { getSimilarProducts } from '../../api/catalog'

const EMPTY_RELATED: HybridRelatedProductsDto = {
  coPurchase: [],
  byCategory: [],
}

async function fetchSimilar(
  sku: string,
  setRelated: (related: HybridRelatedProductsDto) => void,
  setIsLoading: (isLoading: boolean) => void,
  signal?: AbortSignal,
) {
  try {
    const items = await getSimilarProducts(sku, 8, signal)
    if (!signal?.aborted) {
      setRelated(items)
      setIsLoading(false)
    }
  } catch {
    if (!signal?.aborted) {
      setRelated(EMPTY_RELATED)
      setIsLoading(false)
    }
  }
}

export function useSimilarProducts(sku: string | undefined) {
  const [related, setRelated] =
    useState<HybridRelatedProductsDto>(EMPTY_RELATED)
  const [isLoading, setIsLoading] = useState(Boolean(sku))

  const load = useCallback(
    (signal?: AbortSignal) => {
      if (!sku) {
        return Promise.resolve()
      }
      return fetchSimilar(sku, setRelated, setIsLoading, signal)
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

  return { related, isLoading }
}
