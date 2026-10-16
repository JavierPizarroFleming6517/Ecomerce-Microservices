import type { ProductSummaryDto } from '@retail/contracts'
import { useCallback, useEffect, useState } from 'react'
import { getProductsPage } from '../../api/catalog'

const PAGE_SIZE = 12

async function fetchProductsPage(
  categorySlug: string | null,
  page: number,
  requestKey: string,
  setProducts: (products: ProductSummaryDto[]) => void,
  setPage: (page: number) => void,
  setTotalPages: (totalPages: number) => void,
  setTotal: (total: number) => void,
  setLoadedKey: (requestKey: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  signal?: AbortSignal,
) {
  setIsLoading(true)

  try {
    const response = await getProductsPage(
      PAGE_SIZE,
      page,
      categorySlug,
      signal,
    )

    if (!signal?.aborted) {
      setProducts(response.items)
      setPage(response.page)
      setTotalPages(response.totalPages)
      setTotal(response.total)
      setLoadedKey(requestKey)
      setError(null)
      setIsLoading(false)
    }
  } catch (error) {
    if (!signal?.aborted) {
      setProducts([])
      setTotal(0)
      setTotalPages(0)
      setLoadedKey(requestKey)
      setError(
        error instanceof Error
          ? error.message
          : 'No fue posible cargar los productos.',
      )
      setIsLoading(false)
    }
  }
}

export function useFeaturedProducts(
  categorySlug: string | null,
  page: number,
) {
  const requestKey = `${categorySlug ?? ''}:${page}`
  const [products, setProducts] = useState<ProductSummaryDto[]>([])
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const matchesRequest = loadedKey === requestKey

  const load = useCallback(
    (signal?: AbortSignal) =>
      fetchProductsPage(
        categorySlug,
        page,
        requestKey,
        setProducts,
        setCurrentPage,
        setTotalPages,
        setTotal,
        setLoadedKey,
        setIsLoading,
        setError,
        signal,
      ),
    [categorySlug, page, requestKey],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)

    return () => controller.abort()
  }, [load])

  return {
    products: matchesRequest ? products : [],
    page: matchesRequest ? currentPage : page,
    totalPages: matchesRequest ? totalPages : 0,
    total: matchesRequest ? total : 0,
    pageSize: PAGE_SIZE,
    isLoading: !matchesRequest || isLoading,
    error: matchesRequest ? error : null,
  }
}
