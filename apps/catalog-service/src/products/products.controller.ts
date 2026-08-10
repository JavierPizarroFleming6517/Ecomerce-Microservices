import { Controller, Get, Param, Query } from '@nestjs/common';
import type {
  ListProductsResponseDto,
  ProductDetailDto,
  ProductSummaryDto,
} from '@retail/contracts';
import { CategoriesService } from '../categories/categories.service';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly products: ProductsService,
    private readonly categories: CategoriesService,
  ) {}

  @Get()
  async list(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('category') category?: string,
  ): Promise<ListProductsResponseDto> {
    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedPage = page ? Number(page) : 1;

    if (category) {
      const found = await this.categories.findBySlug(category);
      if (!found) {
        return {
          items: [],
          page: Number.isFinite(parsedPage) ? Math.max(parsedPage, 1) : 1,
          pageSize:
            parsedLimit && Number.isFinite(parsedLimit) ? parsedLimit : 12,
          total: 0,
          totalPages: 0,
        };
      }

      return this.products.listActive(parsedLimit, found._id, parsedPage);
    }

    return this.products.listActive(parsedLimit, undefined, parsedPage);
  }

  @Get(':sku/similar')
  listSimilar(
    @Param('sku') sku: string,
    @Query('limit') limit?: string,
  ): Promise<ProductSummaryDto[]> {
    const parsedLimit = limit ? Number(limit) : 8;
    return this.products.listSimilar(sku, parsedLimit);
  }

  @Get(':sku')
  getBySku(@Param('sku') sku: string): Promise<ProductDetailDto> {
    return this.products.getActiveBySku(sku);
  }
}
