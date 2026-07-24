import { Controller, Get } from '@nestjs/common';
import type { ListCategoriesResponseDto } from '@retail/contracts';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  async list(): Promise<ListCategoriesResponseDto> {
    const items = await this.categories.listAll();
    return { items };
  }
}
