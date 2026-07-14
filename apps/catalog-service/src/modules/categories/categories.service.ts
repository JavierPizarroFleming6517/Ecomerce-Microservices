import { Injectable } from '@nestjs/common';
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
}
