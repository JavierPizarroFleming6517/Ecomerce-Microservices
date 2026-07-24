import { Controller, Get, Query } from '@nestjs/common';
import type { ListProductsResponseDto } from '@retail/contracts';
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
    @Query('category') category?: string,
  ): Promise<ListProductsResponseDto> {
    const parsedLimit = limit ? Number(limit) : undefined;

    if (category) {
      const found = await this.categories.findBySlug(category);
      const items = found
        ? await this.products.listActive(parsedLimit, found._id)
        : [];

      return { items };
    }

    const items = await this.products.listActive(parsedLimit);
    return { items };
  }
}
