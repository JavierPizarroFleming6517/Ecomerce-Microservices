import type { ListProductsResponseDto, ProductSummaryDto } from '@retail/contracts'
import { getApi } from '../../lib/http'

export async function getFeaturedProducts(
  limit = 8,
  categorySlug?: string | null,
  signal?: AbortSignal,
): Promise<ProductSummaryDto[]> {
  const params = new URLSearchParams({ limit: String(limit) })

  if (categorySlug) {
    params.set('category', categorySlug)
  }

  const response = await getApi<ListProductsResponseDto>(
    `/api/v1/catalog/products?${params.toString()}`,
    signal,
  )

  return response?.items ?? []
}
