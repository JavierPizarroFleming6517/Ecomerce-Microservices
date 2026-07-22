export interface ProductSummaryDto {
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
}

export interface ListProductsRequestDto {
  limit?: number;
  categorySlug?: string;
  correlationId?: string;
}

export interface ListProductsResponseDto {
  items: ProductSummaryDto[];
}

export interface CategorySummaryDto {
  name: string;
  slug: string;
}

export interface ListCategoriesRequestDto {
  correlationId?: string;
}

export interface ListCategoriesResponseDto {
  items: CategorySummaryDto[];
}
