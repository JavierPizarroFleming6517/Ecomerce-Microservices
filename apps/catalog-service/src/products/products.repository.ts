import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type FilterQuery, type Model, type Types } from 'mongoose';
import { Product, type ProductDocument } from './schemas/product.schema';

export interface CreateProduct {
  sku: string;
  name: string;
  description?: string;
  category: Types.ObjectId;
  attributes?: Map<string, unknown> | Record<string, unknown>;
  price: number;
  currency: string;
  imageUrl?: string;
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

  findActive(
    limit: number,
    categoryId?: Types.ObjectId,
  ): Promise<ProductDocument[]> {
    const filter: FilterQuery<Product> = { active: true };

    if (categoryId) {
      filter.category = categoryId;
    }

    return this.productModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('category')
      .exec();
  }
}
