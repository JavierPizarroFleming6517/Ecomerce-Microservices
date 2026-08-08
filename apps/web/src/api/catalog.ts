import type {
  CategorySummaryDto,
  ListCategoriesResponseDto,
  ListProductsResponseDto,
  ProductSummaryDto,
} from '@retail/contracts'
import { getApi } from '../lib/http'

export async function getCategories(
  signal?: AbortSignal,
): Promise<CategorySummaryDto[]> {
  const response = await getApi<ListCategoriesResponseDto>(
    '/api/v1/catalog/categories',
    signal,
  )

  return response?.items ?? []
}

export async function getProducts(
  limit = 12,
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

export async function getProduct(
  sku: string,
  signal?: AbortSignal,
): Promise<ProductSummaryDto> {
  return getApi<ProductSummaryDto>(
    `/api/v1/catalog/products/${encodeURIComponent(sku)}`,
    signal,
  )
}
