import type { ProductSummaryDto } from '@retail/contracts'
import { useCallback, useEffect, useState } from 'react'
import { getProductsPage } from '../../api/catalog'

const PAGE_SIZE = 12

async function fetchProductsPage(
  categorySlug: string | null,
  page: number,
  setProducts: (products: ProductSummaryDto[]) => void,
  setPage: (page: number) => void,
  setTotalPages: (totalPages: number) => void,
  setTotal: (total: number) => void,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  signal?: AbortSignal,
) {
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
      setError(null)
      setIsLoading(false)
    }
  } catch (error) {
    if (!signal?.aborted) {
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
  const [products, setProducts] = useState<ProductSummaryDto[]>([])
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    (signal?: AbortSignal) =>
      fetchProductsPage(
        categorySlug,
        page,
        setProducts,
        setCurrentPage,
        setTotalPages,
        setTotal,
        setIsLoading,
        setError,
        signal,
      ),
    [categorySlug, page],
  )

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)

    return () => controller.abort()
  }, [load])

  return {
    products,
    page: currentPage,
    totalPages,
    total,
    pageSize: PAGE_SIZE,
    isLoading,
    error,
  }
}
