import type {
  CategorySummaryDto,
  HybridRelatedProductsDto,
  ListCategoriesResponseDto,
  ListProductsResponseDto,
  ProductDetailDto,
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

export async function getProductsPage(
  limit = 12,
  page = 1,
  categorySlug?: string | null,
  signal?: AbortSignal,
): Promise<ListProductsResponseDto> {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  })

  if (categorySlug) {
    params.set('category', categorySlug)
  }

  return getApi<ListProductsResponseDto>(
    `/api/v1/catalog/products?${params.toString()}`,
    signal,
  )
}

/** @deprecated Prefer getProductsPage for pagination metadata. */
export async function getProducts(
  limit = 12,
  categorySlug?: string | null,
  signal?: AbortSignal,
): Promise<ProductSummaryDto[]> {
  const response = await getProductsPage(limit, 1, categorySlug, signal)
  return response?.items ?? []
}

export async function getProduct(
  sku: string,
  signal?: AbortSignal,
): Promise<ProductDetailDto> {
  return getApi<ProductDetailDto>(
    `/api/v1/catalog/products/${encodeURIComponent(sku)}`,
    signal,
  )
}

export async function getSimilarProducts(
  sku: string,
  limit = 8,
  signal?: AbortSignal,
): Promise<HybridRelatedProductsDto> {
  const params = new URLSearchParams({ limit: String(limit) })
  const response = await getApi<HybridRelatedProductsDto>(
    `/api/v1/catalog/products/${encodeURIComponent(sku)}/similar?${params.toString()}`,
    signal,
  )

  return {
    coPurchase: response?.coPurchase ?? [],
    byCategory: response?.byCategory ?? [],
  }
}
