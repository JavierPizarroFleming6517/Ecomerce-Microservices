export interface ProductSpecDto {
  label: string
  value: string
}

export interface ProductSummaryDto {
  sku: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl: string
  category: string
  brand?: string
}

export interface ProductDetailDto extends ProductSummaryDto {
  brand: string
  longDescription: string
  highlights: string[]
  specs: ProductSpecDto[]
  images: string[]
  stockOnline: number
}

export interface ListProductsRequestDto {
  limit?: number
  page?: number
  categorySlug?: string
  correlationId?: string
}

export interface ListProductsResponseDto {
  items: ProductSummaryDto[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface CategorySummaryDto {
  name: string
  slug: string
}

export interface ListCategoriesRequestDto {
  correlationId?: string
}

export interface ListCategoriesResponseDto {
  items: CategorySummaryDto[]
}
