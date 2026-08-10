import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  ListProductsResponseDto,
  ProductDetailDto,
  ProductSummaryDto,
} from '@retail/contracts';
import { Types } from 'mongoose';
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

  async getActiveBySku(sku: string): Promise<ProductDetailDto> {
    const product = await this.products.findBySku(sku);
    if (!product) {
      throw new NotFoundException(`Product ${sku} not found`);
    }

    return this.toDetail(product);
  }

  async listSimilar(sku: string, limit = 8): Promise<ProductSummaryDto[]> {
    const product = await this.products.findBySku(sku);
    if (!product) {
      throw new NotFoundException(`Product ${sku} not found`);
    }

    const categoryId = this.resolveCategoryId(product.category);
    const similar = await this.products.findSimilar(categoryId, sku, limit);
    return similar.map((item) => this.toSummary(item));
  }

  async listActive(
    limit = DEFAULT_LIST_LIMIT,
    categoryId?: Types.ObjectId,
    page = 1,
  ): Promise<ListProductsResponseDto> {
    const pageSize = Math.min(Math.max(limit, 1), MAX_LIST_LIMIT);
    const safePage = Number.isFinite(page) ? Math.max(Math.floor(page), 1) : 1;
    const skip = (safePage - 1) * pageSize;

    const [products, total] = await Promise.all([
      this.products.findActive(pageSize, categoryId, skip),
      this.products.countActive(categoryId),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

    return {
      items: products.map((product) => this.toSummary(product)),
      page: safePage,
      pageSize,
      total,
      totalPages,
    };
  }

  private resolveCategoryId(
    category: Types.ObjectId | CategoryDocument,
  ): Types.ObjectId {
    if (category instanceof Types.ObjectId) {
      return category;
    }

    return category._id;
  }

  private categoryName(product: ProductDocument): string {
    const category = product.category as unknown;
    return category && typeof category === 'object' && 'name' in category
      ? (category as CategoryDocument).name
      : '';
  }

  private toSummary(product: ProductDocument): ProductSummaryDto {
    return {
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      imageUrl: product.imageUrl,
      category: this.categoryName(product),
      ...(product.brand ? { brand: product.brand } : {}),
    };
  }

  private toDetail(product: ProductDocument): ProductDetailDto {
    const images =
      product.imageUrls?.length > 0
        ? product.imageUrls
        : product.imageUrl
          ? [product.imageUrl]
          : [];

    return {
      ...this.toSummary(product),
      brand: product.brand || 'Retail',
      longDescription: product.longDescription || product.description,
      highlights: product.highlights ?? [],
      specs: (product.specs ?? []).map((spec) => ({
        label: spec.label,
        value: spec.value,
      })),
      images,
      stockOnline: product.stockOnline ?? 0,
    };
  }
}
