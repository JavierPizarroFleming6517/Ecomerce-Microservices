import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, type Types } from 'mongoose';
import {
  Category,
  type CategoryDocument,
} from './schemas/category.schema';

export interface CreateCategory {
  name: string;
  slug: string;
  parentId?: Types.ObjectId | null;
  active?: boolean;
}

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  create(input: CreateCategory): Promise<CategoryDocument> {
    return this.categoryModel.create(input);
  }

  findBySlug(slug: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findOne({ slug: slug.toLowerCase() }).exec();
  }
}
