import { Injectable, NotFoundException } from '@nestjs/common';
import type { ProductSummaryDto } from '@retail/contracts';
import type { Types } from 'mongoose';
import {
  type CreateProduct,
  ProductsRepository,
} from './products.repository';
import type { ProductDocument } from './schemas/product.schema';
import type { CategoryDocument } from '../categories/schemas/category.schema';

const DEFAULT_LIST_LIMIT = 12;
const MAX_LIST_LIMIT = 50;

@Injectable()
export class ProductsService {
  constructor(private readonly products: ProductsRepository) {}

  create(input: CreateProduct) {
    return this.products.create(input);
  }

  findBySku(sku: string) {
    return this.products.findBySku(sku);
  }

  async getActiveBySku(sku: string): Promise<ProductSummaryDto> {
    const product = await this.products.findBySku(sku);
    if (!product) {
      throw new NotFoundException(`Product ${sku} not found`);
    }

    return this.toSummary(product);
  }

  async listActive(
    limit = DEFAULT_LIST_LIMIT,
    categoryId?: Types.ObjectId,
  ): Promise<ProductSummaryDto[]> {
    const safeLimit = Math.min(Math.max(limit, 1), MAX_LIST_LIMIT);
    const products = await this.products.findActive(safeLimit, categoryId);

    return products.map((product) => this.toSummary(product));
  }

  private toSummary(product: ProductDocument): ProductSummaryDto {
    const category = product.category as unknown;
    const categoryName =
      category && typeof category === 'object' && 'name' in category
        ? (category as CategoryDocument).name
        : '';

    return {
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      imageUrl: product.imageUrl,
      category: categoryName,
    };
  }
}
