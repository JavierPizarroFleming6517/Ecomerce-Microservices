import type { CategorySummaryDto, ListCategoriesResponseDto } from '@retail/contracts'
import { getApi } from '../../lib/http'

export async function getCategories(signal?: AbortSignal): Promise<CategorySummaryDto[]> {
  const response = await getApi<ListCategoriesResponseDto>(
    '/api/v1/catalog/categories',
    signal,
  )

  return response?.items ?? []
}
