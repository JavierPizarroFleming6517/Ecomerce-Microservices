import { Injectable } from '@nestjs/common';
import type { CategorySummaryDto } from '@retail/contracts';
import {
  CategoriesRepository,
  type CreateCategory,
} from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categories: CategoriesRepository) {}

  create(input: CreateCategory) {
    return this.categories.create(input);
  }

  findBySlug(slug: string) {
    return this.categories.findBySlug(slug);
  }

  async listAll(): Promise<CategorySummaryDto[]> {
    const categories = await this.categories.findAllActive();

    return categories.map((category) => ({
      name: category.name,
      slug: category.slug,
    }));
  }
}
