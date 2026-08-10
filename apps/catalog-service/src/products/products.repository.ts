import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type FilterQuery, type Model, type Types } from 'mongoose';
import { Product, type ProductDocument } from './schemas/product.schema';

export interface CreateProduct {
  sku: string;
  name: string;
  description?: string;
  longDescription?: string;
  brand?: string;
  highlights?: string[];
  specs?: Array<{ label: string; value: string }>;
  imageUrls?: string[];
  category: Types.ObjectId;
  attributes?: Map<string, unknown> | Record<string, unknown>;
  price: number;
  currency: string;
  imageUrl?: string;
  stockOnline?: number;
  active?: boolean;
}

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  create(input: CreateProduct): Promise<ProductDocument> {
    return this.productModel.create(input);
  }

  findBySku(sku: string): Promise<ProductDocument | null> {
    return this.productModel
      .findOne({ sku: sku.toUpperCase(), active: true })
      .populate('category')
      .exec();
  }

  private activeFilter(categoryId?: Types.ObjectId): FilterQuery<Product> {
    const filter: FilterQuery<Product> = { active: true };

    if (categoryId) {
      filter.category = categoryId;
    }

    return filter;
  }

  findActive(
    limit: number,
    categoryId?: Types.ObjectId,
    skip = 0,
  ): Promise<ProductDocument[]> {
    return this.productModel
      .find(this.activeFilter(categoryId))
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category')
      .exec();
  }

  countActive(categoryId?: Types.ObjectId): Promise<number> {
    return this.productModel.countDocuments(this.activeFilter(categoryId)).exec();
  }

  findSimilar(
    categoryId: Types.ObjectId,
    excludeSku: string,
    limit = 8,
  ): Promise<ProductDocument[]> {
    return this.productModel
      .find({
        active: true,
        category: categoryId,
        sku: { $ne: excludeSku.toUpperCase() },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('category')
      .exec();
  }
}
